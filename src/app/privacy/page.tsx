import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Uptown Hair",
  description: "How Uptown Hair Unisex Salon handles personal information for appointments and salon services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <main className="mx-auto min-h-screen max-w-3xl px-4 py-28 text-[#e0d8cd]">
    <h1 className="mb-6 font-display text-5xl text-white">Privacy Policy</h1>
    <p className="mb-6 text-[#a8a29e]">We collect the details you provide when you create an account, book an appointment, or contact the salon. This can include your name, phone number, email address, appointment preferences, and messages.</p>
    <h2 className="mb-2 mt-8 font-display text-2xl text-white">How we use your information</h2>
    <p className="text-[#a8a29e]">We use it to manage bookings, provide salon services, respond to inquiries, and maintain your salon profile. We do not sell personal information. Access is limited to people who need it to operate the salon.</p>
    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Your choices</h2>
    <p className="text-[#a8a29e]">To request access, correction, or deletion of your information, contact us at <a className="text-[#c5a880] underline" href="tel:+9779801234567">+977 980-1234567</a> or use our <Link className="text-[#c5a880] underline" href="/contact">contact page</Link>.</p>
    <h2 className="mb-2 mt-8 font-display text-2xl text-white">Updates</h2>
    <p className="text-[#a8a29e]">We may update this policy when our practices change. This page will show the current version.</p>
  </main>;
}
