import { parseItemIds } from '../src/scraper/scrape';

describe('parseItemIds', () => {
  test('parses single ID', () => {
    const result = parseItemIds('13263');
    expect(result).toBe(13263);
  });

  test('parses ID range', () => {
    const result = parseItemIds('1704-1712');
    expect(result).toEqual([1704, 1705, 1706, 1707, 1708, 1709, 1710, 1711, 1712]);
  });

  test('parses comma-separated IDs', () => {
    const result = parseItemIds('11976, 11978');
    expect(result).toEqual([11976, 11978]);
  });

  test('parses mixed range and comma-separated IDs', () => {
    const result = parseItemIds('1704-1706, 11976, 11978');
    expect(result).toEqual([1704, 1705, 1706, 11976, 11978]);
  });

  test('handles whitespace in ID string', () => {
    const result = parseItemIds('  1704 - 1706  ');
    expect(result).toEqual([1704, 1705, 1706]);
  });

  test('handles complex mixed format', () => {
    const result = parseItemIds('100-102, 200, 300-301');
    expect(result).toEqual([100, 101, 102, 200, 300, 301]);
  });
});
