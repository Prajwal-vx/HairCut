import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import { PageProgressBar } from "@/components/ui/ProgressBar";
import Script from "next/script";
import { env } from "@/config/env";

export const metadata: Metadata = {
  applicationName: "Uptown Hair Unisex Salon",
  metadataBase: new URL(env.siteUrl),
  title: { default: "Uptown Hair Unisex Salon — Birtamode, Nepal", template: "%s | Uptown Hair" },
  description:
    "Premium unisex salon at Ratan Complex, Bhadrapur Bus Stand, Birtamode, Nepal. Book appointments, explore our services, and enjoy the Style Streak loyalty program.",
  keywords: ["hair salon", "barber", "Birtamode", "Nepal", "unisex haircut", "Bhadrapur"],
  openGraph: {
    siteName: "Uptown Hair Unisex Salon",
    title: "Uptown Hair Unisex Salon — Birtamode, Nepal",
    description: "Boutique barbershop meets modern salon — where every cut tells a story.",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Uptown Hair Unisex Salon in Birtamode, Nepal" }],
  },
  alternates: { canonical: "/" },
  ...(env.googleSearchConsoleVerification ? { verification: { google: env.googleSearchConsoleVerification } } : {}),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "HairSalon", name: "Uptown Hair Unisex Salon",
          url: env.siteUrl, image: new URL("/salon-logo.jpg", env.siteUrl).toString(), telephone: "+9779801234567",
          address: { "@type": "PostalAddress", streetAddress: "Ratan Complex, Bhadrapur Bus Stand", addressLocality: "Birtamode", addressRegion: "Koshi Province", addressCountry: "NP" },
        }) }} />
        {analyticsId && <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${analyticsId}');`}</Script>
        </>}
        <PageProgressBar />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
