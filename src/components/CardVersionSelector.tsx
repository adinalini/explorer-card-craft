import { useState, useRef, useEffect } from "react"
import { History } from "lucide-react"
import { getAllPatchesOrdered, CURRENT_PATCH } from "@/utils/patches"
import { patchCardStats, cardIdRenames } from "@/utils/cardStats"
import { getCardImageForPatch } from "@/components/CardImage"

// Build version options from the patch registry
const patchVersions = [
  ...getAllPatchesOrdered()
    .filter(p => p.id !== CURRENT_PATCH.id)
    .map(p => ({ patch: p.id, label: p.displayName })),
  { patch: "current", label: "Current" },
]

// Build a set of card IDs that have history (existed in older patches under same or different ID)
function buildCardsWithHistory(): string[] {
  const patches = getAllPatchesOrdered()
  const currentStats = patchCardStats[CURRENT_PATCH.id] || {}
  const currentIds = new Set(Object.keys(currentStats).filter(id => currentStats[id].status === 'active'))

  // Build reverse rename map: newId -> oldId for all patches
  const reverseRenames: Record<string, string> = {}
  for (const renames of Object.values(cardIdRenames)) {
    for (const [oldId, newId] of Object.entries(renames)) {
      reverseRenames[newId] = oldId
    }
  }

  const withHistory = new Set<string>()

  for (const cardId of currentIds) {
    // Check if card existed in any older patch (same ID or old ID)
    const oldId = reverseRenames[cardId]
    for (const patch of patches) {
      if (patch.id === CURRENT_PATCH.id) continue
      const stats = patchCardStats[patch.id] || {}
      if (stats[cardId]?.status === 'active' || (oldId && stats[oldId]?.status === 'active')) {
        withHistory.add(cardId)
        break
      }
    }
  }

  return Array.from(withHistory)
}

export const cardsWithHistory = buildCardsWithHistory()

interface CardVersionSelectorProps {
  cardId: string
  onVersionChange: (version: string | null) => void
  selectedVersion: string | null
}

export function CardVersionSelector({ cardId, onVersionChange, selectedVersion }: CardVersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const hasHistory = cardsWithHistory.includes(cardId)
  
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
          {patchVersions.map((version) => (
            <button
              key={version.patch}
              onClick={() => {
                onVersionChange(version.patch === "current" ? null : version.patch)
                setIsOpen(false)
              }}
              className={`w-full px-3 py-1.5 text-xs text-left hover:bg-accent/50 transition-colors flex items-center justify-between gap-2 ${
                (version.patch === "current" && !selectedVersion) || version.patch === selectedVersion
                  ? "bg-accent/30 text-primary font-medium"
                  : "text-foreground"
              }`}
            >
              <span>{version.label}</span>
              {((version.patch === "current" && !selectedVersion) || version.patch === selectedVersion) && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function getOldCardImage(cardId: string, version: string): string | null {
  return getCardImageForPatch(cardId, version) || null
}
