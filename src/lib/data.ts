import rawSiteData from "@/data/siteData.json";

import type {
  About,
  BusinessActivity,
  Company,
  Contact,
  ContactCTA,
  CoreValue,
  Credential,
  Hero,
  NavigationItem,
  Project,
  ProprietorMessage,
  Service,
  SiteData,
  SocialLinks,
  TrustPoint,
  VisionMission,
  WhyChooseUsItem,
  Footer,
  SEO,
  Brand,
} from "@/types";

/**
 * ------------------------------------------------------------
 * SITE DATA
 * ------------------------------------------------------------
 *
 * This is the single data source for the current static version
 * of the website.
 *
 * In the future, this layer can be replaced with API/database
 * queries without changing the UI components.
 */

const siteData = rawSiteData satisfies SiteData;

/**
 * ------------------------------------------------------------
 * COMPLETE SITE DATA
 * ------------------------------------------------------------
 */

export function getSiteData(): SiteData {
  return siteData;
}

/**
 * ------------------------------------------------------------
 * COMPANY
 * ------------------------------------------------------------
 */

export function getCompany(): Company {
  return siteData.company;
}

/**
 * ------------------------------------------------------------
 * CONTACT
 * ------------------------------------------------------------
 */

export function getContact(): Contact {
  return siteData.contact;
}

/**
 * ------------------------------------------------------------
 * BRAND
 * ------------------------------------------------------------
 */

export function getBrand(): Brand {
  return siteData.brand;
}

/**
 * ------------------------------------------------------------
 * NAVIGATION
 * ------------------------------------------------------------
 */

export function getNavigation(): NavigationItem[] {
  return siteData.navigation;
}

/**
 * ------------------------------------------------------------
 * HERO
 * ------------------------------------------------------------
 */

export function getHero(): Hero {
  return siteData.hero;
}

/**
 * ------------------------------------------------------------
 * TRUST POINTS
 * ------------------------------------------------------------
 */

export function getTrustPoints(): TrustPoint[] {
  return siteData.trustPoints;
}

/**
 * ------------------------------------------------------------
 * ABOUT
 * ------------------------------------------------------------
 */

export function getAbout(): About {
  return siteData.about;
}

/**
 * ------------------------------------------------------------
 * BUSINESS ACTIVITIES
 * ------------------------------------------------------------
 */

export function getBusinessActivities(): BusinessActivity[] {
  return siteData.businessActivities;
}

/**
 * ------------------------------------------------------------
 * SERVICES
 * ------------------------------------------------------------
 */

export function getServices(): Service[] {
  return siteData.services;
}

export function getServiceBySlug(
  slug: string
): Service | undefined {
  return siteData.services.find(
    (service) => service.slug === slug
  );
}

/**
 * ------------------------------------------------------------
 * VISION & MISSION
 * ------------------------------------------------------------
 */

export function getVisionMission(): VisionMission {
  return siteData.visionMission;
}

/**
 * ------------------------------------------------------------
 * CORE VALUES
 * ------------------------------------------------------------
 */

export function getCoreValues(): CoreValue[] {
  return siteData.coreValues;
}

/**
 * ------------------------------------------------------------
 * WHY CHOOSE US
 * ------------------------------------------------------------
 */

export function getWhyChooseUs(): WhyChooseUsItem[] {
  return siteData.whyChooseUs;
}

/**
 * ------------------------------------------------------------
 * PROPRIETOR MESSAGE
 * ------------------------------------------------------------
 */

export function getProprietorMessage(): ProprietorMessage {
  return siteData.proprietorMessage;
}

/**
 * ------------------------------------------------------------
 * PROJECTS
 * ------------------------------------------------------------
 */

export function getProjects(): Project[] {
  return siteData.projects;
}

export function getProjectBySlug(
  slug: string
): Project | undefined {
  return siteData.projects.find(
    (project) => project.slug === slug
  );
}

/**
 * ------------------------------------------------------------
 * CREDENTIALS
 * ------------------------------------------------------------
 */

export function getCredentials(): Credential[] {
  return siteData.credentials;
}

/**
 * ------------------------------------------------------------
 * SOCIAL LINKS
 * ------------------------------------------------------------
 */

export function getSocialLinks(): SocialLinks {
  return siteData.socialLinks;
}

/**
 * ------------------------------------------------------------
 * CONTACT CTA
 * ------------------------------------------------------------
 */

export function getContactCTA(): ContactCTA {
  return siteData.contactCta;
}

/**
 * ------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------
 */

export function getFooter(): Footer {
  return siteData.footer;
}

/**
 * ------------------------------------------------------------
 * SEO
 * ------------------------------------------------------------
 */

export function getSEO(): SEO {
  return siteData.seo;
}