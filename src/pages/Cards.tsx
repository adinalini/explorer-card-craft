import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CardImage } from "@/components/CardImage"
import { CardVersionSelector, cardsWithHistory, getOldCardImage } from "@/components/CardVersionSelector"
import { WaveDivider } from "@/components/ui/wave-divider"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Download, Search } from "lucide-react"
import { cardDatabase } from "@/utils/cardData"
import { toast } from "@/hooks/use-toast"
import { SEOHead } from "@/components/SEOHead"

const Cards = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [costRange, setCostRange] = useState([0, 10])
  const [showUnits, setShowUnits] = useState(true)
  const [showLegendary, setShowLegendary] = useState(true)
  const [showSpells, setShowSpells] = useState(true)
  const [viewMode, setViewMode] = useState("5")
  // Track selected version for each card (cardId -> version)
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string | null>>({})

  // Filter cards based on search and filters
  const filteredCards = useMemo(() => {
    const databaseCards = cardDatabase.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCost = card.cost >= costRange[0] && card.cost <= costRange[1]
      
      // Card type filtering - must show at least one type
      const isUnit = !card.isSpell && !card.isLegendary
      const matchesType = (showUnits && isUnit) || 
                         (showLegendary && card.isLegendary) || 
                         (showSpells && card.isSpell)
      
      return matchesSearch && matchesCost && matchesType
    })


    return databaseCards.sort((a, b) => {
      // Sort by cost first, then by name
      if (a.cost !== b.cost) {
        return a.cost - b.cost
      }
      return a.name.localeCompare(b.name)
    })
  }, [searchQuery, costRange, showUnits, showLegendary, showSpells])

  const downloadCardImage = async (card: any, selectedVersion: string | null) => {
    try {
      let imageUrl: string
      let fileName = card.name.replace(/\s+/g, '_').toLowerCase()
      
      if (selectedVersion && selectedVersion !== "current") {
        // Use old version image
        const oldImage = getOldCardImage(card.id, selectedVersion)
        if (oldImage) {
          imageUrl = oldImage
          fileName = `${fileName}_${selectedVersion}`
        } else {
          throw new Error('Old version image not found')
        }
      } else {
        // Import the cardImages mapping from CardImage component
        const { cardImages } = await import('@/components/CardImage')
        imageUrl = cardImages[card.id]
      }
      
      if (!imageUrl) {
        throw new Error('Image not found for card: ' + card.id)
      }
      
      // Fetch the image as a blob to ensure it downloads properly
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      // Create a temporary link to download the image
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.png`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      URL.revokeObjectURL(url)
      
      toast({
        title: "Download Started",
        description: `Downloading ${card.name}${selectedVersion ? ` (${selectedVersion})` : ''} image...`,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download card image. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleVersionChange = (cardId: string, version: string | null) => {
    setSelectedVersions(prev => ({
      ...prev,
      [cardId]: version
    }))
  }

  const getGridCols = () => {
    switch (viewMode) {
      case "4": return "grid-cols-2 md:grid-cols-4"
      case "5": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      case "6": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      default: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
    }
  }

  return (
    <>
      <SEOHead 
        title="Card Explorer | Evolved"
        description="Browse and explore all cards in Evolved. Filter by cost, type, and search by name."
      />

      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between relative">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-foreground hover:bg-accent/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-foreground absolute left-1/2 -translate-x-1/2">Card Explorer</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-foreground">Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-muted-foreground/30"
                />
              </div>
            </div>

            {/* Cost Range */}
            <div className="space-y-2">
              <Label className="text-foreground">
                Cost Range: {costRange[0]} - {costRange[1]}
              </Label>
              <Slider
                value={costRange}
                onValueChange={setCostRange}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Card Type Toggles */}
            <div className="space-y-2">
              <Label className="text-foreground">Card Types</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={showUnits}
                    onChange={(e) => {
                      const newValue = e.target.checked
                      // Ensure at least one type is selected
                      if (!newValue && !showLegendary && !showSpells) return
                      setShowUnits(newValue)
                    }}
                    className="rounded border-border"
                  />
                  Show Units
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={showLegendary}
                    onChange={(e) => {
                      const newValue = e.target.checked
                      // Ensure at least one type is selected
                      if (!newValue && !showUnits && !showSpells) return
                      setShowLegendary(newValue)
                    }}
                    className="rounded border-border"
                  />
                  Show Legendary
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={showSpells}
                    onChange={(e) => {
                      const newValue = e.target.checked
                      // Ensure at least one type is selected
                      if (!newValue && !showUnits && !showLegendary) return
                      setShowSpells(newValue)
                    }}
                    className="rounded border-border"
                  />
                  Show Spells
                </label>
              </div>
            </div>

            {/* View Mode */}
            <div className="space-y-2">
              <Label className="text-foreground">Cards per Row</Label>
              <RadioGroup value={viewMode} onValueChange={setViewMode} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="view-4" />
                  <Label htmlFor="view-4" className="text-foreground">4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="view-5" />
                  <Label htmlFor="view-5" className="text-foreground">5</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6" id="view-6" />
                  <Label htmlFor="view-6" className="text-foreground">6</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCards.length} of {cardDatabase.length} cards
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {filteredCards.map((card: any) => {
            const selectedVersion = selectedVersions[card.id] || null
            const oldImage = selectedVersion ? getOldCardImage(card.id, selectedVersion) : null
            
            return (
              <div key={card.id} className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-200">
                <div className="aspect-[3/4] relative">
                  {oldImage ? (
                    <img src={oldImage} alt={`${card.name} (${selectedVersion})`} className="w-full h-full object-cover" />
                  ) : (
                    <CardImage cardId={card.id} cardName={card.name} className="w-full h-full object-cover" />
                  )}
                  {selectedVersion && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded">
                      {selectedVersion}
                    </div>
                  )}
                </div>
                
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="font-semibold text-sm text-foreground truncate flex-1">
                      {card.name}
                    </h3>
                    <CardVersionSelector
                      cardId={card.id}
                      selectedVersion={selectedVersion}
                      onVersionChange={(version) => handleVersionChange(card.id, version)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cost: {card.cost}</span>
                    <div className="flex gap-1">
                      {card.isLegendary && (
                        <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded text-[10px]">
                          Legendary
                        </span>
                      )}
                      {card.isSpell && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded text-[10px]">
                          Spell
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => downloadCardImage(card, selectedVersion)}
                    size="sm"
                    variant="outline"
                    className="w-full flex items-center gap-2 text-xs hover:bg-accent/20"
                  >
                    <Download className="w-3 h-3" />
                    Download Image
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No cards found matching your filters.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Wave Divider at bottom */}
      <WaveDivider />
    </>
  );
};

export default Cards
