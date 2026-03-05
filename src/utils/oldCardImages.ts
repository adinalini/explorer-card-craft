/**
 * Old card images for version history and deck validation.
 * Uses import.meta.glob to load patch-specific images.
 */

const winterModules = import.meta.glob<{ default: string }>('/src/assets/cards/winter-2025/*.png', { eager: true })
const summerModules = import.meta.glob<{ default: string }>('/src/assets/cards/summer-2025/*.png', { eager: true })

function extractId(path: string): string {
  const filename = path.split('/').pop()?.replace('.png', '') || ''
  return filename.toLowerCase().replace(/\s+/g, '_').replace(/'/g, '')
}

function buildMap(modules: Record<string, { default: string }>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [path, mod] of Object.entries(modules)) {
    map[extractId(path)] = mod.default
  }
  return map
}

/** Winter 2025 card images */
export const winterCardImages = buildMap(winterModules)

/** Summer 2025 card images */
export const summerCardImages = buildMap(summerModules)

// Aliases for looking up old card IDs in old image maps
const oldIdAliases: Record<string, Record<string, string>> = {
  'winter-2025': {
    rain_of_arrows: 'rai_of_arrows',
    tuck: 'friar_tuck',
    jacks_giant: 'giant',
    goldi: 'goldilocks',
    robinhood: 'robin_hood',
  },
  'gdc-2026': {
    asanbosam: 'stryga',
    babe: 'babe_the_blue_ox',
    el_charro_negro: 'zorro',
    mind_palace: 'concentrate',
    sleeping_beauty: 'princess_aurora',
    stormalong: 'popeye',
    the_firebird: 'ali_baba',
    // Also look up current IDs directly in winter images
    rain_of_arrows: 'rai_of_arrows',
    robinhood: 'robin_hood',
  },
}

/**
 * Get the old card image for a specific card before a specific patch changed it.
 * Returns the image from the patch BEFORE the specified change patch.
 */
export function getOldCardImage(cardId: string, changePatch: string): string | undefined {
  const aliases = oldIdAliases[changePatch] || {}
  const lookupId = aliases[cardId] || cardId

  if (changePatch === 'gdc-2026') {
    return winterCardImages[lookupId] || winterCardImages[cardId]
  }
  if (changePatch === 'winter-2025') {
    return summerCardImages[lookupId] || summerCardImages[cardId]
  }
  return undefined
}

// Backward-compatible flat map (earliest old image per card)
export const oldCardImages: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(summerCardImages).map(([id, url]) => [id, url])
  ),
}
