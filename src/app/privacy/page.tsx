import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how Uptown Hair Unisex Salon uses and protects information for accounts, bookings, salon services, and inquiries.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 pb-24 text-[#e0d8cd]">
    <h1 className="mb-3 font-display text-5xl text-white">Privacy Policy</h1>
    <p className="mb-10 text-sm text-[#a8a29e]">Uptown Hair Unisex Salon · Birtamode, Nepal · Updated 24 October 2026</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Who is responsible</h2>
    <p className="text-[#a8a29e]">This website is operated for Uptown Hair Unisex Salon at Ratan Complex, Bhadrapur Bus Stand, Birtamode, Jhapa, Nepal. Contact us by phone at <a className="text-[#c5a880] underline" href="tel:+9779801234567">+977 980-1234567</a> or through the <Link className="text-[#c5a880] underline" href="/contact">contact page</Link> to ask about your information.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Information we handle</h2>
    <p className="text-[#a8a29e]">Depending on the features you use, we handle your name, phone number, email address, password hash, profile image URL, account and referral identifiers, appointment and queue details, service preferences, feedback, loyalty activity, notifications, and the hair and style preferences you choose to save. Contact messages include the name, phone, optional email, and message you submit.</p>
    <p className="mt-3 text-[#a8a29e]">The style discovery photo preview is processed in your browser and is not uploaded by that feature. A Barber Brief can save a reference image URL that you provide; the app does not upload that image itself.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Why we use it</h2>
    <p className="text-[#a8a29e]">We use account details to sign you in; contact and booking details to answer requests and arrange salon visits; saved hair preferences and feedback to support consultations; and loyalty and notification records to provide related salon features. We use security and rate-limit data to protect the service.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Cookies and service providers</h2>
    <p className="text-[#a8a29e]">Sign-in uses an HttpOnly session cookie; Google sign-in may also use NextAuth session and OAuth cookies. These cookies support authentication and are not readable by page JavaScript. If Google Analytics is enabled in the deployment, Google Analytics may receive website usage and device/browser information. Google receives account information when you choose Google sign-in. Contact messages are sent through Resend when contact delivery is configured. For the breached-password check, the server sends only a short SHA-1 hash prefix to Have I Been Pwned; it does not send the password or full hash. Some salon photos are delivered by Unsplash.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Storage and retention</h2>
    <p className="text-[#a8a29e]">App account and salon records are stored in the application’s JSON data store. The current app does not automatically expire or delete those records on a schedule. Keep this in mind when deciding what to put in free-text fields. Contact messages are sent to the salon by the configured email provider and are not added to the app’s JSON database. Website hosting and email providers may keep operational logs under their own policies.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Your requests and security</h2>
    <p className="text-[#a8a29e]">You can contact the salon to ask for access to, correction of, or deletion of account information. We will review requests and applicable record-keeping needs. Passwords are stored as hashes, not as the password text you enter. No internet-connected service can promise absolute security; please avoid putting highly sensitive information in profile notes or messages.</p>

    <p className="mt-10 text-sm text-[#a8a29e]">See also our <Link className="text-[#c5a880] underline" href="/data-declaration">Data Declaration</Link> and <Link className="text-[#c5a880] underline" href="/terms">Terms of Use</Link>.</p>
  </main>;
}
