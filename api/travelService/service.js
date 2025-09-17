import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import logger from '../lib/logger.js'

// --- RENDER FUNCTIONS ---

function renderMetaSection(meta) {
  if (!meta) return '';
  return `<section class="meta-info">
      <h2>Trip Details</h2>
      <p><strong>Destination:</strong> ${escapeHtml(meta.destination)}</p>
      <p><strong>Dates:</strong> ${escapeHtml(meta.dates)}</p>
      <p><strong>Group:</strong> ${escapeHtml(String(meta.groupSize))} people (${escapeHtml(meta.groupDetails)})</p>
      <p class="small-muted">Report generated on ${escapeHtml(meta.generated_at)}</p>
    </section>`;
}

export function renderPrice(item) {
  if (!item) return '';
  const { price_value, currency, price_extraction_note } = item;

  let priceHtml = '';
  const currencySymbol = currency === 'USD' ? '$' : '';
  const formattedCurrency = currency || '';

  if (typeof price_value === 'string' && price_value.trim()) {
    priceHtml = `<div class="price">${escapeHtml(price_value)} ${formattedCurrency}</div>`;
  }

  const noteHtml = price_extraction_note ? `<div class="price-note">${escapeHtml(price_extraction_note)}</div>` : '';

  return priceHtml + noteHtml;
}

export function renderContactInfo(item) {
  let out = '<div class="contacts">';
  if (item.phone_local) {
    const telLink = item.phone_e164 || item.phone_local.replace(/[^+\d]/g, '');
    out += `<a class="tel" href="tel:${escapeHtml(telLink)}">${escapeHtml(item.phone_local)}</a>`;
  }
  if (item.email) {
    out += ` <a class="email" href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>`;
  }
  if (item.website) {
    const href = item.website.startsWith('http') ? item.website : 'https://' + item.website;
    out += ` <a class="website" href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(item.website)}</a>`;
  }
  out += '</div>';
  return out;
}

export function renderItemFooter(item) {
  return `<div class="foot small-muted">Confidence: ${escapeHtml(String(item.confidence || 'n/a'))} ${item.source_urls ? renderSourceLinks(item.source_urls) : ''}</div>`;
}

export function renderItem(it) {
  const addressHtml = it.address ? `<div class="address">${escapeHtml(it.address)}</div>` : '';
  return `<article class="item card" id="${slugify(it.id || it.name || 'item', { lower: true, strict: true })}">
        <h3>${escapeHtml(it.name || 'Untitled')}</h3>
        <p>${escapeHtml(it.short_description || '')}</p>
        ${addressHtml}
        ${renderPrice(it)}
        ${renderContactInfo(it)}
        ${renderItemFooter(it)}
      </article>`;
}

function renderCategorySection(categoryName, items) {
  logger.info('category: %j', categoryName);
  logger.info('items: %j', items)
  if (!Array.isArray(items) || items.length === 0) return '';
  let out = `<section class="category"><h2>${escapeHtml(pretty(categoryName))}</h2><div class="items">`;
  for (const it of items) {
    out += renderItem(it);
  }
  out += `</div></section>`;
  return out;
}

function renderContactsSection(vcards) {
  if (!vcards || vcards.length === 0) return '';
  let out = `<section class="top-contacts"><h2>Contacts</h2>`;
  vcards.forEach(c => {
    const slug = slugify(c.name || 'contact', { lower: true, strict: true });
    const tel = c.tel ? c.tel.replace(/[^+\d]/g, '') : '';
    const websiteHtml = c.website ? `<div class="website"><a href="${escapeHtml(c.website)}" target="_blank" rel="noopener">${escapeHtml(c.website)}</a></div>` : '';
    const noteHtml = c.note ? `<div class="note">${escapeHtml(c.note)}</div>` : '';
    out += `<div class="contact-card">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="tel">${c.tel ? `<a href="tel:${escapeHtml(tel)}">${escapeHtml(c.tel)}</a>` : '—'}</div>
        ${c.email ? `<div class="email"><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></div>` : ''}
        ${websiteHtml}
        ${noteHtml}
      </div>`;
  });
  out += `</section>`;
  return out;
}

function renderSourcesSection(sources) {
  if (!sources || sources.length === 0) return '';
  let out = `<section class="sources"><h2>Data Sources</h2><ul>`;
  sources.forEach(source => {
    const href = source.startsWith('http') ? source : 'https://' + source;
    out += `<li><a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(source)}</a></li>`;
  });
  out += `</ul></section>`;
  return out;
}

function renderParsedJsonAsHtml(parsed) {
  if (!parsed) return '';
  const categories = parsed.categories || {};
  let out = '<div class="travel-json">';

  for (const key of Object.keys(categories)) {
    out += renderCategorySection(key, categories[key]);
  }

  const contacts = parsed.contacts_vcards || parsed.top_contacts_vcards;
  out += renderContactsSection(contacts);

  out += '</div>';
  return out;
}

// --- HELPERS ---

function renderSourceLinks(urls) {
  if (!urls) return '';
  return urls.slice(0, 2).map(u => {
    const href = u.startsWith('http') ? u : 'https://' + u;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">source</a>`;
  }).join(' ');
}

function escapeHtml(s) {
  if (!s) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(s).replace(/[&<>"'\/]/g, c => map[c] || c);
}

function pretty(s) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// --- MAIN EXPORT ---

export const parseResponse = (travelPlan) => {
  // The travelPlan is now a direct JSON object.
  const metaHtml = renderMetaSection(travelPlan.meta);
  const reportHtml = travelPlan.report ? marked(travelPlan.report) : '';

  // Render the structured categories and contacts from the JSON object
  const jsonHtml = renderParsedJsonAsHtml(travelPlan);
  const sourcesHtml = renderSourcesSection(travelPlan.meta?.sources);

  // Combine and sanitize
  const combined = `<div class="travel-output" id="travelOutput">${metaHtml}${reportHtml}${jsonHtml}${sourcesHtml}</div>`;
  logger.info('combined: %j', combined);

  const safe = sanitizeHtml(combined, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['section', 'article', 'h2', 'h3', 'div']),
    allowedAttributes: {
      a: ['class', 'href', 'target', 'rel'],
      article: ['class', 'id'],
      div: ['class', 'id'],
      section: ['class']
    },
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto', 'tel']
    }
  });

  const css = `<style>
    .travel-output { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; }
    .travel-output .card { border-radius:6px; padding:12px; margin-bottom:10px; background:#fff; }
    .travel-output .small-muted { color:#6b7280; font-size:0.95rem; }
    .contact-card { margin-bottom: 18px; }
  </style>`;

  return (css + safe);
};