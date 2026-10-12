import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import { PageProgressBar } from "@/components/ui/ProgressBar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Uptown Hair Unisex Salon — Birtamode, Nepal", template: "%s | Uptown Hair" },
  description:
    "Premium unisex salon at Ratan Complex, Bhadrapur Bus Stand, Birtamode, Nepal. Book appointments, explore our services, and enjoy the Style Streak loyalty program.",
  keywords: ["hair salon", "barber", "Birtamode", "Nepal", "unisex haircut", "Bhadrapur"],
  openGraph: {
    title: "Uptown Hair Unisex Salon — Birtamode, Nepal",
    description: "Boutique barbershop meets modern salon — where every cut tells a story.",
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="antialiased font-body">
        <PageProgressBar />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
