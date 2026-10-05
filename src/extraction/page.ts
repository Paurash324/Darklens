import type { PageSnapshot } from '../shared/types';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const visible = (el: Element) => { const r = (el as HTMLElement).getBoundingClientRect(); const st = getComputedStyle(el as HTMLElement); return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; };
const selectorFor = (el: Element) => { const id = (el as HTMLElement).id; if (id) return `#${CSS.escape(id)}`; const cls = [...(el as HTMLElement).classList].slice(0,2).map(CSS.escape).join('.'); return `${el.tagName.toLowerCase()}${cls ? '.'+cls : ''}`; };
export function extractPage(): PageSnapshot {
 const body = document.body.cloneNode(true) as HTMLElement;
 body.querySelectorAll('script,style,noscript,iframe,nav,footer,aside,header,form,input,textarea,select,[contenteditable="true"]').forEach(e => e.remove());
 const text = clean(body.innerText).slice(0, 30000);
 const buttons = [...document.querySelectorAll('button,a,[role="button"]')].filter(visible).map(el => ({ text: clean(el.textContent || '').slice(0,160), selector: selectorFor(el), area: Math.round((el as HTMLElement).getBoundingClientRect().width * (el as HTMLElement).getBoundingClientRect().height), color: getComputedStyle(el as HTMLElement).backgroundColor })).filter(x => x.text);
 const timers = [...document.querySelectorAll('body *')].filter(visible).map(el => ({ text: clean(el.textContent || ''), selector: selectorFor(el) })).filter(x => /(?:\b\d{1,2}:\d{2}(?::\d{2})?|\d+\s*(?:minutes?|hours?|seconds?)\s*(?:left|remaining)|countdown)/i.test(x.text)).slice(0, 10);
 const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')].filter(visible).map(el => ({ text: clean(el.parentElement?.textContent || el.getAttribute('aria-label') || ''), selector: selectorFor(el), checked: (el as HTMLInputElement).checked }));
 const prices = [...text.matchAll(/(?:[$€£]\s?\d+[\d,.]*|\d+[\d,.]*\s?(?:USD|EUR|GBP))/gi)].map(m=>m[0]).slice(0,20);
 return { title: document.title, text, buttons, timers, checkboxes, prices };
}
