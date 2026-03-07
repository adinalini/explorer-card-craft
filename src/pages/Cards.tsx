import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CardImage, getCardImageForPatch } from "@/components/CardImage";
import { CardVersionSelector } from "@/components/CardVersionSelector";
import { WaveDivider } from "@/components/ui/wave-divider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Search, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SEOHead } from "@/components/SEOHead";
import { PATCHES, CURRENT_PATCH } from "@/utils/patches";
import { patchCardStats } from "@/utils/cardStats";
import { cardKeyMapping } from "@/utils/cardKeyMapping";

interface ExplorerCard {
  id: string;
  name: string;
  cost: number;
  isLegendary: boolean;
  isSpell: boolean;
  isItem: boolean;
  cardKey?: string;
  alignment?: 'good' | 'evil' | 'neutral';
}

const Cards = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [costRange, setCostRange] = useState([0, 10]);
  const [showMinions, setShowMinions] = useState(true);
  const [showLegendary, setShowLegendary] = useState(true);
  const [showSpells, setShowSpells] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [showGood, setShowGood] = useState(true);
  const [showEvil, setShowEvil] = useState(true);
  const [showNeutral, setShowNeutral] = useState(true);
  const [viewMode, setViewMode] = useState("5");
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [globalPatch, setGlobalPatch] = useState(CURRENT_PATCH.id);
  const [selectedVersions, setSelectedVersions] = useState<Record<string, string | null>>({});

  const handleGlobalPatchChange = (patchId: string) => {
    setGlobalPatch(patchId);
    setSelectedVersions({});
  };

  // Build card list from the selected patch's stats
  const patchCards = useMemo(() => {
    const stats = patchCardStats[globalPatch] || {};
    return Object.entries(stats)
      .filter(([_, s]) => s.status === 'active')
      .map(([id, s]): ExplorerCard => ({
        id,
        name: s.name,
        cost: s.cost,
        isLegendary: s.isLegendary,
        isSpell: s.cardType === 'spell',
        isItem: s.cardType === 'item',
        cardKey: cardKeyMapping[id],
        alignment: s.alignment,
      }));
  }, [globalPatch]);

  const hasItems = useMemo(() => patchCards.some(c => c.isItem), [patchCards]);

  const filteredCards = useMemo(() => {
    // Only count showItems if items actually exist in this patch
    const effectiveShowItems = hasItems && showItems;

    return patchCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCost = card.cost >= costRange[0] && card.cost <= costRange[1];

      const isCharacter = !card.isSpell && !card.isItem;
      const isSpell = card.isSpell && !card.isItem;
      const isItem = card.isItem;

      const anyTypeSelected = showMinions || showSpells || effectiveShowItems;
      let matchesTypeAndLegendary: boolean;
      if (!anyTypeSelected) {
        // Only legendary filter active
        matchesTypeAndLegendary = showLegendary && card.isLegendary;
      } else if (showLegendary) {
        // Types + legendary: show cards matching types OR legendary cards
        matchesTypeAndLegendary = (showMinions && isCharacter) || (showSpells && isSpell) || (effectiveShowItems && isItem) || card.isLegendary;
      } else {
        // Types only, no legendary: exclude legendary cards
        matchesTypeAndLegendary = ((showMinions && isCharacter) || (showSpells && isSpell) || (effectiveShowItems && isItem)) && !card.isLegendary;
      }

      // Alignment filter: for patches with alignment (GDC 2026+), require matching filter.
      const selectedPatchObj = PATCHES.find(p => p.id === globalPatch);
      const patchHasAlignment = selectedPatchObj && selectedPatchObj.order >= 3;
      let matchesAlignment = true;
      if (patchHasAlignment) {
        const cardAlignment = card.alignment || 'neutral';
        matchesAlignment = (cardAlignment === 'good' && showGood) || 
          (cardAlignment === 'evil' && showEvil) || 
          (cardAlignment === 'neutral' && showNeutral);
      }

      return matchesSearch && matchesCost && matchesTypeAndLegendary && matchesAlignment;
    }).sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.name.localeCompare(b.name);
    });
  }, [patchCards, hasItems, searchQuery, costRange, showMinions, showLegendary, showSpells, showItems, showGood, showEvil, showNeutral]);

  const downloadCardImage = async (card: ExplorerCard, selectedVersion: string | null) => {
    try {
      const patchForImage = selectedVersion || globalPatch;
      const imageUrl = getCardImageForPatch(card.id, patchForImage);

      if (!imageUrl) {
        throw new Error('Image not found for card: ' + card.id);
      }

      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      let fileName = card.name.replace(/\s+/g, '_').toLowerCase();
      if (selectedVersion) fileName = `${fileName}_${selectedVersion}`;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${card.name}${selectedVersion ? ` (${selectedVersion})` : ''} image...`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download card image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVersionChange = (cardId: string, version: string | null) => {
    setSelectedVersions(prev => ({ ...prev, [cardId]: version }));
  };

  const getGridCols = () => {
    switch (viewMode) {
      case "4": return "grid-cols-2 md:grid-cols-4";
      case "5": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case "6": return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
      default: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="World of Origins"
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
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-foreground absolute left-1/2 -translate-x-1/2">Card Explorer</h1>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-card rounded-lg p-6 mb-8 border border-border">
          {/* Search + collapse toggle row (mobile) */}
          <div className="flex gap-2 items-end md:hidden">
            <div className="space-y-2 flex-1">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            >
              {filtersCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </Button>
          </div>

          {/* All filters in grid (collapsible on mobile, always visible on desktop) */}
          <div className={`${filtersCollapsed ? 'hidden' : 'block'} md:block`}>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 mt-6 md:mt-0">
              {/* Search (desktop only - mobile has its own above) */}
              <div className="space-y-2 hidden md:block">
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
                {(() => {
                  return (
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={showMinions}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        if (!newValue && !showSpells && !showItems && !showLegendary) return;
                        setShowMinions(newValue);
                      }}
                      className="rounded border-border"
                    />
                    Characters
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={showSpells}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        if (!newValue && !showMinions && !showItems && !showLegendary) return;
                        setShowSpells(newValue);
                      }}
                      className="rounded border-border"
                    />
                    Spells
                  </label>
                  {hasItems && (
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={showItems}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        if (!newValue && !showMinions && !showSpells && !showLegendary) return;
                        setShowItems(newValue);
                      }}
                      className="rounded border-border"
                    />
                    Items
                  </label>
                  )}
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={showLegendary}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        if (!newValue && !showMinions && !showSpells && !showItems) return;
                        setShowLegendary(newValue);
                      }}
                      className="rounded border-border"
                    />
                    Legendary
                  </label>
                </div>
                  );
                })()}
              </div>

              {/* Alignment */}
              <div className="space-y-2 lg:col-span-1">
                <Label className={`text-foreground ${!(PATCHES.find(p => p.id === globalPatch)?.order ?? 0 >= 3) ? '' : ''}`}>Alignment</Label>
                {(() => {
                  const selectedPatch = PATCHES.find(p => p.id === globalPatch);
                  const hasAlignment = selectedPatch && selectedPatch.order >= 3;
                  return hasAlignment ? (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={showGood}
                          onChange={(e) => {
                            if (!e.target.checked && !showEvil && !showNeutral) return;
                            setShowGood(e.target.checked);
                          }}
                          className="rounded border-border"
                        />
                        Good
                      </label>
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={showEvil}
                          onChange={(e) => {
                            if (!e.target.checked && !showGood && !showNeutral) return;
                            setShowEvil(e.target.checked);
                          }}
                          className="rounded border-border"
                        />
                        Evil
                      </label>
                      <label className="flex items-center gap-2 text-sm text-foreground 2xl:basis-full">
                        <input
                          type="checkbox"
                          checked={showNeutral}
                          onChange={(e) => {
                            if (!e.target.checked && !showGood && !showEvil) return;
                            setShowNeutral(e.target.checked);
                          }}
                          className="rounded border-border"
                        />
                        Neutral
                      </label>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">N/A for this patch</p>
                  );
                })()}
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

              {/* Patch Selector */}
              <div className="space-y-2">
                <Label className="text-foreground">Patch</Label>
                <Select value={globalPatch} onValueChange={handleGlobalPatchChange}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...PATCHES].reverse().map(patch => (
                      <SelectItem key={patch.id} value={patch.id} className="text-sm">
                        {patch.displayName}{patch.id === CURRENT_PATCH.id ? ' (latest)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCards.length} of {patchCards.length} cards
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {filteredCards.map((card) => {
            const selectedVersion = selectedVersions[card.id] || null;
            const displayPatch = selectedVersion || globalPatch;

            return (
              <div key={card.id} className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-200">
                <div className="aspect-[3/4] relative">
                  <CardImage
                    cardId={card.id}
                    cardName={card.name}
                    patchId={displayPatch}
                    className="w-full h-full object-cover"
                  />
                  {selectedVersion && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded">
                      {PATCHES.find(p => p.id === selectedVersion)?.displayName ?? selectedVersion}
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
                      globalPatch={globalPatch}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cost: {card.cost}</span>
                    <div className="flex gap-1 items-center">
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
                      {card.isItem && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded text-[10px]">
                          Item
                        </span>
                      )}
                      {!card.isSpell && !card.isItem && (
                        <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-[10px]">
                          Character
                        </span>
                      )}
                      <button
                        onClick={() => downloadCardImage(card, selectedVersion)}
                        className="md:hidden p-1 rounded hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => downloadCardImage(card, selectedVersion)}
                    size="sm"
                    variant="outline"
                    className="hidden md:flex w-full items-center gap-2 text-xs hover:bg-accent/20"
                  >
                    <Download className="w-3 h-3" />
                    Download Image
                  </Button>
                </div>
              </div>
            );
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
    </div>
  );
};

export default Cards;
