import { describe, it, expect } from 'vitest';
import { parseResponse, extractFencedJson, safeJsonParse } from './service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sampleLogData = fs.readFileSync(path.join(__dirname, '__fixtures__', 'sampleLog.txt'), 'utf-8');

describe('Travel Service', () => {
  describe('extractFencedJson', () => {
    it('should extract JSON from markdown', () => {
      const { jsonText, md } = extractFencedJson(sampleLogData);
      expect(jsonText).not.toBeNull();
      expect(md).not.toContain('```json');
    });

    it('should return null for jsonText if no JSON is present', () => {
      const { jsonText, md } = extractFencedJson('Just some markdown');
      expect(jsonText).toBeNull();
      expect(md).toBe('Just some markdown');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      const { data, error } = safeJsonParse('{"key": "value"}');
      expect(data).toEqual({ key: 'value' });
      expect(error).toBeNull();
    });

    it('should handle trailing commas', () => {
      const { data, error } = safeJsonParse('{"key": "value",}');
      expect(data).toEqual({ key: 'value' });
      expect(error).toBeNull();
    });

    it('should return an error for invalid JSON', () => {
      const { data, error } = safeJsonParse('{"key": "value}');
      expect(data).toBeNull();
      expect(error).not.toBeNull();
    });
  });

  describe('parseResponse', () => {
    it('should generate a snapshot of the HTML output', () => {
      const html = parseResponse(sampleLogData);
      expect(html).toMatchSnapshot();
    });
  });
});