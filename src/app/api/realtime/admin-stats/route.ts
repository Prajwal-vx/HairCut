import { NextResponse } from "next/server";
import { readDatabase } from "@/lib/db";
import { SalonDatabase } from "@/lib/types";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  const db = readDatabase();
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageSalon(identity)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const stats = getAdminStats(db);
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(stats)}\n\n`));

      // Set up periodic updates (every 5 seconds)
      const interval = setInterval(() => {
        const db = readDatabase();
        const updatedStats = getAdminStats(db);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(updatedStats)}\n\n`));
      }, 5000);

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

function getAdminStats(db: SalonDatabase) {
  const completed = db.appointments.filter((a) => a.status === "completed");
  const upcoming = db.appointments.filter((a) => a.status === "upcoming");
  const totalRevenue = completed.reduce((sum, a) => sum + a.amountPaid, 0);

  // Most booked service
  const srvCounts: Record<string, number> = {};
  for (const a of db.appointments) {
    srvCounts[a.serviceId] = (srvCounts[a.serviceId] || 0) + 1;
  }
  const topSrvId = Object.entries(srvCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topService = db.services.find((s) => s.id === topSrvId);

  // Repeat visit rate
  const userVisitCounts: Record<string, number> = {};
  for (const a of completed) {
    userVisitCounts[a.userId] = (userVisitCounts[a.userId] || 0) + 1;
  }
  const repeatClients = Object.values(userVisitCounts).filter((c: number) => c > 1).length;
  const totalClients = db.users.filter((u) => u.role === "CLIENT").length;
  const repeatRate = totalClients > 0 ? Math.round((repeatClients / totalClients) * 100) : 0;

  // Users due for 35-40 day reminder
  const now = Date.now();
  const usersNeedingReminder = db.users.filter((u) => {
    if (!u.lastVisitDate) return false;
    const days = Math.floor((now - new Date(u.lastVisitDate).getTime()) / 86400000);
    return days >= 35 && days <= 40;
  });

  return {
    totalClients,
    totalAppointments: db.appointments.length,
    upcomingCount: upcoming.length,
    completedCount: completed.length,
    totalRevenue,
    repeatRate,
    topService: topService?.name || "N/A",
    galleryCount: db.galleryPhotos.length,
    usersNeedingReminderCount: usersNeedingReminder.length,
    timestamp: Date.now(),
  };
}
