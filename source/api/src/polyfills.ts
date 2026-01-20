import { randomUUID } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = { randomUUID };
}
