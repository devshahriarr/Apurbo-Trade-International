import Link from "next/link";

import {
    getCompany,
    getContact,
    getFooter,
    getNavigation,
    getServices,
} from "@/lib/data";

export default function Footer() {
    const company = getCompany();
    const contact = getContact();
    const footer = getFooter();
    const navigation = getNavigation();
    const services = getServices();

    return (
        <footer className="bg-ati-navy text-white">
            <div className="ati-container py-14 lg:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* =========================================
                        COMPANY
                    ========================================== */}

                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="ati-focus inline-flex items-center gap-3 rounded-lg"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-sm font-bold text-ati-navy">
                                ATI
                            </div>

                            <div>
                                <p className="font-bold text-white">
                                    {company.name}
                                </p>

                                <p className="text-sm text-white/70">
                                    {company.tagline}
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
                            {company.positioning}
                        </p>
                    </div>

                    {/* =========================================
                        QUICK LINKS
                    ========================================== */}

                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Quick Links
                        </h2>

                        <nav
                            className="mt-4 flex flex-col gap-3"
                            aria-label="Footer navigation"
                        >
                            {navigation.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="ati-focus w-fit rounded text-sm text-white/70 transition-colors hover:text-white"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* =========================================
                        SERVICES
                    ========================================== */}

                    <div>
                        <h2 className="text-base font-semibold text-white">
                            Services
                        </h2>

                        <div className="mt-4 flex flex-col gap-3">
                            {services.slice(0, 5).map((service) => (
                                <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    className="ati-focus w-fit rounded text-sm text-white/70 transition-colors hover:text-white"
                                >
                                    {service.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* =========================================
                    CONTACT INFORMATION
                ========================================== */}

                <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-3">

                    {/* Address */}

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                            Address
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/75">
                            {contact.headOffice.fullAddress}
                        </p>
                    </div>

                    {/* Phone */}

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                            Phone
                        </p>

                        <div className="mt-2 flex flex-col gap-2">

                            <a
                                href={`tel:${contact.phone.cell.replace(/\s+/g, "")}`}
                                className="ati-focus w-fit rounded text-sm text-white/75 transition-colors hover:text-white"
                            >
                                Cell: {contact.phone.cell}
                            </a>

                            <a
                                href={`tel:${contact.phone.office.replace(/\s+/g, "")}`}
                                className="ati-focus w-fit rounded text-sm text-white/75 transition-colors hover:text-white"
                            >
                                Office: {contact.phone.office}
                            </a>

                        </div>
                    </div>

                    {/* Email */}

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                            Email
                        </p>

                        <a
                            href={`mailto:${contact.email}`}
                            className="ati-focus mt-2 inline-block rounded text-sm text-white/75 transition-colors hover:text-white"
                        >
                            {contact.email}
                        </a>
                    </div>
                </div>
            </div>

            {/* =========================================
                COPYRIGHT
            ========================================== */}

            <div className="border-t border-white/10">
                <div className="ati-container flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>{footer.copyright}</p>

                    <p>{footer.tagline}</p>
                </div>
            </div>
        </footer>
    );
}