import { pageMetadata } from "@/lib/metadata";
export const metadata = { ...pageMetadata("Barber Brief", "Save and share the haircut details and preferences you want your stylist to know.", "/barber-brief"), robots: { index: false, follow: false } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
