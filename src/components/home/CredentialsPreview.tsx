import { getCredentials } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, FileCheck } from "lucide-react";

export default function CredentialsPreview() {
  const credentials = getCredentials().filter((c) => c.publicDisplay);

  return (
    <section className="ati-section bg-white border-t border-ati-border">
      <div className="ati-container">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          
          <div className="flex flex-col lg:col-span-1">
            <p className="mb-2 text-sm font-bold tracking-wider text-ati-orange uppercase">
              Proven Trust
            </p>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-ati-navy md:text-4xl">
              Verified Credentials
            </h2>
            <p className="mb-8 text-ati-muted">
              We operate with full transparency. Our business registrations and work 
              completion certificates validate our capacity and legal compliance.
            </p>
            <Link
              href="/credentials"
              className="ati-focus inline-flex w-fit items-center gap-2 rounded-lg border border-ati-border bg-white px-6 py-3 font-semibold text-ati-navy transition-colors hover:bg-ati-background"
            >
              View All Credentials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {credentials.map((cred) => (
                <div 
                  key={cred.id} 
                  className="flex items-start gap-4 rounded-xl border border-ati-border p-5 transition-colors hover:border-ati-navy"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ati-background text-ati-navy">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ati-navy">{cred.title}</h3>
                    <p className="text-sm font-medium text-ati-orange">
                      {cred.type}
                    </p>
                    <p className="mt-2 text-sm text-ati-muted line-clamp-2">
                      {cred.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
