import { OsrsItem, ItemFilter, ImageUrlOptions } from './types';
import {
  getItemImageUrl,
  getItemImageUrls,
  parseItemName,
  constructImageFilename,
  constructBaseImageFilename,
} from './utils/imageUrl';

// Import the scraped data
// Note: This will be populated after running 'npm run scrape'
let itemsData: OsrsItem[] = [];

try {
  itemsData = require('./data/items.json');
} catch (error) {
  console.warn(
    'No item data found. Run "npm run scrape" to generate the items.json file.'
  );
}

/**
 * Get an item by its numeric ID
 *
 * @param id - The item ID to search for
 * @returns The matching item, or undefined if not found
 */
export function getItemById(id: number): OsrsItem | undefined {
  return itemsData.find((item) => {
    if (Array.isArray(item.id)) {
      return item.id.includes(id);
    }
    return item.id === id;
  });
}

/**
 * Get all items with a specific ID (handles cases where multiple variants share IDs)
 *
 * @param id - The item ID to search for
 * @returns Array of matching items
 */
export function getItemsById(id: number): OsrsItem[] {
  return itemsData.filter((item) => {
    if (Array.isArray(item.id)) {
      return item.id.includes(id);
    }
    return item.id === id;
  });
}

/**
 * Get an item by its exact name
 *
 * @param name - The exact item name (case-sensitive)
 * @returns The matching item, or undefined if not found
 */
export function getItemByName(name: string): OsrsItem | undefined {
  return itemsData.find((item) => item.name === name);
}

/**
 * Search for items by name (case-insensitive, partial match)
 *
 * @param query - The search query
 * @param limit - Maximum number of results to return (default: no limit)
 * @returns Array of matching items
 */
export function searchItemsByName(query: string, limit?: number): OsrsItem[] {
  const lowerQuery = query.toLowerCase();
  const results = itemsData.filter((item) =>
    item.name.toLowerCase().includes(lowerQuery)
  );

  if (limit && limit > 0) {
    return results.slice(0, limit);
  }

  return results;
}

/**
 * Get all items, optionally filtered
 *
 * @param filter - Optional filter criteria
 * @returns Array of items matching the filter
 */
export function getAllItems(filter?: ItemFilter): OsrsItem[] {
  let results = itemsData;

  if (filter) {
    if (filter.nameContains !== undefined) {
      const lowerQuery = filter.nameContains.toLowerCase();
      results = results.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    }

    if (filter.hasVariant !== undefined) {
      results = results.filter((item) =>
        filter.hasVariant ? item.variant !== undefined : item.variant === undefined
      );
    }

    if (filter.limit && filter.limit > 0) {
      results = results.slice(0, filter.limit);
    }
  }

  return results;
}

/**
 * Get the total count of items in the dataset
 *
 * @returns The total number of items
 */
export function getItemCount(): number {
  return itemsData.length;
}

/**
 * Get all unique base item names (without variants)
 *
 * @returns Array of unique base names
 */
export function getUniqueBaseNames(): string[] {
  const baseNames = new Set<string>();
  itemsData.forEach((item) => baseNames.add(item.baseName));
  return Array.from(baseNames).sort();
}

/**
 * Get all variants for a specific base item name
 *
 * @param baseName - The base item name
 * @returns Array of items with this base name
 */
export function getItemVariants(baseName: string): OsrsItem[] {
  return itemsData.filter((item) => item.baseName === baseName);
}

// Re-export types and utilities
export type { OsrsItem, ItemFilter, ImageUrlOptions };
export {
  getItemImageUrl,
  getItemImageUrls,
  parseItemName,
  constructImageFilename,
  constructBaseImageFilename,
};
