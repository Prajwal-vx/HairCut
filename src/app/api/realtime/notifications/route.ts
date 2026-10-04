import { NextResponse } from "next/server";
import { validateOrigin } from "@/lib/auth";
import { readDatabase } from "@/lib/db";
import { getRequestIdentity } from "@/lib/request-auth";

export async function GET(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create SSE stream for user notifications
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial notifications
      const db = readDatabase();
      const userNotifications = db.notifications.filter((n) => n.userId === identity.user.id);
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "initial", notifications: userNotifications })}\n\n`));

      // Set up periodic updates (every 10 seconds)
      let lastNotificationCount = userNotifications.length;
      const interval = setInterval(() => {
        const db = readDatabase();
        const currentNotifications = db.notifications.filter((n) => n.userId === identity.user.id);

        // Only send update if there are new notifications
        if (currentNotifications.length > lastNotificationCount) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "new", notifications: currentNotifications })}\n\n`));
          lastNotificationCount = currentNotifications.length;
        }
      }, 10000);

      // Clean up on connection close
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
