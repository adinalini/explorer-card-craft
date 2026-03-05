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

/** Build a cardId -> imageUrl map from glob results */
function buildImageMap(modules: Record<string, { default: string }>): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [path, mod] of Object.entries(modules)) {
    map[extractCardId(path)] = mod.default
  }
  return map
}

export const gdcImages = buildImageMap(gdcModules)
export const winterImages = buildImageMap(winterModules)
export const summerImages = buildImageMap(summerModules)

// Filename-to-cardId overrides (when derived filename doesn't match card ID)
const filenameOverrides: Record<string, string> = {
  christopher_robin: 'christopher',
  hansel_and_gretel: 'hansel_gretel',
  robin_hood: 'robinhood',
  white_queen: 'the_white_queen',
}

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

// Winter filename overrides
const winterFilenameOverrides: Record<string, string> = {
  rai_of_arrows: 'rain_of_arrows',
}

// Build the current card images map
// Priority: GDC 2026 > Winter 2025 > Summer 2025
const cardImages: Record<string, string> = {}

// Apply GDC images with filename overrides
for (const [fileId, url] of Object.entries(gdcImages)) {
  const cardId = filenameOverrides[fileId] || fileId
  cardImages[cardId] = url
}

// Fill in Winter 2025 images for cards not in GDC (removed/historical)
for (const [fileId, url] of Object.entries(winterImages)) {
  const cardId = winterFilenameOverrides[fileId] || fileId
  if (!cardImages[cardId]) {
    cardImages[cardId] = url
  }
}

// Fill in Summer 2025 images for cards only in Summer
for (const [fileId, url] of Object.entries(summerImages)) {
  if (!cardImages[fileId]) {
    cardImages[fileId] = url
  }
}

// Add aliases so old IDs resolve to current images
for (const [alias, canonical] of Object.entries(cardIdAliases)) {
  if (cardImages[canonical] && !cardImages[alias]) {
    cardImages[alias] = cardImages[canonical]
  }
}

interface CardImageProps {
  cardId: string;
  cardName: string;
  className?: string;
  onError?: () => void;
}

export function CardImage({ cardId, cardName, className, onError }: CardImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Resolve card ID through aliases
  let resolvedId = cardId;
  if (!cardImages[resolvedId] && cardIdAliases[resolvedId]) {
    resolvedId = cardIdAliases[resolvedId];
  }

  const imageSrc = cardImages[resolvedId] || "/placeholder.svg";

  return (
    <img
      src={imageError ? "/placeholder.svg" : imageSrc}
      alt={cardName}
      className={className}
      onError={handleImageError}
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  );
}

export { cardImages };
