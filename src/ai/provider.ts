import type { Detection, PageSnapshot } from '../shared/types';
export interface AIProvider { analyzePage(snapshot: PageSnapshot): Promise<Detection[]>; }
export class DisabledAIProvider implements AIProvider { async analyzePage(_snapshot: PageSnapshot) { return []; } }
