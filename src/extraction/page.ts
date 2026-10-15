import type { PageSnapshot } from '../shared/types';
const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const visible = (el: Element) => { const r = (el as HTMLElement).getBoundingClientRect(); const st = getComputedStyle(el as HTMLElement); return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; };
const selectorFor = (el: Element) => {
 const id = (el as HTMLElement).id;
 if (id) return `#${CSS.escape(id)}`;
 const parts: string[] = [];
 let current: Element | null = el;
 while (current && current !== document.body && parts.length < 5) {
  const tag = current.tagName.toLowerCase();
  const siblings = current.parentElement ? [...current.parentElement.children].filter(s => s.tagName === current!.tagName) : [];
  const index = siblings.indexOf(current) + 1;
  parts.unshift(`${tag}${siblings.length > 1 ? `:nth-of-type(${index})` : ''}`);
  current = current.parentElement;
 }
 return parts.join(' > ');
};
const excluded = (el: Element) => Boolean(el.closest('nav,footer,aside,header,[aria-hidden="true"],script,style,noscript'));
const unique = <T,>(items: T[], key: (item: T) => string) => [...new Map(items.map(item => [key(item), item])).values()];
export function extractPage(): PageSnapshot {
 const body = document.body.cloneNode(true) as HTMLElement;
 body.querySelectorAll('script,style,noscript,iframe,nav,footer,aside,header,form,input,textarea,select,[contenteditable="true"]').forEach(e => e.remove());
 const text = clean(body.innerText).slice(0, 30000);
 const buttons = unique([...document.querySelectorAll('button,a,[role="button"]')].filter(el => visible(el) && !excluded(el)).map(el => ({ text: clean(el.textContent || el.getAttribute('aria-label') || '').slice(0,160), selector: selectorFor(el), area: Math.round((el as HTMLElement).getBoundingClientRect().width * (el as HTMLElement).getBoundingClientRect().height), color: getComputedStyle(el as HTMLElement).backgroundColor })).filter(x => x.text), x => x.selector).slice(0, 100);
 const timerElements = [...document.querySelectorAll('body *')].filter(el => visible(el) && !excluded(el) && !el.children.length);
 const timers = unique(timerElements.map(el => ({ text: clean(el.textContent || ''), selector: selectorFor(el) })).filter(x => /(?:\b\d{1,2}:\d{2}(?::\d{2})?|\d+\s*(?:minutes?|hours?|seconds?)\s*(?:left|remaining)|countdown)/i.test(x.text)), x => x.text).slice(0, 10);
 const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')].filter(el => visible(el) && !excluded(el)).map(el => ({ text: clean(el.parentElement?.textContent || el.getAttribute('aria-label') || ''), selector: selectorFor(el), checked: (el as HTMLInputElement).checked }));
 const prices = [...text.matchAll(/(?:[$€£]\s?\d+[\d,.]*|\d+[\d,.]*\s?(?:USD|EUR|GBP))/gi)].map(m=>m[0]).slice(0,20);
 return { title: document.title, text, buttons, timers, checkboxes, prices };
}
