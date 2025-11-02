import {
  getItemById,
  getItemsById,
  getItemByName,
  searchItemsByName,
  getAllItems,
  getItemCount,
  getUniqueBaseNames,
  getItemVariants,
} from '../src/index';

describe('getItemById', () => {
  test('finds item by single ID', () => {
    const item = getItemById(13263); // Abyssal bludgeon
    expect(item).toBeDefined();
    expect(item?.name).toBe('Abyssal bludgeon');
    expect(item?.id).toBe(13263);
  });

  test('finds item by ID in array', () => {
    const item = getItemById(1706); // Should find an item with this ID
    expect(item).toBeDefined();
  });

  test('returns undefined for non-existent ID', () => {
    const item = getItemById(99999999);
    expect(item).toBeUndefined();
  });
});

describe('getItemsById', () => {
  test('returns items matching ID', () => {
    const items = getItemsById(13263);
    expect(items.length).toBeGreaterThan(0);
  });

  test('returns empty array for non-existent ID', () => {
    const items = getItemsById(99999999);
    expect(items).toHaveLength(0);
  });
});

describe('getItemByName', () => {
  test('finds item by exact name', () => {
    const item = getItemByName('Abyssal bludgeon');
    expect(item).toBeDefined();
    expect(item?.id).toBe(13263);
  });

  test('returns undefined for non-existent name', () => {
    const item = getItemByName('Non-existent item 123456');
    expect(item).toBeUndefined();
  });

  test('is case-sensitive', () => {
    const item = getItemByName('abyssal bludgeon');
    expect(item).toBeUndefined();
  });
});

describe('searchItemsByName', () => {
  test('finds items by partial name (case-insensitive)', () => {
    const items = searchItemsByName('dragon');
    expect(items.length).toBeGreaterThan(0);
    expect(items.every(item => item.name.toLowerCase().includes('dragon'))).toBe(true);
  });

  test('respects limit parameter', () => {
    const items = searchItemsByName('rune', 5);
    expect(items.length).toBeLessThanOrEqual(5);
  });

  test('returns empty array for no matches', () => {
    const items = searchItemsByName('nonexistentxyz123');
    expect(items).toHaveLength(0);
  });

  test('is case-insensitive', () => {
    const items = searchItemsByName('DRAGON');
    expect(items.length).toBeGreaterThan(0);
  });
});

describe('getAllItems', () => {
  test('returns all items without filter', () => {
    const items = getAllItems();
    expect(items.length).toBeGreaterThan(1000); // We have 16k+ items
  });

  test('filters by nameContains', () => {
    const items = getAllItems({ nameContains: 'dragon' });
    expect(items.length).toBeGreaterThan(0);
    expect(items.every(item => item.name.toLowerCase().includes('dragon'))).toBe(true);
  });

  test('filters by hasVariant=true', () => {
    const items = getAllItems({ hasVariant: true, limit: 10 });
    expect(items.every(item => item.variant !== undefined)).toBe(true);
  });

  test('filters by hasVariant=false', () => {
    const items = getAllItems({ hasVariant: false, limit: 10 });
    expect(items.every(item => item.variant === undefined)).toBe(true);
  });

  test('respects limit', () => {
    const items = getAllItems({ limit: 50 });
    expect(items).toHaveLength(50);
  });

  test('combines multiple filters', () => {
    const items = getAllItems({
      nameContains: 'dragon',
      hasVariant: false,
      limit: 5,
    });
    expect(items.length).toBeLessThanOrEqual(5);
    expect(items.every(item => item.variant === undefined)).toBe(true);
  });
});

describe('getItemCount', () => {
  test('returns correct item count', () => {
    const count = getItemCount();
    expect(count).toBeGreaterThan(16000); // We scraped 16,317 items
  });
});

describe('getUniqueBaseNames', () => {
  test('returns unique base names', () => {
    const baseNames = getUniqueBaseNames();
    const uniqueSet = new Set(baseNames);
    expect(baseNames.length).toBe(uniqueSet.size);
    expect(baseNames.length).toBeGreaterThan(0);
  });

  test('is sorted alphabetically', () => {
    const baseNames = getUniqueBaseNames();
    const sorted = [...baseNames].sort();
    expect(baseNames).toEqual(sorted);
  });
});

describe('getItemVariants', () => {
  test('returns all variants for a base name', () => {
    const variants = getItemVariants('Amulet of glory');
    expect(variants.length).toBeGreaterThan(1);
    expect(variants.every(item => item.baseName === 'Amulet of glory')).toBe(true);
  });

  test('returns empty array for non-existent base name', () => {
    const variants = getItemVariants('Non-existent item xyz123');
    expect(variants).toHaveLength(0);
  });

  test('returns single or more items for base names', () => {
    const variants = getItemVariants('Abyssal bludgeon');
    expect(variants.length).toBeGreaterThanOrEqual(1);
  });
});
