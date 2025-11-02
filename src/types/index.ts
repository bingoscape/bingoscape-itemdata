/**
 * Represents an OSRS item with its ID, name, and image URL
 */
export interface OsrsItem {
  /**
   * The unique item ID(s). Can be a single number or array for items with multiple IDs
   */
  id: number | number[];

  /**
   * The full item name as it appears on the wiki (may include # postfix for variants)
   */
  name: string;

  /**
   * The base item name without any # postfix
   */
  baseName: string;

  /**
   * The variant identifier (the part after #), if applicable
   */
  variant?: string;

  /**
   * The constructed URL to the item's detail image
   */
  imageUrl: string;
}

/**
 * Options for customizing image URL generation
 */
export interface ImageUrlOptions {
  /**
   * The width of the thumbnail in pixels (default: 120)
   */
  width?: number;

  /**
   * Whether to use thumbnail URL or full-size image URL (default: true)
   */
  useThumb?: boolean;
}

/**
 * Filter options for querying items
 */
export interface ItemFilter {
  /**
   * Filter items whose name includes this string (case-insensitive)
   */
  nameContains?: string;

  /**
   * Filter items that have a variant (# postfix)
   */
  hasVariant?: boolean;

  /**
   * Limit the number of results
   */
  limit?: number;
}
