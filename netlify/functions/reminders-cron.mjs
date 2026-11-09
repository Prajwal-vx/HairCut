export const config = { schedule: "0 9 * * *" };

export default async function remindersCron() {
  const siteUrl = process.env.SITE_URL;
  const cronSecret = process.env.CRON_SECRET;
  if (!siteUrl || !cronSecret) throw new Error("SITE_URL and CRON_SECRET must be configured.");

  const response = await fetch(new URL("/api/cron/reminders", siteUrl), {
    method: "POST",
    headers: { "x-cron-secret": cronSecret },
  });
  if (!response.ok) throw new Error(`Reminder request failed with ${response.status}.`);
}
