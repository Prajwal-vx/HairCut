"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  about: "About", services: "Services", stylists: "Stylists", gallery: "Gallery", contact: "Contact",
  consultation: "Style Diagnostic", discover: "Discover Your Style", book: "Book an Appointment", privacy: "Privacy Policy",
  auth: "Sign In", dashboard: "Dashboard", passport: "Hair Passport", "style-dna": "Style DNA", "barber-brief": "Barber Brief",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0 || ["admin", "dashboard", "auth", "passport", "style-dna", "barber-brief"].includes(parts[0])) return null;
  const crumbs = [{ name: "Home", path: "/" }, ...parts.map((part, index) => ({ name: labels[part] || part, path: `/${parts.slice(0, index + 1).join("/")}` }))];
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.path })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-24 text-xs text-[#a8a29e]">
      <ol className="flex flex-wrap items-center gap-2">{crumbs.map((crumb, index) => <li key={crumb.path} className="flex items-center gap-2">
        {index > 0 && <span aria-hidden="true">/</span>}
        {index === crumbs.length - 1 ? <span aria-current="page" className="text-[#c5a880]">{crumb.name}</span> : <Link className="hover:text-[#c5a880]" href={crumb.path}>{crumb.name}</Link>}
      </li>)}</ol>
    </nav>
  </>;
}
