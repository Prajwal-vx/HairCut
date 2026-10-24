import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Uptown Hair Unisex Salon website, client account, and appointment features.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 pb-24 text-[#e0d8cd]">
    <h1 className="mb-3 font-display text-5xl text-white">Terms of Use</h1>
    <p className="mb-10 text-sm text-[#a8a29e]">Uptown Hair Unisex Salon · Birtamode, Nepal · Updated 24 October 2026</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Using this website</h2>
    <p className="text-[#a8a29e]">These terms apply when you use this website, create a client account, request an appointment, or use its salon features. By using the site, you agree to use it lawfully and provide information that is accurate to the best of your knowledge. If you do not agree, do not use the account or booking features.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Accounts</h2>
    <p className="text-[#a8a29e]">Keep your sign-in details private and tell the salon if you believe someone has accessed your account. You are responsible for activity through your signed-in account, subject to applicable law. We may restrict or suspend access when needed to protect users, the salon, or the service.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Appointments and prices</h2>
    <p className="text-[#a8a29e]">Appointment requests depend on service, stylist, date, and time availability. A booking is confirmed only when the website shows a successful confirmation or the salon confirms it directly. Prices and service details are displayed for planning and may be clarified by the salon before service. This website does not process online payments; payment arrangements are made with the salon. Contact the salon promptly if you need to change or cancel an appointment.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Your submissions</h2>
    <p className="text-[#a8a29e]">You keep responsibility for the text, preferences, feedback, and reference links you submit. Do not submit unlawful, abusive, misleading, or someone else’s private information without permission. You allow the salon to use those submissions to provide the requested consultation, booking, or salon service. Do not upload or link content that infringes another person’s rights.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Site content and availability</h2>
    <p className="text-[#a8a29e]">Salon names, descriptions, photographs, and other site content may be protected by intellectual-property rights. You may use the site for personal appointment and salon-service purposes, but may not copy or exploit its content commercially without permission. We may update, suspend, or discontinue a feature, and we cannot guarantee uninterrupted availability.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Limitation and applicable rules</h2>
    <p className="text-[#a8a29e]">The website provides booking and style-planning tools; online recommendations are not a guarantee of a particular result. Any limitation in these terms applies only to the extent permitted by applicable law and does not remove consumer rights that cannot legally be excluded. These terms are subject to applicable laws of Nepal.</p>

    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Questions or updates</h2>
    <p className="text-[#a8a29e]">For help with an account, booking, or these terms, call <a className="text-[#c5a880] underline" href="tel:+9779801234567">+977 980-1234567</a> or use our <Link className="text-[#c5a880] underline" href="/contact">contact page</Link>. We may revise these terms as the service changes; the date above identifies the latest posted version.</p>
    <p className="mt-10 text-sm text-[#a8a29e]">Read our <Link className="text-[#c5a880] underline" href="/privacy">Privacy Policy</Link> and <Link className="text-[#c5a880] underline" href="/data-declaration">Data Declaration</Link>.</p>
  </main>;
}
