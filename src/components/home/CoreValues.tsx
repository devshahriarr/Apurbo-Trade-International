import { getCoreValues } from "@/lib/data";
import { ShieldCheck, BadgeCheck, Lightbulb, HardHat, Users, Trophy } from "lucide-react";
import React from "react";

const iconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  "badge-check": BadgeCheck,
  "lightbulb": Lightbulb,
  "hard-hat": HardHat,
  "users": Users,
  "trophy": Trophy,
};

export default function CoreValues() {
  const values = getCoreValues();

  return (
    <section className="ati-section bg-ati-background">
      <div className="ati-container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
            Principles We Stand By
          </p>
          <h2 className="text-3xl font-bold text-ati-navy md:text-4xl">
            Our Core Values
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = iconMap[value.icon] || BadgeCheck;

            return (
              <div
                key={value.id}
                className="ati-card flex flex-col items-center p-8 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ati-navy text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-ati-navy">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-ati-muted">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
