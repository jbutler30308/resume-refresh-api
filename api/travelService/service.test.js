import { describe, it, expect } from 'vitest';
import { parseResponse } from './service.js';
import jsonResponse from './__fixtures__/response.01.json';


describe('Travel Service', () => {

  describe('parseResponse (complex)', () => {
    it('should generate a snapshot of the HTML output', () => {
      const html = parseResponse(jsonResponse);
      expect(html).toMatchSnapshot();
    });
  });
});

