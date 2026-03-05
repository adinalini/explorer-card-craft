/**
 * Centralized Patch Registry
 * All patch definitions, ordering, and display names are managed here.
 */

export interface PatchDefinition {
  id: string           // internal key: 'summer-2025', 'winter-2025', 'gdc-2026'
  order: number        // sequential ordering (higher = newer)
  displayName: string  // human-readable: 'Summer 2025', 'Winter 2025', 'GDC 2026'
  legacyId?: string    // old version string for backward compat
  releaseDate?: string // optional release date
}

/**
 * All patches in order. Add new patches at the end with incrementing order.
 */
export const PATCHES: PatchDefinition[] = [
  {
    id: 'summer-2025',
    order: 1,
    displayName: 'Summer 2025',
    legacyId: 'v1.0.0.40',
  },
  {
    id: 'winter-2025',
    order: 2,
    displayName: 'Winter 2025',
    legacyId: 'v1.0.0.41',
  },
  {
    id: 'gdc-2026',
    order: 3,
    displayName: 'GDC 2026',
  },
]

/** The current/latest patch */
export const LATEST_PATCH = PATCHES[PATCHES.length - 1]

/** Get the latest patch that has cards (i.e., is released / has data) */
export const CURRENT_PATCH = PATCHES.find(p => p.id === 'gdc-2026')!

/** Get a patch by its ID */
export function getPatchById(id: string): PatchDefinition | undefined {
  return PATCHES.find(p => p.id === id)
}

/** Get a patch by its legacy ID (e.g., 'v1.0.0.40') */
export function getPatchByLegacyId(legacyId: string): PatchDefinition | undefined {
  return PATCHES.find(p => p.legacyId === legacyId)
}

/** Resolve any patch identifier (new or legacy) to a PatchDefinition */
export function resolvePatch(idOrLegacy: string): PatchDefinition | undefined {
  // Strip " (latest)" suffix from old format
  const cleaned = idOrLegacy.replace(/\s*\(latest\)\s*$/, '')
  return getPatchById(cleaned) || getPatchByLegacyId(cleaned)
}

/** Get the display name for any patch identifier */
export function getPatchDisplayName(idOrLegacy: string): string {
  const patch = resolvePatch(idOrLegacy)
  return patch?.displayName || idOrLegacy
}

/** Compare two patch IDs. Returns positive if a is newer than b */
export function comparePatchOrder(aId: string, bId: string): number {
  const a = resolvePatch(aId)
  const b = resolvePatch(bId)
  if (!a || !b) return 0
  return a.order - b.order
}

/** Check if patchA is newer than patchB */
export function isPatchNewer(aId: string, bId: string): boolean {
  return comparePatchOrder(aId, bId) > 0
}

/** Get all patches from oldest to newest */
export function getAllPatchesOrdered(): PatchDefinition[] {
  return [...PATCHES].sort((a, b) => a.order - b.order)
}

/** Get all patches that came after a given patch */
export function getPatchesAfter(patchId: string): PatchDefinition[] {
  const patch = resolvePatch(patchId)
  if (!patch) return []
  return PATCHES.filter(p => p.order > patch.order).sort((a, b) => a.order - b.order)
}

/** Check if a patch is the latest/current */
export function isLatestPatch(patchId: string): boolean {
  const patch = resolvePatch(patchId)
  return patch?.id === CURRENT_PATCH.id
}
