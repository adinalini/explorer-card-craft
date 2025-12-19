import { useState, useRef, useEffect } from "react"
import { History } from "lucide-react"
import { oldCardImages } from "@/utils/oldCardImages"

// Define which patches exist and which cards have changes in them
const patchVersions = [
  { patch: "v1.0.0.40", label: "v1.0.0.40" },
  { patch: "current", label: "Current" },
]

// Cards that have old versions available
export const cardsWithHistory = Object.keys(oldCardImages)

interface CardVersionSelectorProps {
  cardId: string
  onVersionChange: (version: string | null) => void
  selectedVersion: string | null
}

export function CardVersionSelector({ cardId, onVersionChange, selectedVersion }: CardVersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  const hasHistory = cardsWithHistory.includes(cardId)
  
  // Close menu when clicking outside
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
          {patchVersions.map((version, index) => (
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
  if (version === "v1.0.0.40") {
    return oldCardImages[cardId] || null
  }
  return null
}
