import { describe, expect, it } from 'vitest';
import { requireSecureClient } from '../../utils/requireSecureClient.js';

describe('requireSecureClient', () => {
  it('throws when secure client is missing', () => {
    expect(() => requireSecureClient(undefined)).toThrow(
      'Secure client is required',
    );
  });
});
