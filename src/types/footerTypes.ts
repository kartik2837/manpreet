/* =========================
   Footer Types
========================= */

export interface FooterSectionLink {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterSectionLink[];
}

export interface FooterAddress {
  company: string;
  line1: string;
  line2?: string;
  line3?: string;
  country?: string;
}

export interface Footer {
  _id: string;
  sections: FooterSection[];
  bottomLinks: FooterSectionLink[];
  address: FooterAddress;
  copyrightText: string;
}

export type FooterPayload = Omit<Footer, "_id">;

/* =========================
   Page Types
========================= */

export interface Page {
  _id: string;
  heading: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type PagePayload = Omit<
  Page,
  "_id" | "slug" | "createdAt" | "updatedAt"
>;