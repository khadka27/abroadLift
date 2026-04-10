import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from "lucide-react";

const FOOTER_LINKS = {
  Destinations: [
    { href: "/matches?country=AU", label: "Australia" },
    { href: "/matches?country=CA", label: "Canada" },
    { href: "/matches?country=DE", label: "Germany" },
    { href: "/matches?country=IE", label: "Ireland" },
    { href: "/matches?country=UK", label: "United Kingdom" },
  ],
  About: [
    { href: "/about", label: "Our Story" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press and Media" },
    { href: "/contact", label: "Contact" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/webinar", label: "Webinar" },
    { href: "/insights", label: "AbroadLift Insights" },
  ],
  Legal: [
    { href: "/legal", label: "Legal Center" },
    { href: "/terms", label: "Terms and Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F4F7FF] pt-24 pb-12 overflow-hidden border-t border-gray-100">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-8">
              <div className="relative w-[180px] h-[45px]">
                <Image
                  src="/logo.png"
                  alt="AbroadLift Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            
            <address className="not-italic text-[#64748B] text-[15px] leading-[1.8] mb-8 font-medium">
              101 Frederick St,<br />
              Kitchener, ON<br />
              N2H 6R2
            </address>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="text-[#3686FF] hover:text-[#2563eb] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5 fill-current" strokeWidth={0} />
              </a>
              <a href="#" className="text-[#3686FF] hover:text-[#2563eb] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5 fill-current" strokeWidth={0} />
              </a>
              <a href="#" className="text-[#3686FF] hover:text-[#2563eb] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" strokeWidth={2.5} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[17px] font-bold text-[#0B1A30] mb-8 tracking-tight">
                {title}
              </h4>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#64748B] text-[15px] font-medium hover:text-[#3686FF] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E2E8F0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[14px]">
          <p className="text-[#64748B] font-medium">
            Copyright © {year} AbroadLift Inc
          </p>
          <div className="text-[#64748B] font-medium flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
            <span>All Rights Reserved |</span>
            <Link href="/terms" className="text-[#3686FF] hover:underline">
              Terms and Conditions
            </Link>
            <span>|</span>
            <Link href="/privacy" className="text-[#3686FF] hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
