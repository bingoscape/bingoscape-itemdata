import { ImageUrlOptions } from '../types';

const WIKI_IMAGE_BASE_URL = 'https://oldschool.runescape.wiki/images';
const DEFAULT_THUMB_WIDTH = 120;

/**
 * Constructs the image filename for an OSRS item
 * Handles special characters and # postfix removal
 *
 * @param itemName - The full item name (may include # postfix)
 * @param includeVariant - Not used, kept for backwards compatibility (default: false)
 * @returns The constructed filename (e.g., "Abyssal_bludgeon_detail.png")
 */
export function constructImageFilename(
  itemName: string,
  includeVariant: boolean = false
): string {
  let name = itemName.trim();

  // Handle # postfix - convert to (variant) format for URL generation
  // Example: "Holy scythe#Charged" -> "Holy scythe (Charged)"
  // Example: "Absorption#(1)" -> "Absorption (1)"
  if (name.includes('#')) {
    const [baseName, variant] = name.split('#');
    const trimmedBase = baseName.trim();
    const trimmedVariant = variant?.trim();

    if (trimmedVariant && includeVariant) {
      // Convert variant to lowercase for URL
      const lowerVariant = trimmedVariant.toLowerCase();
      // Add parentheses around variant (unless already has them)
      const hasParens = lowerVariant.startsWith('(') && lowerVariant.endsWith(')');
      name = hasParens
        ? `${trimmedBase} ${lowerVariant}`
        : `${trimmedBase} (${lowerVariant})`;
    } else {
      name = trimmedBase;
    }
  }

  // Replace spaces with underscores
  name = name.replace(/ /g, '_');

  // URL encode specific special characters
  // Don't use encodeURIComponent as it encodes too much (like underscores)
  // We only need to encode: apostrophes ('), parentheses (()), and a few others
  name = name
    .replace(/'/g, '%27')  // apostrophes
    .replace(/\(/g, '%28') // opening parenthesis
    .replace(/\)/g, '%29') // closing parenthesis
    .replace(/#/g, '%23')  // hash (shouldn't be here but just in case)
    .replace(/\+/g, '%2B') // plus signs (for poison variants like p++)
    .replace(/\?/g, '%3F') // question marks
    .replace(/&/g, '%26'); // ampersands

  // Add the detail suffix
  name = `${name}_detail.png`;

  return name;
}

/**
 * Constructs the base image filename without variant
 * This is now the same as constructImageFilename since we always remove variants
 *
 * @param itemName - The full item name (may include # postfix)
 * @returns The base filename without variant
 */
export function constructBaseImageFilename(itemName: string): string {
  return constructImageFilename(itemName);
}

/**
 * Constructs the full image URL for an OSRS item
 * Note: # postfix variants are automatically removed from URLs
 *
 * @param itemName - The item name (# postfix will be removed)
 * @param options - Options for URL construction
 * @returns The complete image URL
 */
export function getItemImageUrl(
  itemName: string,
  options: ImageUrlOptions = {}
): string {
  const {
    width = DEFAULT_THUMB_WIDTH,
    useThumb = true,
  } = options;

  const filename = constructImageFilename(itemName);

  if (useThumb) {
    // Construct thumbnail URL: /thumb/[filename]/[width]px-[filename]
    return `${WIKI_IMAGE_BASE_URL}/thumb/${filename}/${width}px-${filename}`;
  } else {
    // Construct full-size image URL: /[filename]
    return `${WIKI_IMAGE_BASE_URL}/${filename}`;
  }
}

/**
 * Gets the image URL for an item
 * Note: This function now returns the same URL since variants are always removed
 * Kept for backwards compatibility
 *
 * @param itemName - The item name
 * @param options - Options for URL construction
 * @returns Object with imageUrl (both fields return the same value)
 */
export function getItemImageUrls(
  itemName: string,
  options: ImageUrlOptions = {}
): { variantUrl: string; baseUrl: string } {
  const imageUrl = getItemImageUrl(itemName, options);

  return { variantUrl: imageUrl, baseUrl: imageUrl };
}

/**
 * Parses an item name to extract base name and variant
 *
 * @param itemName - The full item name
 * @returns Object with baseName and optional variant
 */
export function parseItemName(itemName: string): { baseName: string; variant?: string } {
  const trimmed = itemName.trim();

  if (trimmed.includes('#')) {
    const [baseName, variant] = trimmed.split('#');
    return {
      baseName: baseName.trim(),
      variant: variant?.trim(),
    };
  }

  return { baseName: trimmed };
}
