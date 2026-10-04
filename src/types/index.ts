// ============================================================
// APURBO TRADE INTERNATIONAL
// Global TypeScript Data Models
// ============================================================

/**
 * ------------------------------------------------------------
 * COMPANY
 * ------------------------------------------------------------
 */

export interface Proprietor {
  name: string;
  designation: string;
}

export interface Company {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  businessType: string;
  natureOfBusiness: string[];
  proprietor: Proprietor;
  foundedDescription: string;
  positioning: string;
}

/**
 * ------------------------------------------------------------
 * CONTACT
 * ------------------------------------------------------------
 */

export interface HeadOffice {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  fullAddress: string;
}

export interface Phone {
  cell: string;
  office: string;
}

export interface BusinessHours {
  days: string;
  time: string;
}

export interface Contact {
  headOffice: HeadOffice;
  phone: Phone;
  email: string;
  website: string;
  businessHours: BusinessHours;
}

/**
 * ------------------------------------------------------------
 * BRAND
 * ------------------------------------------------------------
 */

export interface Brand {
  primaryColor: string;
  secondaryColor: string;
  accentGreen: string;
  accentRed: string;
  background: string;
  text: string;
}

/**
 * ------------------------------------------------------------
 * NAVIGATION
 * ------------------------------------------------------------
 */

export interface NavigationItem {
  label: string;
  href: string;
}

/**
 * ------------------------------------------------------------
 * CTA
 * ------------------------------------------------------------
 */

export interface CTA {
  label: string;
  href: string;
}

/**
 * ------------------------------------------------------------
 * HERO
 * ------------------------------------------------------------
 */

export interface Hero {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: CTA;
  secondaryCta: CTA;
  image: string;
}

/**
 * ------------------------------------------------------------
 * TRUST POINTS
 * ------------------------------------------------------------
 */

export interface TrustPoint {
  title: string;
  description: string;
}

/**
 * ------------------------------------------------------------
 * ABOUT
 * ------------------------------------------------------------
 */

export interface About {
  shortTitle: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  cta: CTA;
}

/**
 * ------------------------------------------------------------
 * BUSINESS ACTIVITIES
 * ------------------------------------------------------------
 */

export interface BusinessActivity {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  image: string;
}

/**
 * ------------------------------------------------------------
 * SERVICES
 * ------------------------------------------------------------
 */

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  capabilities: string[];
  image: string;
}

/**
 * ------------------------------------------------------------
 * VISION & MISSION
 * ------------------------------------------------------------
 */

export interface VisionMission {
  vision: string;
  mission: string;
}

/**
 * ------------------------------------------------------------
 * CORE VALUES
 * ------------------------------------------------------------
 */

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * ------------------------------------------------------------
 * WHY CHOOSE US
 * ------------------------------------------------------------
 */

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
}

/**
 * ------------------------------------------------------------
 * PROPRIETOR MESSAGE
 * ------------------------------------------------------------
 */

export interface ProprietorMessage {
  name: string;
  designation: string;
  title: string;
  intro: string;
  message: string;
  closing: string;
  image: string;
}

/**
 * ------------------------------------------------------------
 * PROJECTS
 * ------------------------------------------------------------
 */

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  client: string;
  location: string;
  scope: string[];
  workOrderNo: string;
  certificateNo: string;
  completionDate: string;
  contractValue: string;
  description: string;
  certificateImage: string;
  images: string[];
}

/**
 * ------------------------------------------------------------
 * CREDENTIALS
 * ------------------------------------------------------------
 */

export interface Credential {
  id: string;
  title: string;
  type: string;
  description: string;
  document: string;
  publicDisplay: boolean;
}

/**
 * ------------------------------------------------------------
 * SOCIAL LINKS
 * ------------------------------------------------------------
 */

export interface SocialLinks {
  facebook: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
}

/**
 * ------------------------------------------------------------
 * CONTACT CTA
 * ------------------------------------------------------------
 */

export interface ContactCTA {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}

/**
 * ------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------
 */

export interface Footer {
  tagline: string;
  copyright: string;
}

/**
 * ------------------------------------------------------------
 * SEO
 * ------------------------------------------------------------
 */

export interface SEO {
  siteTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImage: string;
}

/**
 * ------------------------------------------------------------
 * COMPLETE SITE DATA MODEL
 * ------------------------------------------------------------
 */

export interface SiteData {
  company: Company;
  contact: Contact;
  brand: Brand;
  navigation: NavigationItem[];
  hero: Hero;
  trustPoints: TrustPoint[];
  about: About;
  businessActivities: BusinessActivity[];
  services: Service[];
  visionMission: VisionMission;
  coreValues: CoreValue[];
  whyChooseUs: WhyChooseUsItem[];
  proprietorMessage: ProprietorMessage;
  projects: Project[];
  credentials: Credential[];
  socialLinks: SocialLinks;
  contactCta: ContactCTA;
  footer: Footer;
  seo: SEO;
}