# DarkLens

> See what websites are trying to make you do.

DarkLens is a privacy-conscious Chrome/Chromium Manifest V3 extension built with TypeScript, React, and Vite. It uses deterministic, evidence-first rules to surface potential dark patterns without sending page content to an AI provider.

## Run

```bash
npm install
npm run build
```

Then open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select the generated `dist/` directory.

## Features

- Popup scan flow with current hostname, risk score, and detected pattern count
- Rule-based detection for artificial urgency, confirmshaming, preselection, potential interface interference, hidden costs, and privacy manipulation
- Evidence, confidence, severity, and explanation for each result
- Page extraction that excludes passwords, payment fields, form input, contenteditable content, navigation, ads, and footers
- Subtle evidence highlighting with a DarkLens marker and a toggle to disable it
- Chrome Side Panel with full detection cards and “Show on page” controls
- Options page for scan, highlighting, optional AI, form analysis, and history preferences
- Built-in demo mode with synthetic urgency, confirmshaming, preselection, and cookie-consent examples
- Light/dark-friendly design with local-first defaults

## Notes

The risk score is an estimate based on detected interface patterns and is not scientifically validated. Interface prominence is reported as **potential interface interference**, not as a claim of malicious intent. DarkLens does not make legal or compliance claims.
