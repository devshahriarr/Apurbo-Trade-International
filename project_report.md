# Apurbo Trade International - Project Audit & Roadmap

## SECTION 1 — PROJECT AUDIT

**Findings:**
- **Current Structure:** The project is correctly structured using Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. The directory architecture (`src/app`, `src/components`, `src/lib`, `src/types`, `src/data`) is clean and logical.
- **Correctly Implemented:** The Data Access Layer pattern is strictly followed. The Tailwind v4 setup in `globals.css` properly uses the `@theme` directive for design tokens and establishes solid base layout classes (`.ati-container`, `.ati-section`, `.ati-card`). The global layout properly wraps children with the Navbar and Footer.
- **Incomplete:** The homepage (`src/app/page.tsx`) is currently just a text placeholder. The `Navbar` is using a text-based fallback for the logo rather than a real image asset. Actual page routes (About, Services, Projects, etc.) have not been created. 
- **Technically Wrong:** There are no major technical flaws in the existing codebase. The foundation is highly robust. 
- **Improvement Areas:** Icon management needs to be decided. The data JSON references icon strings (e.g., `"shield-check"`), so we will need to integrate a lightweight icon library (like `lucide-react`) to render these dynamically. 
- **Phase Completion Status:** Phases 01–06 are genuinely complete and provide a production-grade foundation.

---

## SECTION 2 — PHASE 01–06 VERIFICATION

- **Phase 01 (Project Foundation): PASS**
  *Reason:* Next.js 16 App Router, TypeScript, and Tailwind CSS v4 are correctly initialized and configured.
- **Phase 02 (Project Architecture): PASS**
  *Reason:* Clean folder structure separating UI, layout, data, types, and utilities.
- **Phase 03 (Data Architecture): PASS**
  *Reason:* `siteData.json` contains comprehensive, well-structured business data without being directly imported into components.
- **Phase 04 (TypeScript Data Model): PASS**
  *Reason:* `types/index.ts` is exhaustive and strongly typed. `lib/data.ts` correctly acts as the single source of truth for component data retrieval.
- **Phase 05 (Design System + Global Styling): PASS**
  *Reason:* Tailwind v4 variables and custom utility classes are correctly defined in `globals.css` matching the brand identity.
- **Phase 06 (Global Layout System): PASS**
  *Reason:* `layout.tsx` cleanly implements the `Navbar` and `Footer`, which successfully consume data from `lib/data.ts`.

---

## SECTION 3 — ARCHITECTURE REVIEW

- **App Router:** Fully utilized for Server Components by default. 
- **Data Layer & Types:** Exceptional. Using `getCompany()`, `getServices()`, etc., prevents prop-drilling and couples the UI to a stable API surface rather than raw JSON.
- **Styling:** The use of CSS variables in Tailwind v4 allows for easy theme swapping if needed. The `.ati-container` and `.ati-section` classes enforce consistent spacing, a hallmark of premium corporate design.
- **Scalability & Maintainability:** The architecture is highly scalable. We can add complex interactive components later using `"use client"` only where necessary while keeping the bulk of the corporate site as SEO-friendly Server Components.

---

## SECTION 4 — DATA / CONTENT REVIEW

- They are **100% consistent**. 
- The interfaces match the JSON structures perfectly. 
- The data access layer correctly exposes typed getters for all data models. There are no mismatches (e.g., the contact phone correctly splits into `cell` and `office` instead of an array).

---

## SECTION 5 — UI/UX REVIEW

- **Visual Weaknesses:** Currently lacking actual imagery and brand logo.
- **Brand Identity:** The foundation is there (Navy/Orange/Green tokens), but the typography and spacing need to be applied to actual content to achieve the "premium engineering firm" feel.
- **Footer:** Excellent structural implementation in code. Clean separation of links, services, and contact info.
- **Navigation:** The sticky navbar with backdrop blur is a nice modern touch. 

---

## SECTION 6 — ASSET REVIEW

- `public/images` contains the following subdirectories: `certificates`, `company`, `hero`, `logo`, `projects`, `proprietor`, `services`. 
- **Current Status:** We need to verify if the actual `.webp` files referenced in `siteData.json` (e.g., `/images/hero/construction-hero.webp`) actually exist in these folders, or if they need to be gathered/created. 
- **Missing:** I did not see an actual SVG or PNG logo file in the root `public/` directory or referenced in the `Navbar`. We will need the real ATI logo. I will NOT invent fake assets. If an image is missing during development, I will use a structural placeholder (e.g., a colored `div` with a label) until the real asset is provided.

---

## SECTION 7 — COMPLETE REMAINING ROADMAP

| Phase | Goal | Key Tasks & Files | Validation |
|---|---|---|---|
| **07** | **Homepage UI** | Implement Hero, Trust Points, About Preview, Business Activities, Featured Projects, Proprietor Message, Contact CTA.<br>*(Files: `src/app/page.tsx`, new components in `src/components/home/`)* | Visual check on Desktop/Mobile. Verify data loading. |
| **08** | **About Us Page** | Build `/about` route. Company introduction, Vision, Mission, Core Values, Proprietor profile.<br>*(Files: `src/app/about/page.tsx`, `src/components/ui/`)* | Check route navigation and content hierarchy. |
| **09** | **Services System** | Build `/services` listing page. Create individual `/services/[slug]` detail pages.<br>*(Files: `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`)* | Verify dynamic routing and missing slug 404 handling. |
| **10** | **Projects System** | Build `/projects` listing and `/projects/[slug]` detail pages.<br>*(Files: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`)* | Validate project card UI and conditional rendering of sensitive data. |
| **11** | **Credentials Page** | Build `/credentials`. Professional display of licenses and certificates.<br>*(Files: `src/app/credentials/page.tsx`)* | Ensure only `publicDisplay: true` credentials are shown. |
| **12** | **Why Choose Us** | Build `/why-us`. Highlight quality, safety, delivery metrics.<br>*(Files: `src/app/why-us/page.tsx`)* | Visual check. |
| **13** | **Contact & Forms** | Build `/contact`. Interactive contact form, business hours, map placeholder.<br>*(Files: `src/app/contact/page.tsx`, Client form component)* | Test form state, validation, and submission flow. |
| **14** | **SEO Implementation** | Add dynamic `metadata` exports to all pages. Generate `sitemap.ts` and `robots.txt`.<br>*(Files: all `page.tsx` files)* | Inspect HTML `<head>` for titles, descriptions, and Open Graph tags. |
| **15** | **Accessibility Audit** | Ensure ARIA labels, semantic HTML (nav, main, section, article), and keyboard focus states are correct. | Lighthouse Accessibility score > 95. |
| **16** | **Performance & Assets** | Replace `<img>` with `next/image`. Optimize LCP (Largest Contentful Paint). | Lighthouse Performance score > 90. |
| **17** | **Responsive Polish** | Final sweep across 320px to 1440px breakpoints. Fix any padding/overflow issues. | Browser dev tools responsive testing. |
| **18** | **Final QA** | Run `npm run type-check`, `npm run lint`, and `npm run build`. Fix hydration errors. | Successful production build. |
| **19** | **Deployment Prep** | Review `.env` requirements, caching strategies, and Next.js output mode. | Ready for VPS transfer. |

---

## SECTION 8 — RECOMMENDED IMPLEMENTATION ORDER

I recommend executing exactly in numerical order: **Phases 07 ➔ 19**. 
Building the Homepage (Phase 07) first will force us to create reusable UI components (Cards, Section Headings, Buttons) that will rapidly accelerate the development of all subsequent inner pages (Phases 08–13).

---

## SECTION 9 — RISKS / DECISIONS REQUIRED

1. **Icons:** The data references string names for icons (e.g., `"shield-check"`, `"construction"`). We need a lightweight icon library (like `lucide-react`) to render these.
2. **Project Contract Values:** These are sensitive. We need to decide whether to completely omit the `contractValue` field from the UI on the Projects pages, or display it selectively.
3. **Logo:** We currently have a text placeholder `ATI` in the Navbar. A real logo asset (SVG/PNG) is needed for the final presentation.
