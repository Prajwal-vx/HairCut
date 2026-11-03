import { NextResponse } from "next/server";
import { readDatabase } from "@/lib/db";
import { canManageSalon, getRequestIdentity } from "@/lib/request-auth";

export async function GET(req: Request) {
  const identity = await getRequestIdentity(req);
  const db = readDatabase();
  if (!canManageSalon(identity)) {
    return NextResponse.json({ error: "Staff or Owner access required." }, { status: 403 });
  }

  const completed = db.appointments.filter((a) => a.status === "completed");
  const upcoming = db.appointments.filter((a) => a.status === "upcoming");
  const pending = db.appointments.filter((a) => a.status === "pending");
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
  const repeatClients = Object.values(userVisitCounts).filter((c) => c > 1).length;
  const totalClients = db.users.filter((u) => u.role === "CLIENT").length;
  const repeatRate = totalClients > 0 ? Math.round((repeatClients / totalClients) * 100) : 0;

  // Users due for 35-40 day reminder
  const now = Date.now();
  const usersNeedingReminder = db.users.filter((u) => {
    if (!u.lastVisitDate) return false;
    const days = Math.floor((now - new Date(u.lastVisitDate).getTime()) / 86400000);
    return days >= 35 && days <= 40;
  });

  return NextResponse.json({
    totalClients,
    totalAppointments: db.appointments.length,
    upcomingCount: upcoming.length,
    pendingCount: pending.length,
    completedCount: completed.length,
    totalRevenue,
    repeatRate,
    topService: topService?.name || "N/A",
    galleryCount: db.galleryPhotos.length,
    usersNeedingReminderCount: usersNeedingReminder.length,
    usersNeedingReminder: usersNeedingReminder.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      phone: u.phone,
      email: u.email,
      lastVisitDate: u.lastVisitDate,
      daysSince: Math.floor((now - new Date(u.lastVisitDate!).getTime()) / 86400000),
      styleStreak: u.styleStreak,
      preferredChannel: u.preferredChannel,
    })),
    clients: db.users.filter((u) => u.role === "CLIENT").map((u) => {
      const appointmentActivity = db.appointments
        .filter((appointment) => appointment.userId === u.id)
        .flatMap((appointment) => {
          const service = db.services.find((item) => item.id === appointment.serviceId);
          const stylist = db.stylists.find((item) => item.id === appointment.stylistId);
          const events = appointment.statusHistory?.length
            ? appointment.statusHistory
            : [{ status: appointment.status, changedAt: appointment.completedAt || appointment.createdAt, changedBy: "system" as const }];
          return events.map((event, index) => ({
            id: `${appointment.id}-${index}`,
            type: "appointment",
            title: event.status === "pending" ? "Appointment requested"
              : event.status === "upcoming" ? "Appointment confirmed"
                : event.status === "declined" ? "Appointment declined"
                  : event.status === "cancelled" ? "Appointment cancelled"
                    : event.status === "completed" ? "Appointment completed" : "Appointment marked no-show",
            details: `${service?.name || "Salon service"} · ${appointment.visitDate} at ${appointment.timeSlot}${stylist ? ` · ${stylist.name}` : ""}`,
            occurredAt: event.changedAt,
          }));
        });
      const loyaltyActivity = db.loyaltyTransactions
        .filter((transaction) => transaction.userId === u.id)
        .map((transaction) => ({
          id: transaction.id,
          type: "loyalty",
          title: transaction.pointsRedeemed > 0 ? "Loyalty points used" : "Loyalty points earned",
          details: `${transaction.pointsEarned || transaction.pointsRedeemed} points · ${transaction.reason}`,
          occurredAt: transaction.createdAt,
        }));
      const profileActivity = [
        ...(db.hairPassports || []).filter((record) => record.userId === u.id).map((record) => ({ id: record.id, type: "profile", title: "Hair Passport updated", details: "Saved haircut and styling preferences", occurredAt: record.updatedAt || record.createdAt })),
        ...(db.styleDNA || []).filter((record) => record.userId === u.id).map((record) => ({ id: record.id, type: "profile", title: "Style profile completed", details: "Style preferences were refreshed", occurredAt: record.updatedAt || record.computedAt })),
        ...(db.barberBriefs || []).filter((record) => record.userId === u.id).map((record) => ({ id: record.id, type: "profile", title: "Barber Brief created", details: `Prepared a stylist brief${record.appointmentId ? " for an appointment" : ""}`, occurredAt: record.createdAt })),
        ...(db.haircutFeedback || []).filter((record) => record.userId === u.id).map((record) => ({ id: record.id, type: "profile", title: "Visit feedback submitted", details: `Rated the visit ${record.overallRating} out of 5`, occurredAt: record.createdAt })),
        ...(db.haircutPhotos || []).filter((record) => record.userId === u.id).map((record) => ({ id: record.id, type: "profile", title: "Style journal updated", details: record.isPrivate ? "Added a private photo journal entry" : "Added a photo journal entry", occurredAt: record.createdAt })),
      ];
      const activity = [
        { id: `${u.id}-joined`, type: "account", title: "Account created", details: "Client account registered", occurredAt: u.createdAt },
        ...appointmentActivity,
        ...loyaltyActivity,
        ...profileActivity,
      ].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

      return {
        id: u.id,
        fullName: u.fullName,
        phone: u.phone,
        email: u.email,
        loyaltyPoints: u.loyaltyPoints,
        styleStreak: u.styleStreak,
        lastVisitDate: u.lastVisitDate,
        visitCount: userVisitCounts[u.id] || 0,
        createdAt: u.createdAt,
        activity,
      };
    }),
  });
}
