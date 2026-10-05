import type { Detection, PageSnapshot } from '../shared/types';
const add = (out: Detection[], d: Omit<Detection,'id'>) => out.push({ ...d, id: `${d.pattern}-${out.length}` });
export function detect(snapshot: PageSnapshot): Detection[] {
 const out: Detection[] = []; const all = `${snapshot.text} ${snapshot.buttons.map(b=>b.text).join(' ')}`;
 const urgency = /limited time|act now|offer ends|only\s+\d+\s*(?:minutes?|hours?|seconds?)\s*(?:left|remaining)|hurry|countdown|last chance|ending soon|\b\d{1,2}:\d{2}(?::\d{2})?\b/i.exec(all);
 if (urgency) { const timer = snapshot.timers.find(t=>urgency[0].toLowerCase().includes(t.text.toLowerCase()) || t.text.match(/\d{1,2}:\d{2}/)); add(out,{pattern:'Artificial Urgency',evidence:timer?.text || urgency[0],confidence:timer ? 90 : 76,why:'Urgency language or a countdown can create pressure around the user’s decision.',severity:timer ? 'High':'Medium',selector:timer?.selector}); }
 const shame = snapshot.buttons.find(b=>/no[, ]*(?:thanks|thank you)|i (?:don'?t|do not) want|hate (?:discounts?|saving)|rather pay|miss out/i.test(b.text));
 if (shame) add(out,{pattern:'Confirmshaming',evidence:shame.text,confidence:88,why:'The rejection option frames declining as a negative personal choice.',severity:'High',selector:shame.selector});
 const checked = snapshot.checkboxes.find(c=>c.checked && /optional|support|insurance|protection|subscribe|newsletter|add|premium|marketing|updates/i.test(c.text));
 if (checked) add(out,{pattern:'Preselection',evidence:checked.text || 'Optional checkbox is already selected',confidence:86,why:'An optional add-on or subscription appears selected before the user chooses it.',severity:'Medium',selector:checked.selector});
 const accept = snapshot.buttons.find(b=>/accept all|buy now|subscribe|continue|agree/i.test(b.text)); const reject = snapshot.buttons.find(b=>/manage settings|reject|decline|cancel|no thanks/i.test(b.text));
 if (accept && reject && accept.area > Math.max(1, reject.area) * 1.35) add(out,{pattern:'Interface Interference',evidence:`${accept.text} vs. ${reject.text}`,confidence:74,why:'One choice is substantially more prominent than another; this is a potential interface interference pattern.',severity:'Medium',selector:accept.selector});
 if (/accept all cookies|allow all cookies|agree to all/i.test(all) && reject) add(out,{pattern:'Privacy Manipulation',evidence:`${accept?.text || 'Accept all cookies'} vs. ${reject.text}`,confidence:82,why:'The tracking-friendly choice appears more prominent than the privacy-friendly alternative. This is not a legal assessment.',severity:'High',selector:accept?.selector});
 const fee = /(?:service|processing|shipping|booking) fee|mandatory add[- ]on|additional charge/i.exec(all);
 if (fee && snapshot.prices.length > 1) add(out,{pattern:'Hidden Costs',evidence:fee[0],confidence:70,why:'A fee indicator appears alongside pricing information and may change the apparent total.',severity:'Medium'});
 return out;
}
export function score(detections: Detection[]) { return Math.min(100, Math.round(detections.reduce((s,d)=>s + (d.severity==='High'?22:d.severity==='Medium'?14:7) * d.confidence/100, 0))); }
