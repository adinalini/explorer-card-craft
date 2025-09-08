import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CardImage } from "@/components/CardImage"
import { WaveDivider } from "@/components/ui/wave-divider"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Download, Search } from "lucide-react"
import { cardDatabase } from "@/utils/cardData"
import { toast } from "@/hooks/use-toast"

const Cards = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [costRange, setCostRange] = useState([0, 10])
  const [showUnits, setShowUnits] = useState(true)
  const [showLegendary, setShowLegendary] = useState(true)
  const [showSpells, setShowSpells] = useState(true)
  const [viewMode, setViewMode] = useState("5")

  // Filter cards based on search and filters
  const filteredCards = useMemo(() => {
    return cardDatabase.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCost = card.cost >= costRange[0] && card.cost <= costRange[1]
      
      // Card type filtering - must show at least one type
      const isUnit = !card.isSpell && !card.isLegendary
      const matchesType = (showUnits && isUnit) || 
                         (showLegendary && card.isLegendary) || 
                         (showSpells && card.isSpell)
      
      return matchesSearch && matchesCost && matchesType
    }).sort((a, b) => {
      // Sort by cost first, then by name
      if (a.cost !== b.cost) {
        return a.cost - b.cost
      }
      return a.name.localeCompare(b.name)
    })
  }, [searchQuery, costRange, showUnits, showLegendary, showSpells])

  const downloadCardImage = async (card: any) => {
    try {
      // Get the image URL from the dynamic import
      const imageModule = await card.image()
      const imageUrl = imageModule.default || imageModule
      
      // Create a temporary link to download the image
      const link = document.createElement('a')
      link.href = imageUrl
      link.download = `${card.name.replace(/\s+/g, '_').toLowerCase()}.png`
      link.target = '_blank' // Open in new tab to avoid navigation issues
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Download Started",
        description: `Downloading ${card.name} image...`,
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

  const getGridCols = () => {
    switch (viewMode) {
      case "4": return "grid-cols-2 md:grid-cols-4"
      case "5": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      case "6": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      default: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      {/* Header */}
      <div className="relative p-4 border-b border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-foreground hover:bg-accent/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Card Explorer</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-6">
        {/* Filters Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-border/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Search by Name</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter card name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-muted-foreground/30"
                />
              </div>
            </div>

            {/* Cost Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Cost Range: {costRange[0]} - {costRange[1]}
              </Label>
              <Slider
                value={costRange}
                onValueChange={setCostRange}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Card Type Toggles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Card Types</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
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
                  <span className="text-sm text-foreground">Show Units</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
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
                  <span className="text-sm text-foreground">Show Legendary</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
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
                  <span className="text-sm text-foreground">Show Spells</span>
                </label>
              </div>
            </div>

            {/* View Mode */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Cards per Row</Label>
              <RadioGroup value={viewMode} onValueChange={setViewMode} className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="4" />
                  <span className="text-sm text-foreground">4</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="5" />
                  <span className="text-sm text-foreground">5</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <RadioGroupItem value="6" />
                  <span className="text-sm text-foreground">6</span>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-border/20">
            <p className="text-sm text-muted-foreground border-muted-foreground/30">
              Showing {filteredCards.length} of {cardDatabase.length} cards
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-muted/20">
                <CardImage
                  cardId={card.id}
                  cardName={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground text-sm truncate" title={card.name}>
                  {card.name}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cost: {card.cost}</span>
                  <div className="flex gap-1">
                    {card.isLegendary && (
                      <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                        Legendary
                      </span>
                    )}
                    {card.isSpell && (
                      <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        Spell
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => downloadCardImage(card)}
                  size="sm"
                  variant="outline"
                  className="w-full flex items-center gap-2 text-xs hover:bg-accent/20"
                >
                  <Download className="h-3 w-3" />
                  Download Image
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No cards found matching your filters.</p>
            <p className="text-muted-foreground text-sm mt-2">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Wave Divider at bottom */}
      <div className="mt-12">
        <WaveDivider />
      </div>
    </div>
  )
}

export default Cards