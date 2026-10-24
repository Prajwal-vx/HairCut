import { pageMetadata } from "@/lib/metadata";
export const metadata = { ...pageMetadata("Salon Admin", "Salon management dashboard for authorized Uptown Hair staff.", "/admin"), robots: { index: false, follow: false } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
