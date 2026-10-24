import { pageMetadata } from "@/lib/metadata";
export const metadata = { ...pageMetadata("Book an Appointment", "Choose a service, stylist, and time for your visit to Uptown Hair in Birtamode.", "/book"), robots: { index: false, follow: true } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
