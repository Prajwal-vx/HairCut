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
    clients: db.users.filter((u) => u.role === "CLIENT").map((u) => ({
      id: u.id,
      fullName: u.fullName,
      phone: u.phone,
      email: u.email,
      loyaltyPoints: u.loyaltyPoints,
      styleStreak: u.styleStreak,
      lastVisitDate: u.lastVisitDate,
      visitCount: userVisitCounts[u.id] || 0,
    })),
  });
}
