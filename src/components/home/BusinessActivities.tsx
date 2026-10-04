import { getBusinessActivities } from "@/lib/data";
import { ArrowRight, Hammer, Package, Settings, Snowflake, Flame, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
  construction: Hammer,
  package: Package,
  settings: Settings,
  snowflake: Snowflake,
  flame: Flame,
  zap: Zap,
};

export default function BusinessActivities() {
  const activities = getBusinessActivities();

  return (
    <section className="ati-section bg-white">
      <div className="ati-container">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
            What We Do
          </p>
          <h2 className="text-3xl font-bold text-ati-navy md:text-4xl">
            Core Business Activities
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const Icon = iconMap[activity.icon] || Package;

            return (
              <div
                key={activity.id}
                className="ati-card group flex flex-col p-8 transition-colors hover:border-ati-navy"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-ati-background text-ati-navy transition-colors group-hover:bg-ati-navy group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-ati-navy">
                  {activity.title}
                </h3>
                
                <p className="mb-6 flex-grow text-sm leading-relaxed text-ati-muted">
                  {activity.shortDescription}
                </p>

                <Link
                  href={`/services#${activity.slug}`}
                  className="ati-focus mt-auto inline-flex items-center gap-2 text-sm font-semibold text-ati-orange transition-colors hover:text-ati-orange-dark"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
