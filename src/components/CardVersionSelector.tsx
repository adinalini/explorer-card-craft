import { useState, useRef, useEffect } from "react"
import { History } from "lucide-react"
import { getAllPatchesOrdered } from "@/utils/patches"
import { patchCardStats, cardIdRenames } from "@/utils/cardStats"
import { getCardImageForPatch } from "@/components/CardImage"

// Build reverse rename map: newId -> oldId
const reverseRenames: Record<string, string> = {}
// Build forward rename map: oldId -> newId
const forwardRenames: Record<string, string> = {}
for (const renames of Object.values(cardIdRenames)) {
  for (const [oldId, newId] of Object.entries(renames)) {
    reverseRenames[newId] = oldId
    forwardRenames[oldId] = newId
  }
}

const allPatches = getAllPatchesOrdered()

/**
 * Check if a card existed in a given patch (by current ID or old renamed ID).
 */
function cardExistsInPatch(cardId: string, patchId: string): boolean {
  const stats = patchCardStats[patchId] || {}
  if (stats[cardId]?.status === 'active') return true
  const oldId = reverseRenames[cardId]
  if (oldId && stats[oldId]?.status === 'active') return true
  return false
}

/**
 * Get all identity chain IDs for a card (past and future names).
 * E.g., ali_baba -> the_firebird, or the_firebird -> ali_baba
 */
function getCardIdentityChain(cardId: string): string[] {
  const ids = new Set<string>()
  // Walk backwards
  let current = cardId
  while (current) {
    ids.add(current)
    const prev = reverseRenames[current]
    if (prev && !ids.has(prev)) {
      current = prev
    } else break
  }
  // Walk forwards
  current = cardId
  while (current) {
    ids.add(current)
    const next = forwardRenames[current]
    if (next && !ids.has(next)) {
      current = next
    } else break
  }
  return Array.from(ids)
}

/**
 * Get the list of patches where the card's art actually changed.
 * Includes both past and future versions (renamed cards).
 */
function getCardPatches(cardId: string): { patch: string; label: string }[] {
  const identityChain = getCardIdentityChain(cardId)
  const result: { patch: string; label: string }[] = []
  let lastImageUrl: string | undefined = undefined

  for (const p of allPatches) {
    // Check if any identity in chain exists in this patch
    const existsInPatch = identityChain.some(id => {
      const stats = patchCardStats[p.id] || {}
      return stats[id]?.status === 'active'
    })
    if (!existsInPatch) continue

    // Find which ID to use for image lookup
    const activeId = identityChain.find(id => {
      const stats = patchCardStats[p.id] || {}
      return stats[id]?.status === 'active'
    })
    if (!activeId) continue

    const imageUrl = getCardImageForPatch(activeId, p.id)
    
    if (imageUrl !== lastImageUrl) {
      result.push({ patch: p.id, label: p.displayName })
      lastImageUrl = imageUrl
    }
  }
  return result
}

interface CardVersionSelectorProps {
  cardId: string
  onVersionChange: (version: string | null) => void
  selectedVersion: string | null
  /** The current global patch selected on the page */
  globalPatch?: string
}

export function CardVersionSelector({ cardId, onVersionChange, selectedVersion, globalPatch }: CardVersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const cardPatches = getCardPatches(cardId)
  // Has history if card exists in more than one patch
  const hasHistory = cardPatches.length > 1
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!hasHistory) {
    return (
      <button
        disabled
        className="p-1 rounded opacity-30 cursor-not-allowed"
        title="No previous versions available"
      >
        <History className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    )
  }

  // The "base" patch is the global patch or current patch context
  const basePatch = globalPatch || cardPatches[cardPatches.length - 1]?.patch
  // Effective selected patch
  const effectivePatch = selectedVersion || basePatch

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-accent/30 transition-colors"
        title="Browse previous versions"
      >
        <History className="w-3.5 h-3.5 text-primary" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-1 z-50 bg-popover border border-border rounded-md shadow-lg overflow-hidden min-w-[100px]">
          {cardPatches.map((version) => {
            const isSelected = version.patch === effectivePatch
            return (
              <button
                key={version.patch}
                onClick={() => {
                  // If selecting the global patch, reset to null (default)
                  onVersionChange(version.patch === basePatch ? null : version.patch)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent/50 transition-colors flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-accent/30 text-primary font-medium"
                    : "text-foreground"
                }`}
              >
                <span>{version.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function getOldCardImage(cardId: string, version: string): string | null {
  return getCardImageForPatch(cardId, version) || null
}
