# OSRS Item Data

A TypeScript package for parsing Old School RuneScape item IDs, names, and icon images from the OSRS Wiki.

## Features

- **16,000+ OSRS Items**: Pre-scraped data from the OSRS Wiki
- **Image URL Generation**: Automatically construct image URLs for any item
- **TypeScript Support**: Full type definitions included
- **Flexible API**: Search by ID, name, or filter items
- **Variant Handling**: Properly handles item variants (e.g., charged, broken, poisoned)
- **Zero Dependencies**: No runtime dependencies (scraper uses cheerio for build-time only)

## Installation

```bash
npm install osrs-item-data
```

## Quick Start

```typescript
import { getItemById, searchItemsByName, getItemImageUrl } from 'osrs-item-data';

// Get item by ID
const item = getItemById(13263);
console.log(item);
// {
//   id: 13263,
//   name: 'Abyssal bludgeon',
//   baseName: 'Abyssal bludgeon',
//   imageUrl: 'https://oldschool.runescape.wiki/images/thumb/Abyssal_bludgeon_detail.png/120px-Abyssal_bludgeon_detail.png'
// }

// Search items by name
const items = searchItemsByName('dragon');
console.log(items.length); // All items with "dragon" in the name

// Get image URL for any item
const imageUrl = getItemImageUrl('Abyssal whip');
console.log(imageUrl);
// 'https://oldschool.runescape.wiki/images/thumb/Abyssal_whip_detail.png/120px-Abyssal_whip_detail.png'
```

## API Reference

### Item Lookup Functions

#### `getItemById(id: number): OsrsItem | undefined`

Retrieve an item by its numeric ID.

```typescript
const item = getItemById(4151); // Dragon warhammer
```

#### `getItemsById(id: number): OsrsItem[]`

Get all items matching a specific ID (handles cases where multiple variants share IDs).

```typescript
const items = getItemsById(1704); // All items with ID 1704
```

#### `getItemByName(name: string): OsrsItem | undefined`

Get an item by its exact name (case-sensitive).

```typescript
const item = getItemByName('Twisted bow');
```

#### `searchItemsByName(query: string, limit?: number): OsrsItem[]`

Search for items by name (case-insensitive, partial match).

```typescript
const items = searchItemsByName('godsword', 5); // First 5 items matching "godsword"
```

#### `getAllItems(filter?: ItemFilter): OsrsItem[]`

Get all items, optionally filtered.

```typescript
// Get all items
const allItems = getAllItems();

// Get items with variants only
const variantItems = getAllItems({ hasVariant: true });

// Get first 100 items containing "rune"
const runeItems = getAllItems({
  nameContains: 'rune',
  limit: 100
});
```

### Utility Functions

#### `getItemImageUrl(itemName: string, options?: ImageUrlOptions): string`

Construct an image URL for any item name.

```typescript
// Default: 120px thumbnail with variant
const url = getItemImageUrl('Amulet of glory#4');

// Custom width
const url = getItemImageUrl('Dragon scimitar', { width: 96 });

// Full-size image
const url = getItemImageUrl('Dragon scimitar', { useThumb: false });

// Exclude variant from URL
const url = getItemImageUrl('Amulet of glory#4', { includeVariant: false });
```

#### `getItemImageUrls(itemName: string, options?: ImageUrlOptions)`

Get both variant and base image URLs (useful for fallback).

```typescript
const { variantUrl, baseUrl } = getItemImageUrls('Amulet of glory#4');
// variantUrl: URL with (4) in filename
// baseUrl: URL without variant
```

#### `parseItemName(itemName: string)`

Parse an item name into base name and variant.

```typescript
const { baseName, variant } = parseItemName('Corrupted scythe of vitur#Charged');
// baseName: 'Corrupted scythe of vitur'
// variant: 'Charged'
```

### Aggregate Functions

#### `getItemCount(): number`

Get the total number of items in the dataset.

#### `getUniqueBaseNames(): string[]`

Get all unique base item names (without variants).

#### `getItemVariants(baseName: string): OsrsItem[]`

Get all variants for a specific base item name.

```typescript
const variants = getItemVariants('Amulet of glory');
// Returns all glory variants: base, #1, #2, #3, #4, #5, #6
```

## TypeScript Types

```typescript
interface OsrsItem {
  id: number | number[];  // Single ID or array for items with ID ranges
  name: string;           // Full name including variant (e.g., "Amulet of glory#4")
  baseName: string;       // Name without variant (e.g., "Amulet of glory")
  variant?: string;       // Variant identifier (e.g., "4", "Charged", "(p)")
  imageUrl: string;       // Pre-constructed image URL
}

interface ImageUrlOptions {
  width?: number;         // Thumbnail width in pixels (default: 120)
  useThumb?: boolean;     // Use thumbnail vs full-size (default: true)
  includeVariant?: boolean; // Include variant in filename (default: true)
}

interface ItemFilter {
  nameContains?: string;  // Filter by name substring (case-insensitive)
  hasVariant?: boolean;   // Filter items with/without variants
  limit?: number;         // Limit number of results
}
```

## Understanding Item Variants

OSRS items often have variants denoted by a `#` symbol:

- **Charge levels**: `Amulet of glory#1` through `#6`
- **Damage states**: `Ahrim's hood#100`, `#75`, `#50`, `#25`, `#broken`
- **Status effects**: `Abyssal dagger#(p)`, `Adamant arrow#(p++)`
- **Item states**: `Corrupted scythe of vitur#Charged`

The package handles these automatically:
- The `#` postfix is removed when constructing image URLs
- Variants are converted to parentheses format: `item#variant` → `item(variant)_detail.png`
- You can choose to include or exclude variants in image URLs

## Updating Item Data

The package includes a scraper script to update item data:

```bash
npm run scrape
```

This fetches the latest data from the OSRS Wiki and updates `src/data/items.json`.

**Note**: You only need to run this if you're contributing to the package or want to update to the latest wiki data.

## Publishing to NPM

This package is configured to publish automatically via GitHub Actions:

1. Create a release on GitHub
2. The workflow will automatically:
   - Run tests
   - Build the package
   - Publish to NPM

**Setup required**:
- Add `NPM_TOKEN` to your repository secrets
- Get your NPM token from https://www.npmjs.com/settings/[username]/tokens

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build

# Scrape latest data
npm run scrape
```

## How It Works

1. **Scraping**: The scraper fetches the [Item_IDs wiki page](https://oldschool.runescape.wiki/w/Item_IDs) and parses the item table
2. **Image URLs**: Image URLs are constructed using the [wiki's image naming convention](https://oldschool.runescape.wiki/w/Category:Detailed_item_images)
3. **Special Characters**: Apostrophes, parentheses, and other special characters are properly URL-encoded
4. **Variants**: Item variants (denoted by `#`) are handled by converting them to parentheses format

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run `npm test` to ensure all tests pass
5. Submit a pull request

## License

MIT

## Data Source

All item data is sourced from the [Old School RuneScape Wiki](https://oldschool.runescape.wiki/), which is licensed under CC BY-NC-SA 3.0.

## Disclaimer

This package is not affiliated with or endorsed by Jagex Ltd. Old School RuneScape is a registered trademark of Jagex Ltd.
