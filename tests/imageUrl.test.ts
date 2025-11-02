import {
  constructImageFilename,
  constructBaseImageFilename,
  getItemImageUrl,
  getItemImageUrls,
  parseItemName,
} from '../src/utils/imageUrl';

describe('parseItemName', () => {
  test('parses item name without variant', () => {
    const result = parseItemName('Abyssal bludgeon');
    expect(result).toEqual({
      baseName: 'Abyssal bludgeon',
      variant: undefined,
    });
  });

  test('parses item name with variant', () => {
    const result = parseItemName('Amulet of glory#1');
    expect(result).toEqual({
      baseName: 'Amulet of glory',
      variant: '1',
    });
  });

  test('parses item name with complex variant', () => {
    const result = parseItemName('Corrupted scythe of vitur#Charged');
    expect(result).toEqual({
      baseName: 'Corrupted scythe of vitur',
      variant: 'Charged',
    });
  });

  test('handles item with poison variant', () => {
    const result = parseItemName('Abyssal dagger#(p)');
    expect(result).toEqual({
      baseName: 'Abyssal dagger',
      variant: '(p)',
    });
  });
});

describe('constructImageFilename', () => {
  test('constructs filename for simple item', () => {
    const filename = constructImageFilename('Abyssal bludgeon');
    expect(filename).toBe('Abyssal_bludgeon_detail.png');
  });

  test('converts # postfix to parentheses format', () => {
    const filename = constructImageFilename('Amulet of glory#1');
    expect(filename).toBe('Amulet_of_glory_%281%29_detail.png');
  });

  test('handles item with apostrophes', () => {
    const filename = constructImageFilename("'24-carat' sword");
    expect(filename).toBe('%2724-carat%27_sword_detail.png');
  });

  test('converts poison variant postfix to lowercase with encoded parentheses', () => {
    const filename = constructImageFilename('Abyssal dagger#(p)');
    expect(filename).toBe('Abyssal_dagger_%28p%29_detail.png');
  });

  test('handles Corrupted scythe of vitur with Charged variant as lowercase in parentheses', () => {
    const filename = constructImageFilename('Corrupted scythe of vitur#Charged');
    expect(filename).toBe('Corrupted_scythe_of_vitur_%28charged%29_detail.png');
  });

  test('handles Ahrim hood with damage state in parentheses', () => {
    const filename = constructImageFilename("Ahrim's hood#100");
    expect(filename).toBe('Ahrim%27s_hood_%28100%29_detail.png');
  });

  test('handles Admiral pie with Full state in lowercase parentheses', () => {
    const filename = constructImageFilename('Admiral pie#Full');
    expect(filename).toBe('Admiral_pie_%28full%29_detail.png');
  });

  test('handles item with plus signs in poison variant', () => {
    const filename = constructImageFilename('Adamant arrow#(p++)');
    expect(filename).toBe('Adamant_arrow_%28p%2B%2B%29_detail.png');
  });
});

describe('constructBaseImageFilename', () => {
  test('constructs base filename (same as regular since variants are removed)', () => {
    const filename = constructBaseImageFilename('Amulet of glory#1');
    expect(filename).toBe('Amulet_of_glory_%281%29_detail.png');
  });
});

describe('getItemImageUrl', () => {
  test('constructs thumbnail URL by default', () => {
    const url = getItemImageUrl('Abyssal bludgeon');
    expect(url).toBe(
      'https://oldschool.runescape.wiki/images/thumb/Abyssal_bludgeon_detail.png/120px-Abyssal_bludgeon_detail.png'
    );
  });

  test('constructs thumbnail URL with custom width', () => {
    const url = getItemImageUrl('Abyssal bludgeon', { width: 96 });
    expect(url).toBe(
      'https://oldschool.runescape.wiki/images/thumb/Abyssal_bludgeon_detail.png/96px-Abyssal_bludgeon_detail.png'
    );
  });

  test('constructs full-size image URL', () => {
    const url = getItemImageUrl('Abyssal bludgeon', { useThumb: false });
    expect(url).toBe(
      'https://oldschool.runescape.wiki/images/Abyssal_bludgeon_detail.png'
    );
  });

  test('removes variant from URL', () => {
    const url = getItemImageUrl('Amulet of glory#1');
    expect(url).toBe(
      'https://oldschool.runescape.wiki/images/thumb/Amulet_of_glory_%281%29_detail.png/120px-Amulet_of_glory_%281%29_detail.png'
    );
  });

  test('removes charged variant from Corrupted scythe', () => {
    const url = getItemImageUrl('Corrupted scythe of vitur#Charged');
    expect(url).toBe(
      'https://oldschool.runescape.wiki/images/thumb/Corrupted_scythe_of_vitur_%28charged%29_detail.png/120px-Corrupted_scythe_of_vitur_%28charged%29_detail.png'
    );
  });
});

describe('getItemImageUrls', () => {
  test('returns same URL for both variant and base (since variants are removed)', () => {
    const urls = getItemImageUrls('Amulet of glory#1');
    const expectedUrl = 'https://oldschool.runescape.wiki/images/thumb/Amulet_of_glory_%281%29_detail.png/120px-Amulet_of_glory_%281%29_detail.png';
    expect(urls.variantUrl).toBe(expectedUrl);
    expect(urls.baseUrl).toBe(expectedUrl);
  });

  test('returns same URL for items without variants', () => {
    const urls = getItemImageUrls('Abyssal bludgeon');
    expect(urls.variantUrl).toBe(urls.baseUrl);
  });
});
