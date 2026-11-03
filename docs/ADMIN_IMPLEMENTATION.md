# Admin Document Management Implementation

## Repository audit

- Existing application: Next.js 16.3.8 App Router, React 19, TypeScript, Tailwind CSS 4.
- Public routes and their static JSON data layer were present; the shared public layout was in the root layout.
- No database, Prisma schema, authentication, API routes, or admin module existed before this work.
- Existing public components and global styles are retained. Public pages now live in a URL-neutral `(public)` route group so their header/footer stay independent from `/admin`.
- Database credentials, account credentials, and the ATI address are not present. The supplied specification explicitly flags ATI's scanned address for owner verification.

## Architecture decisions

- Admin UI lives under `/admin`, with a protected route-group layout and a separate `/admin/login` page. The website CMS is not implemented.
- Admin styling uses CSS Modules. Existing public styling tokens remain in `src/app/globals.css`.
- PostgreSQL/Prisma models use UUID keys, Decimal monetary fields, business membership, document snapshots, per-business sequences, templates, and audit logs.
- Auth.js Credentials uses bcrypt password hashes and JWT sessions. This avoids adding adapter tables; the user/membership models remain database-backed.
- All business-specific API operations check the authenticated user's membership server-side. Resource queries carry the selected `businessId`; related parties, projects, products, and templates are checked against that same business.
- Documents share one type/configuration-driven model. Drafts are editable through the API, duplication creates a draft, and issue/cancel are separate audited operations. Issuing allocates a continuous number per business and document type in a serializable transaction; the schema can also separate fiscal-year sequences later.
- Print output is a dedicated authenticated HTML view. Browser print can save a PDF; server-side Playwright PDF generation and Bengali font packaging remain future work.
- Original template selection has a basic legacy-style layout only. The specification PDF contains text requirements, not the referenced scanned form artwork or dimensions, so scan-accurate reproduction cannot be verified yet.

## Phase checklist

- [x] Phase 00: Inspect the existing app, routes, dependencies, assets, and document requirements.
- [x] Phase 01 foundation: Admin route namespace, independent shell, credential login, Prisma configuration, seeded business profiles, business switcher, dashboard shell.
- [x] Phase 02 initial data layer: Business profile, party, project, and product models; create/list/update endpoints and business-scoped queries.
- [x] Phase 03 core document engine: Unified draft creation, Decimal calculations, snapshot storage, draft update API, duplicate, issue/cancel, business/type/fiscal-year sequence, and audit entries.
- [x] Phase 04 initial print path: Dedicated print view, modern layout, basic original-style variant, browser print/save as PDF.
- [x] Phase 05 basic reporting: Dashboard counts, recent documents, business-scoped search, type/status/party/project/date filters, and CSV export.
- [x] Multi-row draft editor with saved product selection, draft editing, duplication, issue/cancel actions, and print preview for all eight document categories.
- [ ] Complete document workflows: Some less frequent type-specific fields, issued-document audit-history UI, report pagination, and summary charts remain.
- [ ] User and permission management: Roles and business memberships are enforced in the API; user administration screens and fine-grained settings UI remain.
- [ ] Template configuration: Original/modern, A4/A5/Letter/Custom records can be saved; logo/header/footer/watermark/columns/signature/copies settings UI remains.
- [ ] PDF/browser QA: Browser print/save is available. No sample scan or physical form dimensions were supplied; server-side PDF generation, Bengali font embedding, configurable paper orientation/copies, and scan-accurate original templates remain.
- [ ] Website CMS: Intentionally deferred.

## Local setup

1. Copy `.env.example` to `.env.local`; set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` (at least 12 characters).
2. Create an empty PostgreSQL database and run `npm run db:migrate` to apply the initial migration.
3. Run `npm run db:seed` to create ATI and ARJ Tex profiles, the owner account, and owner memberships. The seed deliberately leaves ATI's address blank pending verification.
4. Start the app with `npm run dev`, then open `/admin/login`.

`npm run db:migrate` was not run in this workspace because no PostgreSQL connection was provided. The checked-in initial migration is generated from an empty schema and contains create statements only; it was reviewed for destructive statements.

## Verification

- `npx prisma validate` — passed.
- `npm run type-check` — passed at the first integration checkpoint; rerun after further edits before release.
- `npm run lint` — passed at the first integration checkpoint; rerun after further edits before release.
- `npm run build` — passed at the first integration checkpoint; rerun after further edits before release.
- Database-backed login, APIs, transactions, migration execution, and document rendering could not be exercised without a configured PostgreSQL database and owner-provided scan assets.
