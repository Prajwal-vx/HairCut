import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { validateOrigin } from "@/lib/auth";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";
import { Appointment, LoyaltyTransaction } from "@/lib/types";

const VALID_TIME_SLOTS = new Set([
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM",
]);
const VALID_STATUSES = new Set(["upcoming", "completed", "cancelled", "no-show"]);

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = readDatabase();
  let appointments = db.appointments;
  if (!canManageSalon(identity)) {
    appointments = appointments.filter((a) => a.userId === identity.user.id);
  }

  // Enrich with stylist and service names
  const enriched = appointments.map((a) => {
    const stylist = db.stylists.find((s) => s.id === a.stylistId);
    const service = db.services.find((s) => s.id === a.serviceId);
    const user = db.users.find((u) => u.id === a.userId);
    return { ...a, stylistName: stylist?.name, serviceName: service?.name, userName: user?.fullName };
  });

  return NextResponse.json({ appointments: enriched });
}

export async function POST(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Please log in to book an appointment." }, { status: 401 });
  const userId = identity.user.id;

  const { stylistId, serviceId, visitDate, timeSlot, notes } = await req.json();
  if (!stylistId || !serviceId || !visitDate || !timeSlot) {
    return NextResponse.json({ error: "Stylist, service, date, and time are required." }, { status: 400 });
  }

  const parsedVisitDate = typeof visitDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(visitDate)
    ? new Date(`${visitDate}T00:00:00.000Z`)
    : null;
  if (!parsedVisitDate || parsedVisitDate.toISOString().slice(0, 10) !== visitDate || visitDate <= new Date().toISOString().slice(0, 10)) {
    return NextResponse.json({ error: "Appointments must be booked for a future date." }, { status: 400 });
  }
  if (typeof timeSlot !== "string" || !VALID_TIME_SLOTS.has(timeSlot)) {
    return NextResponse.json({ error: "Please choose a valid salon time slot." }, { status: 400 });
  }
  if (typeof notes !== "undefined" && (typeof notes !== "string" || notes.length > 500)) {
    return NextResponse.json({ error: "Notes must be 500 characters or fewer." }, { status: 400 });
  }

  const db = readDatabase();
  const service = db.services.find((s) => s.id === serviceId);
  if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });

  let assignedStylistId = stylistId;
  if (assignedStylistId === "any") {
    const availableStylist = db.stylists.find(
      (stylist) => stylist.active && !db.appointments.some(
        (appointment) => appointment.stylistId === stylist.id && appointment.visitDate === visitDate && appointment.timeSlot === timeSlot && appointment.status === "upcoming"
      )
    );
    if (!availableStylist) {
      return NextResponse.json({ error: "No stylist is available for that time. Please choose another slot." }, { status: 409 });
    }
    assignedStylistId = availableStylist.id;
  }

  const stylist = db.stylists.find((item) => item.id === assignedStylistId && item.active);
  if (!stylist) return NextResponse.json({ error: "Stylist not found or unavailable." }, { status: 404 });

  // Check slot availability (same stylist, same date, same time)
  const conflict = db.appointments.find(
    (a) => a.stylistId === assignedStylistId && a.visitDate === visitDate && a.timeSlot === timeSlot && a.status === "upcoming"
  );
  if (conflict) {
    return NextResponse.json({ error: "This time slot is already booked. Please choose another." }, { status: 409 });
  }

  const newApt: Appointment = {
    id: "apt-" + Date.now(),
    userId,
    stylistId: assignedStylistId,
    serviceId,
    visitDate,
    timeSlot,
    status: "upcoming",
    notes: notes?.trim() || "",
    amountPaid: service.price,
    createdAt: new Date().toISOString(),
  };

  db.appointments.push(newApt);

  // Create in-app booking confirmation notification
  db.notifications.unshift({
    id: "notif-" + Date.now(),
    userId,
    type: "booking_confirmed",
    channel: "app",
    status: "delivered",
    message: `Your appointment for ${service.name} on ${visitDate} at ${timeSlot} has been confirmed. We look forward to seeing you at Unisex Haircut, Birtamode! 💈`,
    sentAt: new Date().toISOString(),
  });

  writeDatabase(db);

  return NextResponse.json({
    success: true,
    appointment: { ...newApt, serviceName: service.name, stylistName: stylist?.name },
  });
}

export async function PATCH(req: Request) {
  // Origin validation for CSRF protection
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const identity = await getRequestIdentity(req);
  if (!identity) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { appointmentId, status } = body as Record<string, unknown>;
  if (typeof appointmentId !== "string" || !appointmentId || typeof status !== "string" || !VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "appointmentId and status required" }, { status: 400 });
  }

  const db = readDatabase();
  const aptIndex = db.appointments.findIndex((a) => a.id === appointmentId);
  if (aptIndex === -1) return NextResponse.json({ error: "Appointment not found." }, { status: 404 });

  const apt = db.appointments[aptIndex];
  const isStaffOrOwner = canManageSalon(identity);

  // Appointment completion is a one-way transition so loyalty rewards cannot be earned repeatedly.
  if (apt.status !== "upcoming") {
    return NextResponse.json({ error: "Only upcoming appointments can be updated." }, { status: 409 });
  }

  // Clients can only cancel their own appointments; only staff or owners can alter other statuses.
  if (!isStaffOrOwner) {
    if (apt.userId !== identity.user.id || status !== "cancelled") {
      return NextResponse.json(
        { error: "Forbidden: Clients may only cancel their own appointments. Only staff/owner can mark visits completed." },
        { status: 403 }
      );
    }
  }

  db.appointments[aptIndex].status = status as Appointment["status"];

  if (status === "completed") {
    db.appointments[aptIndex].completedAt = new Date().toISOString();

    // Update user lastVisitDate & style streak
    const userIdx = db.users.findIndex((u) => u.id === apt.userId);
    if (userIdx !== -1) {
      const user = db.users[userIdx];
      const lastVisit = user.lastVisitDate ? new Date(user.lastVisitDate) : null;
      const completedAt = new Date();
      let newStreak = (user.styleStreak || 0) + 1;

      // Streak bonus: only if revisit was within 35-42 day window
      if (lastVisit) {
        const daysSince = Math.floor((completedAt.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 42) newStreak = 1; // streak resets if too late
      }

      const service = db.services.find((s) => s.id === apt.serviceId);
      const basePoints = Math.floor((service?.price || 0) / 10);
      const streakBonus = newStreak > 1 ? 20 : 0;
      const totalPoints = basePoints + streakBonus;

      db.users[userIdx].lastVisitDate = completedAt.toISOString();
      db.users[userIdx].styleStreak = newStreak;
      db.users[userIdx].loyaltyPoints = (user.loyaltyPoints || 0) + totalPoints;

      // Log loyalty transaction
      const lt: LoyaltyTransaction = {
        id: "lt-" + Date.now(),
        userId: apt.userId,
        pointsEarned: totalPoints,
        pointsRedeemed: 0,
        reason: `${service?.name || "Service"} visit (रू ${apt.amountPaid})${streakBonus > 0 ? ` + Streak Bonus x${newStreak}` : ""}`,
        createdAt: completedAt.toISOString(),
      };
      db.loyaltyTransactions.push(lt);
    }
  }

  writeDatabase(db);

  return NextResponse.json({ success: true, appointment: db.appointments[aptIndex] });
}
