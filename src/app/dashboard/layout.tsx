import { pageMetadata } from "@/lib/metadata";
export const metadata = { ...pageMetadata("Client Dashboard", "View upcoming appointments, your Style Streak, and salon updates.", "/dashboard"), robots: { index: false, follow: false } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
