import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Declaration",
  description: "A plain-language declaration of data collected, stored, or processed by the Uptown Hair website.",
  alternates: { canonical: "/data-declaration" },
};

const rows = [
  ["Account and sign-in", "Name, phone, email, password hash, account ID, role, referral details, profile image URL; Google name, email and profile photo if Google sign-in is used.", "Create and secure accounts, identify the signed-in user, support referrals."],
  ["Bookings and salon records", "Service, stylist, appointment date and time, booking notes, status, visit and loyalty records, walk-in queue details, and salon notifications.", "Arrange visits and provide booking, queue, reminder, and loyalty features."],
  ["Style profile and feedback", "Hair texture, density, length, style preferences, maintenance preferences, optional notes, ratings and feedback.", "Save consultation preferences and tailor salon visits."],
  ["Contact requests", "Name, phone, optional email, and message text.", "Respond to the request. Sent through Resend only when email delivery is configured; not saved in the app JSON database."],
  ["Security and service operation", "Request IP and sign-in identifier are held temporarily in process memory for rate limits; session cookie values; basic server/provider operational logs.", "Prevent abuse, maintain sign-in, and operate the website."],
  ["Optional analytics and campaign tags", "If configured and you allow analytics, Google Analytics can process website usage and browser/device information. UTM campaign tags from the landing URL are kept in session storage for the current browser tab.", "Understand visits and campaign performance. Analytics is not loaded before consent or when no measurement ID is configured."],
  ["External security check", "A five-character prefix of a SHA-1 password hash is sent from the server to Have I Been Pwned’s range API during registration; neither the password nor full hash is sent.", "Reject passwords appearing in known breach data."],
];

export default function DataDeclarationPage() {
  return <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 pb-24 text-[#e0d8cd]">
    <h1 className="mb-3 font-display text-5xl text-white">Data Declaration</h1>
    <p className="mb-10 max-w-3xl text-[#a8a29e]">This declaration describes what the current Uptown Hair Unisex Salon app is designed to handle. Optional providers process data only when configured. Updated 24 October 2026.</p>
    <div className="overflow-x-auto rounded-2xl border border-[#2e2b26]">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-[#1a1816] text-[#c5a880]"><tr><th className="p-4">Data category</th><th className="p-4">What is handled</th><th className="p-4">Purpose</th></tr></thead>
        <tbody>{rows.map(([category, data, purpose]) => <tr key={category} className="border-t border-[#2e2b26] align-top"><th scope="row" className="p-4 font-semibold text-white">{category}</th><td className="p-4 text-[#a8a29e]">{data}</td><td className="p-4 text-[#a8a29e]">{purpose}</td></tr>)}</tbody>
      </table>
    </div>
    <h2 className="mb-2 mt-10 font-display text-2xl text-white">Storage and retention</h2>
    <p className="max-w-3xl text-[#a8a29e]">Account, booking, and salon records are stored in the app’s JSON data file on the server. The app currently has no automatic retention or deletion schedule. Contact requests are sent to the configured email provider and are not stored in that data file. Uploaded style-discovery photos remain in browser memory for that feature and are not uploaded.</p>
    <p className="mt-8 text-sm text-[#a8a29e]">For questions or a request about your information, call <a className="text-[#c5a880] underline" href="tel:+9779801234567">+977 980-1234567</a> or use the <Link className="text-[#c5a880] underline" href="/contact">contact page</Link>. See the full <Link className="text-[#c5a880] underline" href="/privacy">Privacy Policy</Link>.</p>
  </main>;
}
