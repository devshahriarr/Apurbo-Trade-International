import Link from "next/link";

import { getCompany, getNavigation } from "@/lib/data";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    const company = getCompany();
    const navigation = getNavigation();

    return (
        <header className="sticky top-0 z-50 border-b border-ati-border bg-white/95 backdrop-blur">
            <div className="ati-container">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo / Brand */}
                    <Link
                        href="/"
                        className="ati-focus flex items-center gap-3"
                        aria-label={`${company.name} home`}
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ati-navy text-sm font-bold text-white">
                            ATI
                        </div>

                        <div className="hidden sm:block">
                            <p className="text-sm font-bold leading-tight text-ati-navy">
                                {company.name}
                            </p>

                            <p className="mt-0.5 text-xs font-medium text-ati-muted">
                                {company.tagline}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav
                        className="hidden items-center gap-1 lg:flex"
                        aria-label="Primary navigation"
                    >
                        {navigation.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="ati-focus rounded-lg px-3 py-2 text-sm font-medium text-ati-dark transition-colors hover:bg-ati-background hover:text-ati-navy"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* CTA */}
                        <Link
                            href="/contact"
                            className="ati-focus ml-3 rounded-lg bg-ati-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ati-orange-dark"
                        >
                            Request a Quote
                        </Link>
                    </nav>

                    {/* Mobile Menu */}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}