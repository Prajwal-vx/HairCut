import { readDatabase, writeDatabase } from "./db";
import { NotificationLog } from "./types";

export interface ReminderCheckResult {
  totalUsersChecked: number;
  remindersSent: number;
  remindersSkippedAlreadyBooked: number;
  remindersSkippedAlreadySent: number;
  details: Array<{
    userId: string;
    userName: string;
    daysSinceLastVisit: number;
    action: "sent" | "skipped_already_booked" | "skipped_already_sent" | "not_due";
    reason?: string;
  }>;
}

export function runAutomaticRemindersJob(): ReminderCheckResult {
  const db = readDatabase();
  const now = new Date();

  let remindersSent = 0;
  let remindersSkippedAlreadyBooked = 0;
  let remindersSkippedAlreadySent = 0;
  const details: ReminderCheckResult["details"] = [];

  for (const user of db.users) {
    if (!user.lastVisitDate) {
      continue;
    }

    const lastVisit = new Date(user.lastVisitDate);
    const diffMs = now.getTime() - lastVisit.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Check if within 35-40 days window
    if (diffDays >= 35 && diffDays <= 40) {
      // 1. Check if client has already booked an upcoming appointment (Rule 6: cancel/skip reminder)
      const hasUpcomingBooking = db.appointments.some(
        (apt) => apt.userId === user.id && apt.status === "upcoming"
      );

      if (hasUpcomingBooking) {
        remindersSkippedAlreadyBooked++;
        details.push({
          userId: user.id,
          userName: user.fullName,
          daysSinceLastVisit: diffDays,
          action: "skipped_already_booked",
          reason: "User already scheduled an upcoming appointment before day 40.",
        });
        continue;
      }

      // 2. Check if a reminder has already been sent for this cycle (Rule 5: don't spam)
      const alreadySent = db.notifications.some((notif) => {
        if (notif.userId !== user.id || notif.type !== "35_day_reminder") return false;
        const sentDate = new Date(notif.sentAt);
        // If sent after this last visit date, it was already handled for this cycle
        return sentDate >= lastVisit;
      });

      if (alreadySent) {
        remindersSkippedAlreadySent++;
        details.push({
          userId: user.id,
          userName: user.fullName,
          daysSinceLastVisit: diffDays,
          action: "skipped_already_sent",
          reason: "Reminder was already sent for this 35-40 day grooming cycle.",
        });
        continue;
      }

      // 3. Send reminder! (In-app notification + SMS/WhatsApp/Email delivery log)
      const channel = user.preferredChannel || "whatsapp";
      const message = `Hey ${user.fullName.split(" ")[0]}, it's been ${diffDays} days (approx. 5 weeks) since your last cut at Uptown Hair Unisex Salon — time for a fresh look? Maintain your Style Streak (${user.styleStreak || 1} 🔥) and book your slot in 2 taps 💈`;

      const newNotif: NotificationLog = {
        id: "notif-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        userId: user.id,
        type: "35_day_reminder",
        channel,
        status: "delivered",
        message,
        sentAt: new Date().toISOString(),
      };

      db.notifications.unshift(newNotif);
      remindersSent++;

      details.push({
        userId: user.id,
        userName: user.fullName,
        daysSinceLastVisit: diffDays,
        action: "sent",
        reason: `Dispatched via ${channel.toUpperCase()} (in-app bell updated).`,
      });
    } else {
      details.push({
        userId: user.id,
        userName: user.fullName,
        daysSinceLastVisit: diffDays,
        action: "not_due",
        reason: diffDays < 35 ? `Recent visit (${diffDays}d ago, due in ${35 - diffDays}d)` : `Past window (${diffDays}d ago)`,
      });
    }
  }

  if (remindersSent > 0) {
    writeDatabase(db);
  }

  return {
    totalUsersChecked: db.users.length,
    remindersSent,
    remindersSkippedAlreadyBooked,
    remindersSkippedAlreadySent,
    details,
  };
}