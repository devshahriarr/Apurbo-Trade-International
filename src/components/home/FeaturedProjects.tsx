import { getProjects } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function FeaturedProjects() {
  const projects = getProjects();
  // Limit to 3 projects for the preview
  const featured = projects.slice(0, 3);

  return (
    <section className="ati-section bg-white">
      <div className="ati-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
              Track Record
            </p>
            <h2 className="text-3xl font-bold text-ati-navy md:text-4xl">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="ati-focus inline-flex w-fit items-center gap-2 font-semibold text-ati-navy hover:text-ati-navy-light"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {featured.map((project) => (
            <div
              key={project.id}
              className="ati-card group flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-grow flex-col p-6 lg:p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="inline-block rounded bg-ati-background px-3 py-1 text-xs font-semibold text-ati-navy">
                    {project.category}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight text-ati-navy">
                  {project.title}
                </h3>
                
                <div className="mb-6 flex items-center gap-2 text-sm text-ati-muted">
                  <MapPin className="h-4 w-4 text-ati-orange" />
                  <span>{project.location}</span>
                </div>

                <p className="mb-6 flex-grow text-sm leading-relaxed text-ati-muted">
                  {project.description}
                </p>

                <div className="mt-auto border-t border-ati-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ati-muted">
                    Client
                  </p>
                  <p className="text-sm font-medium text-ati-navy">
                    {project.client}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
