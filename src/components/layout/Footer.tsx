import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { salonBrand } from "@/lib/branding";

export default function Footer() {
  return (
    <footer className="bg-[#0a0908] border-t border-[#2e2b26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#c5a880]/60 bg-[#c5a880]">
                <img src={salonBrand.logoSrc} alt={`${salonBrand.name} logo`} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">
                  {salonBrand.name}
                </p>
                <p className="text-[#c5a880] text-xs tracking-widest uppercase">{salonBrand.location}</p>
              </div>
            </div>
            <p className="text-[#78716c] text-sm leading-relaxed">
              Boutique barbershop meets modern salon. Crafting confidence, one cut at a time — for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Explore</h2>
            <ul className="space-y-3">
              {[
                ["Services & Pricing", "/services"],
                ["Our Stylists", "/stylists"],
                ["Lookbook Gallery", "/gallery"],
                ["About Us", "/about"],
                ["Book Appointment", "/book"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-[#78716c] hover:text-[#c5a880] text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Hours</h2>
            <div className="space-y-2 text-sm text-[#78716c]">
              <div className="flex gap-2">
                <Clock className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                <div>
                  <p>Daily: 9 AM – 8 PM</p>
                  <p className="text-[#c86d51] text-xs mt-1">Hours may vary on special occasions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Find Us</h2>
            <div className="space-y-3 text-sm text-[#78716c]">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                <p>
                  Ratan Complex, Bhadrapur Bus Stand,<br />
                  Birtamode, Jhapa, Nepal
                </p>
              </div>
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-[#c5a880] flex-shrink-0 mt-0.5" />
                <a href="tel:+9779808087574" className="hover:text-[#c5a880] transition-colors">
                  +977 980-8087574
                </a>
              </div>
            </div>
            <div className="mt-4">
              <a
                href={salonBrand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${salonBrand.instagramHandle} on Instagram`}
                className="inline-flex items-center gap-2 text-[#78716c] hover:text-[#c5a880] text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {salonBrand.instagramHandle}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2e2b26] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#4a4540] text-xs">
            © 2026 Uptown Hair Unisex Salon, Birtamode. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-[#4a4540] hover:text-[#c5a880] text-xs transition-colors">
              Client Login
            </Link>
            <Link href="/admin" className="text-[#4a4540] hover:text-[#c5a880] text-xs transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
