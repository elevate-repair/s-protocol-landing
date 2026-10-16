// Structured data (seo-accessibility-performance.md §2). The existing @ids are kept stable — Organization
// `/#organization`, WebSite `/#website`, SoftwareApplication `/#app` (S Protocol) and `/#s-invoice` / `/s-invoice#app`
// (S Invoice), and one `<route>#webpage` per page — so the graph is updated in place, never duplicated. Every price
// comes from pricing.json. No aggregateRating and no review, ever.
import { SP, SI, site } from './data.mjs';

const O = site.origin;
const ORG = { '@id': `${O}/#organization` };
const WEBSITE = { '@id': `${O}/#website` };

const offer = (name, price, unit) => ({
  '@type': 'Offer', name, price: String(price), priceCurrency: 'USD',
  ...(unit ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: String(price), priceCurrency: 'USD', unitCode: unit } } : {}),
});

export const organization = () => ({
  '@type': 'Organization', ...ORG, name: 'S Protocol', legalName: site.organization.legal_name, url: O,
  logo: `${O}/assets/brand/logo-header.png`,
  description: 'Elevate Repair LLC builds S Protocol, the service-business operating platform, and S Invoice, its focused estimates-and-invoicing product.',
  email: site.organization.email,
  sameAs: ['https://app.s-protocol.com', 'https://invoice.s-protocol.com', 'https://apps.apple.com/us/app/s-protocol/id6763838117'],
});

export const website = () => ({ '@type': 'WebSite', ...WEBSITE, url: O, name: 'S Protocol', publisher: ORG });

export const sProtocolApp = () => ({
  '@type': 'SoftwareApplication', '@id': `${O}/#app`, name: 'S Protocol', url: 'https://app.s-protocol.com',
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS',
  description: 'A service-business operating platform — jobs, scheduling, dispatch, technicians, customers, estimates, invoices, payments and reporting in one connected system. A Free plan is available; S Protocol Pro unlocks unlimited use.',
  provider: ORG,
  offers: [offer('Free', SP.free.price), offer('S Protocol Pro — monthly', SP.pro.monthly.price, 'MON'), offer('S Protocol Pro — yearly', SP.pro.yearly.price, 'ANN')],
});

const sInvoiceOffers = () => [offer('Free', SI.free.price), offer('S Invoice Pro — monthly', SI.pro.monthly.price, 'MON'), offer('S Invoice Pro — yearly', SI.pro.yearly.price, 'ANN')];

export const sInvoiceAppHome = () => ({
  '@type': 'SoftwareApplication', '@id': `${O}/#s-invoice`, name: 'S Invoice', url: 'https://invoice.s-protocol.com',
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS',
  description: 'Estimates, invoices, customers, reports and getting paid — for people who bill for their own work. A Free plan is available; S Invoice Pro unlocks unlimited invoices and recorded payments.',
  provider: ORG, offers: sInvoiceOffers(),
});

export const sInvoiceAppPage = () => ({
  '@type': 'SoftwareApplication', '@id': `${O}/s-invoice#app`, name: 'S Invoice', url: 'https://invoice.s-protocol.com',
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web, iOS',
  description: 'Estimates and invoices for independent service businesses — customers, payment tracking and online card payments through Stripe, on the web and on iPhone. An S Protocol product.',
  provider: ORG, offers: sInvoiceOffers(),
});

export const webPage = (route, name, description, extra = {}) => ({
  '@type': 'WebPage', '@id': `${O}${route}#webpage`, url: `${O}${route}`, name, description, isPartOf: WEBSITE, ...extra,
});

export const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });
