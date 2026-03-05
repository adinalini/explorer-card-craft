import { useState } from "react";

// Eagerly load all card images from each patch folder using import.meta.glob
const gdcModules = import.meta.glob<{ default: string }>('/src/assets/cards/gdc-2026/*.png', { eager: true })
const winterModules = import.meta.glob<{ default: string }>('/src/assets/cards/winter-2025/*.png', { eager: true })
const summerModules = import.meta.glob<{ default: string }>('/src/assets/cards/summer-2025/*.png', { eager: true })

/** Extract a normalized card ID from a file path */
function extractCardId(path: string): string {
  const filename = path.split('/').pop()?.replace('.png', '') || ''
  return filename.toLowerCase().replace(/\s+/g, '_').replace(/'/g, '')
}

/** Build a raw filename-keyed map from glob results */
function buildRawMap(modules: Record<string, { default: string }>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [path, mod] of Object.entries(modules)) {
    map[extractCardId(path)] = mod.default
  }
  return map
}

const rawGdc = buildRawMap(gdcModules)
const rawWinter = buildRawMap(winterModules)
const rawSummer = buildRawMap(summerModules)

// Filename (normalized) -> cardStats ID overrides
// These handle cases where the image filename doesn't match the card ID in cardStats
const filenameToCardId: Record<string, string> = {
  christopher_robin: 'christopher',
  hansel_and_gretel: 'hansel_gretel',
  robin_hood: 'robinhood',
  white_queen: 'the_white_queen',
  rai_of_arrows: 'rain_of_arrows',
}

/** Resolve a raw filename-keyed map to a cardId-keyed map */
function resolveMap(rawMap: Record<string, string>): Record<string, string> {
  const resolved: Record<string, string> = {}
  for (const [fileId, url] of Object.entries(rawMap)) {
    const cardId = filenameToCardId[fileId] || fileId
    resolved[cardId] = url
  }
  return resolved
}

// Resolved per-patch image maps (cardId -> imageUrl)
const resolvedGdc = resolveMap(rawGdc)
const resolvedWinter = resolveMap(rawWinter)
const resolvedSummer = resolveMap(rawSummer)

// Old ID -> current ID aliases for backward compatibility
const cardIdAliases: Record<string, string> = {
  // GDC 2026 renames
  stryga: 'asanbosam',
  babe_the_blue_ox: 'babe',
  zorro: 'el_charro_negro',
  concentrate: 'mind_palace',
  princess_aurora: 'sleeping_beauty',
  popeye: 'stormalong',
  ali_baba: 'the_firebird',
  // Winter 2025 renames
  friar_tuck: 'tuck',
  giant: 'jacks_giant',
  // Other aliases
  goldilocks: 'goldi',
  robin_hood: 'robinhood',
  rai_of_arrows: 'rain_of_arrows',
  redcap: 'red_cap',
}

// Reverse aliases: current ID -> old IDs for looking up old patch images
const reverseAliases: Record<string, string[]> = {}
for (const [oldId, newId] of Object.entries(cardIdAliases)) {
  if (!reverseAliases[newId]) reverseAliases[newId] = []
  reverseAliases[newId].push(oldId)
}

// Build the current (latest patch) card images map
// Priority: GDC 2026 > Winter 2025 > Summer 2025
const cardImages: Record<string, string> = { ...resolvedGdc }

// Fill in Winter 2025 images for cards not in GDC (removed/historical)
for (const [cardId, url] of Object.entries(resolvedWinter)) {
  if (!cardImages[cardId]) {
    cardImages[cardId] = url
  }
}

// Fill in Summer 2025 images for cards only in Summer
for (const [cardId, url] of Object.entries(resolvedSummer)) {
  if (!cardImages[cardId]) {
    cardImages[cardId] = url
  }
}

// Add aliases so old IDs always resolve to the latest canonical image
for (const [alias, canonical] of Object.entries(cardIdAliases)) {
  if (cardImages[canonical]) {
    cardImages[alias] = cardImages[canonical]
  }
}

/** Patch-indexed resolved maps */
const patchImageMaps: Record<string, Record<string, string>> = {
  'gdc-2026': resolvedGdc,
  'winter-2025': resolvedWinter,
  'summer-2025': resolvedSummer,
}

/**
 * Fallback chain per patch: which image folders to try in order.
 * summer-2025: summer → winter (no gdc!)
 * winter-2025: winter → summer
 * gdc-2026: gdc → winter → summer
 */
const patchFallbackChain: Record<string, string[]> = {
  'summer-2025': ['summer-2025', 'winter-2025'],
  'winter-2025': ['winter-2025', 'summer-2025'],
  'gdc-2026': ['gdc-2026', 'winter-2025', 'summer-2025'],
}

/** Try to find an image in a specific resolved map, handling aliases */
function lookupInMap(cardId: string, map: Record<string, string>): string | undefined {
  if (map[cardId]) return map[cardId]

  // Try reverse aliases (current ID -> old filename-based IDs)
  const oldIds = reverseAliases[cardId]
  if (oldIds) {
    for (const oldId of oldIds) {
      if (map[oldId]) return map[oldId]
    }
  }

  // Try forward alias (old ID -> current ID)
  const canonical = cardIdAliases[cardId]
  if (canonical && map[canonical]) return map[canonical]

  return undefined
}

/**
 * Get the image URL for a card at a specific patch.
 * Uses the patch fallback chain so summer-2025 never loads gdc-2026 images.
 */
export function getCardImageForPatch(cardId: string, patchId: string): string | undefined {
  const chain = patchFallbackChain[patchId]
  if (!chain) return cardImages[cardId]

  for (const fallbackPatch of chain) {
    const map = patchImageMaps[fallbackPatch]
    if (!map) continue
    const result = lookupInMap(cardId, map)
    if (result) return result
  }

  return undefined
}

interface CardImageProps {
  cardId: string;
  cardName: string;
  className?: string;
  onError?: () => void;
  patchId?: string; // optional: render image from specific patch
}

export function CardImage({ cardId, cardName, className, onError, patchId }: CardImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Cards are already filtered by patchCardStats, so an image should always exist.
  // Try patch-specific lookup first, then fall back to the global (latest) map.
  let resolvedId = cardId;
  if (!cardImages[resolvedId] && cardIdAliases[resolvedId]) {
    resolvedId = cardIdAliases[resolvedId];
  }

  const imageSrc = (patchId ? getCardImageForPatch(cardId, patchId) : undefined)
    || cardImages[resolvedId]
    || cardImages[cardId]
    || "/placeholder.svg";

  return (
    <img
      src={imageError ? "/placeholder.svg" : imageSrc}
      alt={cardName}
      className={className}
      onError={handleImageError}
      loading="eager"
      decoding="async"
    />
  );
}

export { cardImages };
