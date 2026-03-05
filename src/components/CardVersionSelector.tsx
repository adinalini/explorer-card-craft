import { useState, useRef, useEffect } from "react"
import { History } from "lucide-react"
import { getAllPatchesOrdered } from "@/utils/patches"
import { patchCardStats, cardIdRenames } from "@/utils/cardStats"
import { getCardImageForPatch } from "@/components/CardImage"

// Build reverse rename map: newId -> oldId
const reverseRenames: Record<string, string> = {}
for (const renames of Object.values(cardIdRenames)) {
  for (const [oldId, newId] of Object.entries(renames)) {
    reverseRenames[newId] = oldId
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
 * Get the list of patches a card has versions in (for its version dropdown).
 * Always includes patches where the card existed, regardless of current global patch.
 */
function getCardPatches(cardId: string): { patch: string; label: string }[] {
  const result: { patch: string; label: string }[] = []
  for (const p of allPatches) {
    if (cardExistsInPatch(cardId, p.id)) {
      result.push({ patch: p.id, label: p.displayName })
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
