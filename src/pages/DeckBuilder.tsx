import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WaveDivider } from "@/components/ui/wave-divider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Flame, Droplet, Cloud, Bomb, Plus, CreditCard, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cardDatabase } from "@/utils/cardData";
import { CardImage } from "@/components/CardImage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { decodeDeck } from "@/utils/deckCodeGenerator";
import { cardKeyMapping } from "@/utils/cardKeyMapping";

interface DeckCard {
  card_id: string;
  card_name: string;
  card_image: string;
  is_legendary: boolean;
  position: number;
}

const deckTypeIcons = {
  aggro: Flame,
  control: Droplet,
  destroy: Bomb,
  discard: CreditCard,
  move: Cloud,
  ramp: Plus,
  combo: Sparkles,
  midrange: TrendingUp,
};

const DeckBuilder = () => {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState("");
  const [deckType, setDeckType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedCards, setSelectedCards] = useState<DeckCard[]>([]);
  const [saving, setSaving] = useState(false);
  const [deckCodeInput, setDeckCodeInput] = useState("");
  const [importing, setImporting] = useState(false);

  // Card filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [costRange, setCostRange] = useState([0, 10]);
  const [showMinions, setShowMinions] = useState(true);
  const [showLegendary, setShowLegendary] = useState(true);
  const [showSpells, setShowSpells] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [showGood, setShowGood] = useState(true);
  const [showEvil, setShowEvil] = useState(true);
  const [showNeutral, setShowNeutral] = useState(true);

  const filteredCards = useMemo(() => {
    return cardDatabase
      .filter((card) => {
        if (card.inDraftPool === false) return false;

        const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCost = card.cost >= costRange[0] && card.cost <= costRange[1];

        // Type filtering: minions, spells, items are types; legendary is a status
        const isMinion = !card.isSpell && !card.isItem;
        const matchesType = (isMinion && showMinions) || (card.isSpell && showSpells) || (card.isItem && showItems);

        // Legendary status filter
        const matchesLegendary = !card.isLegendary || showLegendary;

        // Alignment filter
        const cardAlignment = card.alignment || "neutral";
        const matchesAlignment =
          (cardAlignment === "good" && showGood) ||
          (cardAlignment === "evil" && showEvil) ||
          (cardAlignment === "neutral" && showNeutral);

        return matchesSearch && matchesCost && matchesType && matchesLegendary && matchesAlignment;
      })
      .sort((a, b) => {
        if (a.cost !== b.cost) return a.cost - b.cost;
        return a.name.localeCompare(b.name);
      });
  }, [searchQuery, costRange, showMinions, showLegendary, showSpells, showItems, showGood, showEvil, showNeutral]);

  const handleCardSelect = (card: any) => {
    // Check if card is already selected
    if (selectedCards.some((c) => c.card_id === card.id)) {
      return;
    }

    // Handle legendary replacement (works even when deck is full)
    if (card.isLegendary) {
      const existingLegendary = selectedCards.find((c) => c.is_legendary);
      if (existingLegendary) {
        const newCards = selectedCards.filter((c) => !c.is_legendary);
        newCards.push({
          card_id: card.id,
          card_name: card.name,
          card_image: card.image,
          is_legendary: true,
          position: 0, // Will be recalculated
        });
        // Sort and update positions
        const sortedCards = newCards
          .sort((a, b) => {
            const cardA = cardDatabase.find((c) => c.id === a.card_id)!;
            const cardB = cardDatabase.find((c) => c.id === b.card_id)!;
            if (cardA.cost !== cardB.cost) return cardA.cost - cardB.cost;
            return cardA.name.localeCompare(cardB.name);
          })
          .map((card, index) => ({ ...card, position: index + 1 }));
        setSelectedCards(sortedCards);
        return;
      }
    }

    // Check deck constraints for adding new cards
    const hasLegendary = selectedCards.some((c) => c.is_legendary);
    const normalCards = selectedCards.filter((c) => !c.is_legendary);

    if (selectedCards.length >= 13) {
      toast({
        title: "Deck Full",
        description: "Please deselect an existing card before adding a new one.",
        variant: "destructive",
      });
      return;
    }

    // If trying to add 13th card and it's not legendary, and no legendary exists
    if (normalCards.length >= 12 && !card.isLegendary && !hasLegendary) {
      toast({
        title: "Need Legendary Card",
        description: "Please add your legendary card or remove a non-legendary card.",
        variant: "destructive",
      });
      return;
    }

    // Add new card
    const newCard: DeckCard = {
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      position: 0, // Will be recalculated
    };

    // Add card and sort by cost then name
    const newCards = [...selectedCards, newCard];
    const sortedCards = newCards
      .sort((a, b) => {
        const cardA = cardDatabase.find((c) => c.id === a.card_id)!;
        const cardB = cardDatabase.find((c) => c.id === b.card_id)!;
        if (cardA.cost !== cardB.cost) return cardA.cost - cardB.cost;
        return cardA.name.localeCompare(cardB.name);
      })
      .map((card, index) => ({ ...card, position: index + 1 }));

    setSelectedCards(sortedCards);
  };

  const handleCardRemove = (cardId: string) => {
    const newCards = selectedCards.filter((c) => c.card_id !== cardId);
    // Sort and update positions
    const sortedCards = newCards
      .sort((a, b) => {
        const cardA = cardDatabase.find((c) => c.id === a.card_id)!;
        const cardB = cardDatabase.find((c) => c.id === b.card_id)!;
        if (cardA.cost !== cardB.cost) return cardA.cost - cardB.cost;
        return cardA.name.localeCompare(cardB.name);
      })
      .map((card, index) => ({ ...card, position: index + 1 }));
    setSelectedCards(sortedCards);
  };

  const isCardSelected = (cardId: string) => {
    return selectedCards.some((c) => c.card_id === cardId);
  };

  const handleSaveDeck = async () => {
    if (!deckName.trim() || !deckType) {
      toast({
        title: "Missing Information",
        description: "Please fill in deck name and type.",
        variant: "destructive",
      });
      return;
    }

    if (selectedCards.length !== 13) {
      toast({
        title: "Incomplete Deck",
        description: "Please select exactly 13 cards for your deck.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      // Create deck
      const { data: deckData, error: deckError } = await supabase
        .from("decks")
        .insert({
          name: deckName.trim(),
          type: deckType as "aggro" | "control" | "destroy" | "discard" | "move" | "ramp" | "combo" | "midrange",
          description: description.trim() || null,
          author_name: authorName.trim() || null,
          is_featured: false,
          patch: "winter-2025",
        })
        .select()
        .single();

      if (deckError) throw deckError;

      // Insert deck cards
      const deckCards = selectedCards.map((card) => ({
        deck_id: deckData.id,
        card_id: card.card_id,
        card_name: card.card_name,
        card_image: card.card_image,
        is_legendary: card.is_legendary,
        position: card.position,
      }));

      const { error: cardsError } = await supabase.from("deck_cards").insert(deckCards);

      if (cardsError) throw cardsError;

      toast({
        title: "Deck Created",
        description: "Your deck has been saved successfully!",
      });

      navigate("/decks");
    } catch (error) {
      console.error("Error saving deck:", error);
      toast({
        title: "Error",
        description: "Failed to save deck. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Build reverse mapping: cardKey (without variant) -> cardId
  const reverseKeyMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [cardId, cardKey] of Object.entries(cardKeyMapping)) {
      const baseKey = cardKey.replace(/_(MB|MC|SB|SC)$/, "");
      map[baseKey] = cardId;
    }
    return map;
  }, []);

  const handleImportDeckCode = useCallback(async () => {
    if (!deckCodeInput.trim()) return;
    setImporting(true);
    try {
      const { cardKeys, errorMessage } = await decodeDeck(deckCodeInput.trim());
      if (!cardKeys || cardKeys.length === 0) {
        toast({
          title: "Invalid Deck Code",
          description: errorMessage || "Could not decode the deck code.",
          variant: "destructive",
        });
        return;
      }

      const importedCards: DeckCard[] = [];
      for (const key of cardKeys) {
        const baseKey = key.replace(/_V\d+$/, "");
        const lookupKey = baseKey.replace(/_(MB|MC|SB|SC)$/, "");
        const cardId = reverseKeyMap[lookupKey];
        if (!cardId) continue;
        const card = cardDatabase.find((c) => c.id === cardId);
        if (!card) continue;
        if (importedCards.some((c) => c.card_id === card.id)) continue;
        importedCards.push({
          card_id: card.id,
          card_name: card.name,
          card_image: card.image,
          is_legendary: card.isLegendary,
          position: 0,
        });
      }

      if (importedCards.length === 0) {
        toast({
          title: "No Cards Found",
          description: "Could not match any cards from the deck code.",
          variant: "destructive",
        });
        return;
      }

      const sorted = importedCards
        .sort((a, b) => {
          const ca = cardDatabase.find((c) => c.id === a.card_id)!;
          const cb = cardDatabase.find((c) => c.id === b.card_id)!;
          if (ca.cost !== cb.cost) return ca.cost - cb.cost;
          return ca.name.localeCompare(cb.name);
        })
        .map((card, i) => ({ ...card, position: i + 1 }));

      setSelectedCards(sorted);
      setDeckCodeInput("");
      toast({ title: "Deck Imported", description: `Imported ${sorted.length} cards from deck code.` });
    } catch {
      toast({ title: "Error", description: "Failed to import deck code.", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }, [deckCodeInput, reverseKeyMap]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-2">
          <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="text-foreground hover:bg-accent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Create New Deck</h1>
          </div>

          <ThemeToggle className="text-foreground hover:bg-accent" />
        </div>

        {/* Deck Information Form */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name" className="text-sm font-medium">
                Deck Name *
              </Label>
              <Input
                id="deck-name"
                placeholder="Enter deck name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deck-type" className="text-sm font-medium">
                Type *
              </Label>
              <Select value={deckType} onValueChange={setDeckType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deck type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(deckTypeIcons).map(([type, Icon]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author-name" className="text-sm font-medium">
                Author Name
              </Label>
              <Input
                id="author-name"
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your deck strategy (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deck Preview */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Your Deck ({selectedCards.length}/13)</h2>

            <div className="space-y-4 min-h-[400px]">
              {/* Deck Info and Legendary Card Combined */}
              <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-4">
                {/* Legendary Card on Left */}
                <div className="flex-shrink-0 w-24">
                  {selectedCards.find((c) => c.is_legendary) ? (
                    <div className="relative group aspect-[3/4]">
                      <CardImage
                        cardId={selectedCards.find((c) => c.is_legendary)!.card_id}
                        cardName={selectedCards.find((c) => c.is_legendary)!.card_name}
                        className="w-full h-full object-cover rounded border-2 border-yellow-400"
                      />
                      <button
                        onClick={() => handleCardRemove(selectedCards.find((c) => c.is_legendary)!.card_id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] border-2 border-dashed border-yellow-400/30 rounded flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">Legendary</span>
                    </div>
                  )}
                </div>

                {/* Deck Info on Right */}
                <div className="flex-1 text-center">
                  <div className="text-lg font-bold text-card-foreground">{deckName || "Deck Name"}</div>
                  <div className="text-sm text-muted-foreground capitalize">{deckType || "Type"}</div>
                  <div className="text-sm text-muted-foreground">{authorName || "Author"}</div>
                </div>
              </div>

              {/* Regular Cards Section */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => {
                  const nonLegendaryCards = selectedCards.filter((c) => !c.is_legendary);
                  const card = nonLegendaryCards[i];

                  return card ? (
                    <div key={i + 1} className="relative group aspect-[3/4]">
                      <CardImage
                        cardId={card.card_id}
                        cardName={card.card_name}
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        onClick={() => handleCardRemove(card.card_id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i + 1}
                      className="aspect-[3/4] border border-dashed border-muted-foreground/30 rounded flex items-center justify-center"
                    >
                      <span className="text-muted-foreground text-xs">{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSaveDeck}
              disabled={saving || selectedCards.length !== 13 || !deckName || !deckType}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? "Saving..." : "Save Deck"}
            </Button>

            {/* Deck Code Import */}
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Import Deck Code</Label>
              <Textarea
                placeholder="Paste deck code here..."
                value={deckCodeInput}
                onChange={(e) => setDeckCodeInput(e.target.value)}
                rows={2}
                className="text-xs"
              />
              <Button
                onClick={handleImportDeckCode}
                disabled={importing || !deckCodeInput.trim()}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {importing ? "Importing..." : "Import Deck"}
              </Button>
            </div>
          </div>

          {/* Card Selection */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">Select Cards</h2>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <Input
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Cost Range: {costRange[0]} - {costRange[1]}
                </Label>
                <Slider value={costRange} onValueChange={setCostRange} max={10} min={0} step={1} className="w-full" />
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="minions"
                    checked={showMinions}
                    onCheckedChange={(checked) => setShowMinions(checked === true)}
                  />
                  <Label htmlFor="minions" className="text-sm">
                    Minions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spells"
                    checked={showSpells}
                    onCheckedChange={(checked) => setShowSpells(checked === true)}
                  />
                  <Label htmlFor="spells" className="text-sm">
                    Spells
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="items"
                    checked={showItems}
                    onCheckedChange={(checked) => setShowItems(checked === true)}
                  />
                  <Label htmlFor="items" className="text-sm">
                    Items
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legendary"
                    checked={showLegendary}
                    onCheckedChange={(checked) => setShowLegendary(checked === true)}
                  />
                  <Label htmlFor="legendary" className="text-sm">
                    Legendary
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Alignment</Label>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="good"
                      checked={showGood}
                      onCheckedChange={(checked) => {
                        if (!checked && !showEvil && !showNeutral) return;
                        setShowGood(checked === true);
                      }}
                    />
                    <Label htmlFor="good" className="text-sm">
                      Good
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="evil"
                      checked={showEvil}
                      onCheckedChange={(checked) => {
                        if (!checked && !showGood && !showNeutral) return;
                        setShowEvil(checked === true);
                      }}
                    />
                    <Label htmlFor="evil" className="text-sm">
                      Evil
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neutral"
                      checked={showNeutral}
                      onCheckedChange={(checked) => {
                        if (!checked && !showGood && !showEvil) return;
                        setShowNeutral(checked === true);
                      }}
                    />
                    <Label htmlFor="neutral" className="text-sm">
                      Neutral
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative cursor-pointer transition-all ${
                    isCardSelected(card.id) ? "opacity-50 pointer-events-none" : "hover:scale-105"
                  }`}
                  onClick={() => handleCardSelect(card)}
                >
                  <CardImage cardId={card.id} cardName={card.name} />
                  {isCardSelected(card.id) && (
                    <div className="absolute inset-0 bg-gray-500/50 rounded flex items-center justify-center">
                      <span className="text-white font-bold">SELECTED</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <WaveDivider />
    </div>
  );
};

export default DeckBuilder;
