"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";


const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#about-us", label: "About Us" },
  { href: "/#features", label: "Features" },
  { href: "/blogs", label: "Blog" },
];

const contactLinks = [
  {
    href: "mailto:aryan@vanii.ai",
    label: "Email",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    href: "https://www.linkedin.com/company/vanii-ai",
    label: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-50 w-full">
      <div className="max-w-6xl mx-auto py-16 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-6">
          <div className="w-20 aspect-square relative flex-shrink-0">
            <Image
              src="/images/icons/logo.png"
              alt="Vanii Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="whitespace-nowrap font-medium">
            Achieve Fluency
            <br /> with Vanii Today!
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-6">
          <h3 className="text-lg md:text-xl font-medium text-primary-700">
            We&apos;d Like &<br className="hidden md:inline" /> Love to Help
          </h3>
          <div className="flex flex-wrap gap-4">
            {contactLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-primary-700"
                asChild
              >
                <Link href={link.href}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:block">
          <ul className="space-y-4">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:text-primary-700 transition-colors"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
