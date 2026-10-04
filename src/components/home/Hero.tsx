import Link from "next/link";
import Image from "next/image";
import { getHero } from "@/lib/data";

export default function Hero() {
  const hero = getHero();

  return (
    <section className="relative overflow-hidden bg-ati-navy pt-24 pb-32 lg:pt-36 lg:pb-40">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero.image}
          alt="Construction background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ati-navy/90 to-ati-navy/60" />
      </div>

      <div className="ati-container relative z-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold tracking-widest text-ati-orange uppercase">
            {hero.eyebrow}
          </p>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-white/80 md:text-xl">
            {hero.subtitle}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={hero.primaryCta.href}
              className="ati-focus inline-flex items-center justify-center rounded-lg bg-ati-orange px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-ati-orange-dark"
            >
              {hero.primaryCta.label}
            </Link>

            <Link
              href={hero.secondaryCta.href}
              className="ati-focus inline-flex items-center justify-center rounded-lg bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
