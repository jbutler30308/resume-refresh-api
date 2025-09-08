import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';


// --- helper: extract fenced JSON (```json ... ```)
export function extractFencedJson(raw) {
  const regex = /```json\s*([\s\S]*?)\s*```/i;
  const m = raw.match(regex);
  if (!m) return { jsonText: null, md: raw };
  const jsonText = m[1].trim();
  const md = raw.replace(regex, '').trim();
  console.log({ jsonText, md }, null, 2)
  return { jsonText, md };
}

export function safeJsonParse(jsonText) {
  if (!jsonText) return { data: null, error: null };
  try {
    return { data: JSON.parse(jsonText), error: null };
  } catch (e) {
    // gentle cleanup: remove trailing commas then retry
    try {
      const cleaned = jsonText.replace(/,\s*(}|])/g, '$1');
      return { data: JSON.parse(cleaned), error: null };
    } catch (e2) {
      return { data: null, error: e2.message || e.message };
    }
  }
}

// Very small renderer for JSON -> HTML string (server-side)
function renderParsedJsonAsHtml(parsed) {
  if (!parsed) return '';
  const categories = parsed.categories || parsed;
  let out = '<div class="travel-json">';
  for (const key of Object.keys(categories)) {
    const items = categories[key];
    if (!Array.isArray(items) || items.length === 0) continue;
    out += `<section class="category"><h2>${escapeHtml(pretty(key))}</h2><div class="items">`;
    for (const it of items) {
      out += `<article class="item card">
        <h3>${escapeHtml(it.name || 'Untitled')}</h3>
        <div class="meta small-muted">${escapeHtml(it.type || '')} ${it.availability ? ' • ' + escapeHtml(it.availability) : ''}</div>
        <p>${escapeHtml(it.short_description || it.price_extraction_note || '')}</p>
        <div class="contacts">`;
      if (it.phone_e164 || it.contact_phone) {
        const phone = it.phone_e164 || it.contact_phone;
        out += `<a class="tel" href="tel:${escapeHtml(phone.replace(/[^+0-9]/g,''))}">${escapeHtml(phone)}</a>`;
      }
      if (it.email) {
        out += ` <a class="email" href="mailto:${escapeHtml(it.email)}">${escapeHtml(it.email)}</a>`;
      }
      if (it.website) {
        const href = it.website.startsWith('http') ? it.website : 'https://' + it.website;
        out += ` <a class="website" href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(it.website)}</a>`;
      }
      out += `</div>`; // contacts
      out += `<div class="foot small-muted">Confidence: ${escapeHtml(String(it.confidence || 'n/a'))} ${it.source_urls ? renderSourceLinks(it.source_urls) : ''}</div>`;
      out += `</article>`;
    }
    out += `</div></section>`;
  }
  // top contacts
  if (parsed.top_contacts_vcards && parsed.top_contacts_vcards.length) {
    out += `<section class="top-contacts"><h2>Top contacts</h2>`;
    parsed.top_contacts_vcards.forEach(c => {
      const slug = slugify(c.name || 'contact', { lower: true, strict: true });
      const tel = c.tel ? c.tel.replace(/[^+0-9]/g,'') : '';
      // vcard download endpoint is below
      out += `<div class="contact-card">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="tel">${c.tel ? `<a href="tel:${escapeHtml(tel)}">${escapeHtml(c.tel)}</a>` : '—'}</div>
        <div class="email">${c.email ? `<a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a>` : '—'}</div>
        <div class="vc-download"><a href="/vcf/${encodeURIComponent(slug)}" target="_blank">Download vCard</a></div>
      </div>`;
    });
    out += `</section>`;
  }
  out += '</div>';
  return out;
}

function renderSourceLinks(urls) {
  if (!urls) return '';
  return urls.slice(0,2).map(u => {
    const href = u.startsWith('http') ? u : 'https://' + u;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">source</a>`;
  }).join(' ');
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function pretty(s) {
  return s.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Simple vCard generation store (in-memory) - in production store persistently
const vcardStore = {};
function makeVCard(contact) {
  const lines = ['BEGIN:VCARD','VERSION:3.0'];
  if (contact.name) lines.push('FN:' + contact.name);
  if (contact.tel) lines.push('TEL;TYPE=WORK,VOICE:' + contact.tel);
  if (contact.email) lines.push('EMAIL;TYPE=INTERNET:' + contact.email);
  if (contact.website) lines.push('URL:' + contact.website);
  if (contact.note) lines.push('NOTE:' + contact.note.replace(/\r?\n/g,' '));
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export const parseResponse = (rawText) => {

  const { jsonText, md } = extractFencedJson(rawText);
  const parsedRes = safeJsonParse(jsonText);
  const parsed = parsedRes.data;
  // If parse error, we still render markdown but include a warning
  let htmlParts = '';
  if (parsedRes.error) {
    htmlParts += `<div class="warning">JSON parse error: ${escapeHtml(parsedRes.error)}</div>`;
  }

  // Render JSON -> HTML server-side
  const jsonHtml = renderParsedJsonAsHtml(parsed);
  // Render markdown -> HTML via marked
  const markdownHtml = md ? marked(md) : '';

  // Combine and sanitize
  const combined = `<div class="travel-output">${jsonHtml}${markdownHtml}</div>`;
  // Use sanitize-html to strip unsafe tags/attributes before sending to client
  const safe = sanitizeHtml(combined, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'section', 'article', 'h2', 'h3']),
    allowedAttributes: {
      a: ['href','target','rel'],
      img: ['src','alt']
    },
    allowedSchemesByTag: {
      a: ['http','https','mailto','tel']
    }
  });

  // Optionally add small CSS so it looks fine in Squarespace. Keep minimal to avoid conflicts.
  const css = `<style>
    .travel-output { font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #0f172a; }
    .travel-output .card { border-radius:6px; padding:12px; margin-bottom:10px; background:#fff; }
    .travel-output .small-muted { color:#6b7280; font-size:0.95rem; }
  </style>`;

  return(css + safe);
};

// vCard endpoint: returns a .vcf for a contact slug (in production, map slug -> contact details)
// app.get('/vcf/:slug', (req, res) => {
//   const slug = req.params.slug;
//   // In a real app, look up the contact details by slug from your DB/store created during render
//   // For demo, we check the vcardStore
//   const contact = vcardStore[slug];
//   if (!contact) return res.status(404).send('Not found');
//   const v = makeVCard(contact);
//   res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
//   res.setHeader('Content-Disposition', `attachment; filename="${slug}.vcf"`);
//   res.send(v);
// });

