import type { JSX as ReactJSX } from 'react';

declare module '*.css';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}

export {};
