import * as fs from 'fs';
import * as path from 'path';
import { load } from 'cheerio';
import fetch from 'node-fetch';
import { OsrsItem } from '../types';
import { getItemImageUrl, parseItemName } from '../utils/imageUrl';

const ITEM_IDS_URL = 'https://oldschool.runescape.wiki/w/Item_IDs';
const OUTPUT_PATH = path.join(__dirname, '../data/items.json');

/**
 * Parses item ID string which can be:
 * - Single ID: "1234"
 * - ID range: "1704-1712"
 * - Multiple IDs: "11976, 11978"
 * - Mix: "1704-1712, 11976, 11978"
 */
function parseItemIds(idString: string): number | number[] {
  const trimmed = idString.trim();

  // Check for comma-separated values
  if (trimmed.includes(',')) {
    const ids: number[] = [];
    const parts = trimmed.split(',');

    for (const part of parts) {
      const partTrimmed = part.trim();
      if (partTrimmed.includes('-')) {
        // Handle range within comma-separated list
        const [start, end] = partTrimmed.split('-').map((s) => parseInt(s.trim(), 10));
        for (let i = start; i <= end; i++) {
          ids.push(i);
        }
      } else {
        ids.push(parseInt(partTrimmed, 10));
      }
    }

    return ids;
  }

  // Check for range (e.g., "1704-1712")
  if (trimmed.includes('-')) {
    const [start, end] = trimmed.split('-').map((s) => parseInt(s.trim(), 10));
    const ids: number[] = [];
    for (let i = start; i <= end; i++) {
      ids.push(i);
    }
    return ids;
  }

  // Single ID
  return parseInt(trimmed, 10);
}

/**
 * Fetches and parses the Item_IDs wiki page
 */
async function scrapeItemIds(): Promise<OsrsItem[]> {
  console.log(`Fetching data from ${ITEM_IDS_URL}...`);

  const response = await fetch(ITEM_IDS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Item_IDs page: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = load(html);

  const items: OsrsItem[] = [];

  // Find the sortable table containing item data
  // The table has class "wikitable" and is sortable
  const table = $('table.wikitable.sortable').first();

  if (table.length === 0) {
    throw new Error('Could not find the item table on the page');
  }

  // Iterate through table rows (skip header row)
  table.find('tr').each((index, element) => {
    // Skip header row
    if (index === 0) return;

    const $row = $(element);
    const cells = $row.find('td');

    if (cells.length < 2) return;

    // First column: Item name (with link)
    const itemNameCell = $(cells[0]);
    const itemName = itemNameCell.text().trim();

    // Second column: Item ID(s)
    const itemIdCell = $(cells[1]);
    const itemIdString = itemIdCell.text().trim();

    if (!itemName || !itemIdString) return;

    try {
      const id = parseItemIds(itemIdString);
      const { baseName, variant } = parseItemName(itemName);
      const imageUrl = getItemImageUrl(itemName);

      const item: OsrsItem = {
        id,
        name: itemName,
        baseName,
        variant,
        imageUrl,
      };

      items.push(item);
    } catch (error) {
      console.warn(`Failed to parse item: ${itemName} (${itemIdString})`, error);
    }
  });

  console.log(`Scraped ${items.length} items`);
  return items;
}

/**
 * Main scraper function
 */
async function main() {
  try {
    console.log('Starting OSRS Item IDs scraper...');

    const items = await scrapeItemIds();

    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write items to JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items, null, 2), 'utf-8');

    console.log(`Successfully wrote ${items.length} items to ${OUTPUT_PATH}`);
    console.log('\nSample items:');
    console.log(JSON.stringify(items.slice(0, 3), null, 2));

  } catch (error) {
    console.error('Scraper failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { scrapeItemIds, parseItemIds };
