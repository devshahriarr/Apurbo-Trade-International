"use client";

import Link from "next/link";
import { useState } from "react";

import { getNavigation } from "@/lib/data";

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const navigation = getNavigation();

    return (
        <div className="lg:hidden">
            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="ati-focus flex h-10 w-10 items-center justify-center rounded-lg border border-ati-border text-ati-navy"
                aria-label={
                    isOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                }
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
            >
                <span className="text-xl leading-none">
                    {isOpen ? "×" : "☰"}
                </span>
            </button>

            {/* Mobile Navigation */}
            {isOpen && (
                <nav
                    id="mobile-navigation"
                    className="absolute left-0 right-0 top-full border-b border-ati-border bg-white shadow-md"
                    aria-label="Mobile navigation"
                >
                    <div className="ati-container py-4">
                        <div className="flex flex-col gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="ati-focus rounded-lg px-3 py-3 text-sm font-medium text-ati-dark transition-colors hover:bg-ati-background hover:text-ati-navy"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            {/* CTA */}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="ati-focus mt-2 rounded-lg bg-ati-orange px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-ati-orange-dark"
                            >
                                Request a Quote
                            </Link>
                        </div>
                    </div>
                </nav>
            )}
        </div>
    );
}