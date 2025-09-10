import { describe, it, expect } from 'vitest';
import { renderContactInfo } from './service.js';

describe('renderContactInfo', () => {
  it('should render full contact info', () => {
    const item = {
      phone_e164: '+18005551212',
      email: 'test@example.com',
      website: 'example.com'
    };
    expect(renderContactInfo(item)).toMatchSnapshot();
  });

  it('should handle missing phone', () => {
    const item = {
      email: 'test@example.com',
      website: 'example.com'
    };
    expect(renderContactInfo(item)).toMatchSnapshot();
  });

  it('should handle missing email', () => {
    const item = {
      phone_e164: '+18005551212',
      website: 'example.com'
    };
    expect(renderContactInfo(item)).toMatchSnapshot();
  });

  it('should handle missing website', () => {
    const item = {
      phone_e164: '+18005551212',
      email: 'test@example.com'
    };
    expect(renderContactInfo(item)).toMatchSnapshot();
  });

  it('should handle all missing info', () => {
    const item = {};
    expect(renderContactInfo(item)).toMatchSnapshot();
  });

  it('should use contact_phone as a fallback for phone_e164', () => {
    const item = {
      contact_phone: '800-555-1212',
      email: 'test@example.com',
      website: 'example.com'
    };
    expect(renderContactInfo(item)).toMatchSnapshot();
  });
});
