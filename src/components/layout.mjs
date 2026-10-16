// Page shell: <head> (SEO, preloads, structured data), SiteHeader with dropdowns and the Start-free chooser, the mobile
// menu sheet, the chooser bottom sheet and SiteFooter — all labels, URLs and tracking from navigation.json.
import { html, raw, attrs, trackAttrs, esc } from '../lib/html.mjs';
import { icon, sprite, resetIcons } from '../lib/icons.mjs';
import { nav, site, startFreeOverride, year } from '../lib/data.mjs';
import { tm, splitArrow } from './ui.mjs';

const slug = (s) => String(s).toLowerCase().replace(/[↗→]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const navTrack = (it) => (it.track ? trackAttrs(it.track.track, Object.fromEntries(Object.entries(it.track).filter(([k]) => k !== 'track'))) : raw(''));
const appIcon = (product, size = 40) => html`<img class="app-icon" src="/assets/brand/${product === 's_invoice' ? 's-invoice-icon' : 'app-icon'}.webp" width="${size}" height="${size}" alt="" loading="lazy" decoding="async">`;

function linkLabel(label, srContext) {
  const [text, arrow] = splitArrow(label);
  return html`<span>${tm(text)}</span>${srContext ? html`<span class="sr-only"> (${srContext})</span>` : ''}${arrow ? icon(arrow, { size: 16, cls: 'link-arrow' }) : ''}`;
}

function isActive(route, href) {
  if (!href || href.startsWith('http')) return false;
  const path = href.split('#')[0];
  return path === route && route !== '/';
}

// ---------------------------------------------------------------- header
function dropdownItems(group, route) {
  const out = [];
  for (const it of group.items) {
    if (it.divider) { out.push(html`<li class="dd__rule" role="presentation"></li>`); continue; }
    if (it.group_label) { out.push(html`<li class="dd__group" role="presentation">${it.group_label}</li>`); continue; }
    const product = /s-invoice/.test(it.href) || it.label.startsWith('S Invoice') ? 's_invoice' : 's_protocol';
    const rich = it.description;
    out.push(html`<li><a class="dd__item${rich ? ' dd__item--rich' : ''}${isActive(route, it.href) ? ' is-current' : ''}" href="${it.href}"${navTrack(it)}${attrs({ 'aria-current': isActive(route, it.href) ? 'page' : null })}>${it.icon && it.icon !== 'arrow-right' ? appIcon(product, 40) : ''}<span class="dd__text"><span class="dd__name">${linkLabel(it.label, it.sr_context)}${it.icon === 'arrow-right' ? icon('arrow-right', { size: 16, cls: 'link-arrow' }) : ''}</span>${rich ? html`<span class="dd__desc">${it.description}</span>` : ''}</span></a></li>`);
  }
  return out;
}

function navDropdown(group, route) {
  const id = `dd-${group.id}`;
  const active = group.items.some((it) => isActive(route, it.href));
  return html`<li class="nav-dd" data-dd>
    <button class="site-nav__link nav-dd__btn${active ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="${id}" data-nav-menu="${group.track_open.menu}">${group.label}${icon('chevron-down', { size: 16, cls: 'nav-dd__chev' })}</button>
    <div class="dd dd--${group.id}" id="${id}" hidden><ul class="dd__list">${dropdownItems(group, route)}</ul></div>
  </li>`;
}

function signinDropdown(group) {
  return html`<div class="nav-dd nav-dd--right" data-dd>
    <button class="btn btn--secondary btn--md btn--header nav-dd__btn" type="button" aria-expanded="false" aria-controls="dd-signin" data-nav-menu="${group.track_open.menu}"><span>${group.label}</span>${icon('chevron-down', { size: 16, cls: 'nav-dd__chev' })}</button>
    <div class="dd dd--signin" id="dd-signin" hidden><ul class="dd__list">${group.items.map((it) => html`<li><a class="dd__item dd__item--rich" href="${it.href}"${navTrack(it)}><span class="dd__text"><span class="dd__name"><span>${it.label}</span></span><span class="dd__desc dd__desc--mono">${linkLabel(it.meta, it.sr_context)}</span></span></a></li>`)}</ul></div>
  </div>`;
}

function chooserOptions(group) {
  return html`<p class="chooser__heading eyebrow" id="${'%ID%'}">${group.heading}</p>
    <ul class="chooser__list">${group.options.map((o) => html`<li><a class="chooser__opt" href="${o.href}"${navTrack(o)}>${appIcon(o.product, 40)}<span class="chooser__text"><span class="chooser__name">${o.label}</span><span class="chooser__line">${o.line}</span><span class="chooser__meta">${o.meta}</span></span>${icon('arrow-right', { size: 20, cls: 'chooser__arrow' })}</a></li>`)}</ul>
    <a class="chooser__foot text-link" href="${group.footer_link.href}"${navTrack(group.footer_link)}>${linkLabel(group.footer_link.label)}</a>`;
}

function startFree(group, route) {
  const o = startFreeOverride(route);
  if (o) {
    const t = navTrack(o);
    return {
      desktop: html`<a class="btn btn--primary btn--md btn--header" href="${o.href}"${t}><span>${o.label}</span></a>`,
      mobile: html`<a class="btn btn--primary btn--sm mobile-only" href="${o.href}"${t}><span>${o.label}</span></a>`,
      sheet: raw(''),
    };
  }
  const desktop = html`<div class="nav-dd nav-dd--right" data-dd>
    <button class="btn btn--primary btn--md btn--header nav-dd__btn" type="button" aria-expanded="false" aria-controls="dd-start" data-nav-menu="${group.track_open.menu}"><span>${group.label}</span>${icon('chevron-down', { size: 16, cls: 'nav-dd__chev' })}</button>
    <div class="dd dd--start chooser" id="dd-start" hidden>${raw(chooserOptions(group).value.replace('%ID%', 'chooser-dd-title'))}</div>
  </div>`;
  const mobile = html`<button class="btn btn--primary btn--sm mobile-only" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="chooser-sheet" data-sheet-open="chooser-sheet" data-nav-menu="${group.track_open.menu}"><span>${group.label}</span></button>`;
  const sheet = html`<div class="sheet sheet--bottom" id="chooser-sheet" role="dialog" aria-modal="true" aria-labelledby="chooser-sheet-title" hidden>
    <div class="sheet__scrim" data-sheet-close></div>
    <div class="sheet__panel chooser" tabindex="-1">
      <button class="sheet__close" type="button" data-sheet-close aria-label="Close">${icon('x', { size: 22 })}</button>
      ${raw(chooserOptions(group).value.replace('%ID%', 'chooser-sheet-title'))}
    </div>
  </div>`;
  return { desktop, mobile, sheet };
}

function mobileMenu(route) {
  const sections = nav.mobile_menu.sections;
  const cards = sections.find((s) => s.type === 'product_cards');
  const links = sections.find((s) => s.type === 'links');
  const signin = sections.find((s) => s.type === 'signin');
  const legal = sections.find((s) => s.type === 'legal_small');
  const linkTrack = (label) => trackAttrs(links.track.track, { menu: links.track.menu, item: slug(label) });
  return html`<div class="sheet sheet--side" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <div class="sheet__scrim" data-sheet-close></div>
    <div class="sheet__panel menu" tabindex="-1">
      <div class="menu__top"><a class="site-header__logo" href="/" aria-label="${nav.header.logo.aria_label}"><img src="/assets/brand/logo-header.webp" width="127" height="28" alt=""></a><button class="sheet__close" type="button" data-sheet-close aria-label="Close menu">${icon('x', { size: 22 })}</button></div>
      <ul class="menu__cards">${cards.items.map((c) => html`<li><a class="menu__card" href="${c.href}"${navTrack(c)}>${appIcon(c.href.includes('invoice') ? 's_invoice' : 's_protocol', 36)}<span><span class="menu__card-name">${c.label}</span><span class="menu__card-meta">${tm(c.meta)}</span></span>${icon('arrow-right', { size: 18 })}</a></li>`)}</ul>
      <ul class="menu__links">${links.items.map((l) => l.type === 'expandable'
        ? html`<li class="menu__exp"><button class="menu__link" type="button" aria-expanded="false" aria-controls="menu-industries" data-expand>${l.label}${icon('chevron-down', { size: 18, cls: 'menu__chev' })}</button><ul class="menu__sub" id="menu-industries" hidden>${l.items.map((s) => html`<li><a class="menu__link menu__link--sub" href="${s.href}"${linkTrack(s.label)}>${s.label}</a></li>`)}</ul></li>`
        : html`<li><a class="menu__link${isActive(route, l.href) ? ' is-current' : ''}" href="${l.href}"${linkTrack(l.label)}${attrs({ 'aria-current': isActive(route, l.href) ? 'page' : null })}>${l.label}</a></li>`)}</ul>
      <ul class="menu__signin">${signin.items.map((s) => html`<li><a class="menu__link" href="${s.href}"${navTrack(s)}>${linkLabel(s.label)}</a></li>`)}</ul>
      <p class="menu__legal">${legal.items.map((l, i) => html`${i ? html`<span aria-hidden="true"> · </span>` : ''}<a href="${l.href}">${l.label}</a>`)}</p>
    </div>
  </div>`;
}

export function header(route) {
  const primary = nav.header.primary;
  const [signin, start] = nav.header.right;
  const sf = startFree(start, route);
  return html`<a class="skip-link" href="#main">Skip to content</a>
<div class="header-sentinel" aria-hidden="true"></div>
<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__logo" href="/" aria-label="${nav.header.logo.aria_label}"><img src="/assets/brand/logo-header.webp" width="145" height="32" alt=""></a>
    <nav class="site-nav" aria-label="Main"><ul class="site-nav__list">${primary.map((g) => (g.type === 'dropdown' ? navDropdown(g, route)
      : html`<li><a class="site-nav__link${isActive(route, g.href) ? ' is-current' : ''}" href="${g.href}"${navTrack(g)}${attrs({ 'aria-current': isActive(route, g.href) ? 'page' : null })}>${g.label}</a></li>`))}</ul></nav>
    <div class="site-header__actions">
      <div class="desktop-only site-header__cluster">${signinDropdown(signin)}${sf.desktop}</div>
      ${sf.mobile}
      <button class="menu-btn mobile-only" type="button" aria-label="${nav.mobile_menu.trigger.aria_label}" aria-haspopup="dialog" aria-expanded="false" aria-controls="mobile-menu" data-sheet-open="mobile-menu" data-nav-menu="mobile">${icon('menu', { size: 24 })}</button>
    </div>
  </div>
</header>
${mobileMenu(route)}
${sf.sheet}`;
}

// ---------------------------------------------------------------- footer
export function footer() {
  const f = nav.footer;
  const dflt = f.default_link_track;
  const legal = f.legal_block.filter((l) => !l.startsWith('{')).map((l) => l.replace('{current year}', String(year())));
  const link = (l) => {
    const t = l.track ? navTrack(l) : trackAttrs(dflt.track, { link: slug(l.label) });
    if (l.href.startsWith('mailto:') && l.label.includes('@')) {
      const [user, host] = l.label.split('@');
      return html`<li><a href="${l.href}"${t}><span><span class="nowrap">${user}@</span><wbr><span class="nowrap">${host}</span></span></a></li>`;
    }
    return html`<li><a href="${l.href}"${t}>${linkLabel(l.label, l.sr_context)}</a></li>`;
  };
  return html`<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">
      <div class="site-footer__brand">
        <a class="site-footer__logo" href="/" aria-label="${nav.header.logo.aria_label}"><img src="/assets/brand/logo-footer.webp" width="155" height="32" alt="" loading="lazy" decoding="async"></a>
        <p>${f.brand_blurb}</p>
      </div>
      ${f.columns.map((c) => html`<nav class="site-footer__col" aria-label="${c.heading[0] + c.heading.slice(1).toLowerCase()}"><h2 class="site-footer__heading">${c.heading}</h2><ul>${c.links.map(link)}</ul></nav>`)}
    </div>
    <div class="site-footer__legal">${legal.map((l) => html`<p>${tm(l)}</p>`)}</div>
  </div>
</footer>`;
}

// ---------------------------------------------------------------- document
/**
 * A complete HTML document. meta: { route, title, description, canonicalPath, ogTitle?, ogDescription?, page (data-page),
 * robots?, preloads (html), jsonld (object|array), headExtra (html), verification (bool) }
 */
export function documentShell(meta, body) {
  const canonical = meta.route === '/' ? `${site.origin}/` : `${site.origin}${meta.canonicalPath ?? meta.route}`;
  const ld = meta.jsonld ? (Array.isArray(meta.jsonld) ? meta.jsonld : [meta.jsonld]) : [];
  const og = site.og_image;
  const doc = html`<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
${meta.description ? html`<meta name="description" content="${meta.description}">` : ''}
<meta name="robots" content="${meta.robots ?? 'index, follow'}">
${meta.verification ? html`<meta name="google-site-verification" content="${site.google_site_verification}">` : ''}
${meta.robots && /noindex/.test(meta.robots) ? '' : html`<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="S Protocol">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${meta.ogTitle ?? meta.title}">
${meta.description ? html`<meta property="og:description" content="${meta.ogDescription ?? meta.description}">` : ''}
<meta property="og:image" content="${og.url}">
<meta property="og:image:width" content="${og.width}">
<meta property="og:image:height" content="${og.height}">
<meta property="og:image:alt" content="${meta.ogImageAlt ?? 'S Protocol and S Invoice — software for service businesses'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.ogTitle ?? meta.title}">
${meta.description ? html`<meta name="twitter:description" content="${meta.ogDescription ?? meta.description}">` : ''}
<meta name="twitter:image" content="${og.url}">
<meta name="theme-color" content="#FAF9F6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1220" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light">
<link rel="icon" type="image/svg+xml" href="/assets/favicons/white/favicon.svg">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicons/white/favicon-96x96.png">
<link rel="shortcut icon" href="/assets/favicons/white/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/app/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/newsreader-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
${meta.preloads ?? ''}
<link rel="stylesheet" href="/assets/css/site.css">
<noscript><style>.faq__a[hidden]{display:grid!important;content-visibility:visible!important;height:auto!important;padding-bottom:24px!important;overflow:visible!important}</style></noscript>
<script>${raw(meta.headScript)}</script>
${meta.headExtra ?? ''}
<script src="/clarity.js" defer></script>
<script type="module" src="/assets/js/main.js"></script>
${(meta.scripts ?? []).map((src) => html`<script type="module" src="${src}"></script>`)}
${ld.map((j) => html`<script type="application/ld+json">${raw(JSON.stringify(j, null, 2).replace(/</g, '\\u003c'))}</script>`)}
</head>
<body data-page="${meta.page}">
${body}
</body>
</html>
`;
  return doc;
}

/** Renders a full page and injects the icon sprite for the icons the page used. */
export function renderPage(meta, renderBody) {
  resetIcons();
  const body = html`${header(meta.route)}
<main id="main" tabindex="-1">
${renderBody()}
</main>
${footer()}`;
  const withSprite = html`${sprite()}${body}`;
  return documentShell(meta, withSprite).value.replace(/\n{3,}/g, '\n\n');
}

export { esc };
