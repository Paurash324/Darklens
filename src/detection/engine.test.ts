import { describe, expect, it } from 'vitest';
import { detect, score } from './engine';
import type { PageSnapshot } from '../shared/types';

const snapshot = (overrides: Partial<PageSnapshot> = {}): PageSnapshot => ({
  title: 'Test page',
  text: '',
  buttons: [],
  timers: [],
  checkboxes: [],
  prices: [],
  ...overrides,
});

describe('detect', () => {
  it('detects urgency from a countdown timer', () => {
    const results = detect(snapshot({
      text: 'Only 03:24:12 remaining!',
      timers: [{ text: '03:24:12', selector: '#timer' }],
    }));
    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({ pattern: 'Artificial Urgency', severity: 'High', confidence: 90 }),
    ]));
  });

  it('detects confirmshaming and preselection', () => {
    const results = detect(snapshot({
      buttons: [{ text: "No, I don't want to save money", selector: '#no', area: 100, color: 'transparent' }],
      checkboxes: [{ text: 'Add protection plan', selector: '#protection', checked: true }],
    }));
    expect(results.map(result => result.pattern)).toEqual(expect.arrayContaining(['Confirmshaming', 'Preselection']));
  });

  it('detects privacy manipulation when accept is more prominent', () => {
    const results = detect(snapshot({
      text: 'Accept all cookies',
      buttons: [
        { text: 'Accept all cookies', selector: '#accept', area: 400, color: 'blue' },
        { text: 'Manage settings', selector: '#manage', area: 100, color: 'gray' },
      ],
    }));
    expect(results.map(result => result.pattern)).toEqual(expect.arrayContaining(['Interface Interference', 'Privacy Manipulation']));
  });

  it('keeps the score capped at 100', () => {
    const results = detect(snapshot({
      text: 'Act now. Accept all cookies. Service fee applies.',
      buttons: [
        { text: 'Accept all cookies', selector: '#accept', area: 500, color: 'blue' },
        { text: "No, I don't want to save", selector: '#no', area: 100, color: 'gray' },
        { text: 'Manage settings', selector: '#manage', area: 100, color: 'gray' },
      ],
      checkboxes: [{ text: 'Optional newsletter', selector: '#newsletter', checked: true }],
      prices: ['$10', '$12'],
    }));
    expect(score(results)).toBeLessThanOrEqual(100);
  });
});
