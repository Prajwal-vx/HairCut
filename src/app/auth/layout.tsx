import { pageMetadata } from "@/lib/metadata";
export const metadata = { ...pageMetadata("Sign In or Register", "Sign in or create an Uptown Hair client account to manage your appointments.", "/auth"), robots: { index: false, follow: false } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
