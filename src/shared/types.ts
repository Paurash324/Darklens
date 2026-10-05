export type PatternType = 'Artificial Urgency' | 'Confirmshaming' | 'Preselection' | 'Interface Interference' | 'Hidden Costs' | 'Privacy Manipulation';
export type Severity = 'Low' | 'Medium' | 'High';
export interface Detection { id: string; pattern: PatternType; evidence: string; confidence: number; why: string; severity: Severity; selector?: string; }
export interface ScanResult { url: string; hostname: string; title: string; detections: Detection[]; score: number; scannedAt: number; isDemo?: boolean; }
export interface PageSnapshot { title: string; text: string; buttons: { text: string; selector: string; area: number; color: string }[]; timers: { text: string; selector: string }[]; checkboxes: { text: string; selector: string; checked: boolean }[]; prices: string[]; }
export const DEMO_RESULT: ScanResult = { url: 'https://demo.darklens.local', hostname: 'demo.darklens.local', title: 'DarkLens demo patterns', isDemo: true, score: 74, scannedAt: Date.now(), detections: [
 { id:'demo-urgency', pattern:'Artificial Urgency', evidence:'Only 03:24:12 remaining!', confidence:87, why:'A countdown timer can create pressure around the user’s decision.', severity:'High', selector:'[data-darklens-demo="timer"]' },
 { id:'demo-shame', pattern:'Confirmshaming', evidence:"No, I don't want to save money", confidence:91, why:'The rejection option frames declining as a negative personal choice.', severity:'High', selector:'[data-darklens-demo="shame"]' },
 { id:'demo-preselect', pattern:'Preselection', evidence:'☑ Add priority support — $4.99', confidence:89, why:'An optional paid add-on is selected before the user chooses it.', severity:'Medium', selector:'[data-darklens-demo="checkbox"]' },
 { id:'demo-privacy', pattern:'Privacy Manipulation', evidence:'Accept all cookies', confidence:84, why:'The tracking-friendly choice is more prominent than the privacy-friendly alternative.', severity:'High', selector:'[data-darklens-demo="accept"]' },
 { id:'demo-interference', pattern:'Interface Interference', evidence:'Accept all cookies vs. Manage settings', confidence:78, why:'One choice is visually more prominent, creating potential interface interference.', severity:'Medium', selector:'[data-darklens-demo="accept"]' }
]};
