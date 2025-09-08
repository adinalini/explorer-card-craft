import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WaveDivider } from "@/components/ui/wave-divider";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Flame, Droplet, Cloud, Bomb, Plus, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cardDatabase } from "@/utils/cardData";
import { CardImage } from "@/components/CardImage";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

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
};

const DeckBuilder = () => {
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState("");
  const [deckType, setDeckType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedCards, setSelectedCards] = useState<DeckCard[]>([]);
  const [saving, setSaving] = useState(false);

  // Card filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [costRange, setCostRange] = useState([0, 10]);
  const [showUnits, setShowUnits] = useState(true);
  const [showLegendary, setShowLegendary] = useState(true);
  const [showSpells, setShowSpells] = useState(true);

  const filteredCards = useMemo(() => {
    return cardDatabase.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCost = card.cost >= costRange[0] && card.cost <= costRange[1];
      
        const matchesType = 
          (card.isLegendary && showLegendary) ||
          (!card.isLegendary && card.isSpell && showSpells) ||
          (!card.isLegendary && !card.isSpell && showUnits);
      
      return matchesSearch && matchesCost && matchesType;
    }).sort((a, b) => {
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, costRange, showUnits, showLegendary, showSpells]);

  const handleCardSelect = (card: any) => {
    if (selectedCards.length >= 13) {
      toast({
        title: "Deck Full",
        description: "Please deselect an existing card before adding a new one.",
        variant: "destructive"
      });
      return;
    }

    // Check if card is already selected
    if (selectedCards.some(c => c.card_id === card.id)) {
      return;
    }

    // Handle legendary replacement
    if (card.isLegendary) {
      const existingLegendary = selectedCards.find(c => c.is_legendary);
      if (existingLegendary) {
        const newCards = selectedCards.filter(c => !c.is_legendary);
        newCards.push({
          card_id: card.id,
          card_name: card.name,
          card_image: card.image,
          is_legendary: true,
          position: existingLegendary.position
        });
        setSelectedCards(newCards);
        return;
      }
    }

    // Add new card
    const newCard: DeckCard = {
      card_id: card.id,
      card_name: card.name,
      card_image: card.image,
      is_legendary: card.isLegendary,
      position: selectedCards.length + 1
    };

    setSelectedCards([...selectedCards, newCard]);
  };

  const handleCardRemove = (cardId: string) => {
    const newCards = selectedCards
      .filter(c => c.card_id !== cardId)
      .map((card, index) => ({ ...card, position: index + 1 }));
    setSelectedCards(newCards);
  };

  const isCardSelected = (cardId: string) => {
    return selectedCards.some(c => c.card_id === cardId);
  };

  const handleSaveDeck = async () => {
    if (!deckName.trim() || !deckType) {
      toast({
        title: "Missing Information",
        description: "Please fill in deck name and type.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCards.length !== 13) {
      toast({
        title: "Incomplete Deck",
        description: "Please select exactly 13 cards for your deck.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      // Create deck
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .insert({
          name: deckName.trim(),
          type: deckType as 'aggro' | 'control' | 'destroy' | 'discard' | 'move' | 'ramp',
          description: description.trim() || null,
          author_name: authorName.trim() || null,
          is_featured: false
        })
        .select()
        .single();

      if (deckError) throw deckError;

      // Insert deck cards
      const deckCards = selectedCards.map(card => ({
        deck_id: deckData.id,
        card_id: card.card_id,
        card_name: card.card_name,
        card_image: card.card_image,
        is_legendary: card.is_legendary,
        position: card.position
      }));

      const { error: cardsError } = await supabase
        .from('deck_cards')
        .insert(deckCards);

      if (cardsError) throw cardsError;

      toast({
        title: "Deck Created",
        description: "Your deck has been saved successfully!",
      });

      navigate('/decks');
    } catch (error) {
      console.error('Error saving deck:', error);
      toast({
        title: "Error",
        description: "Failed to save deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate('/decks')}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Create New Deck</h1>
        </div>

        {/* Deck Information Form */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="deck-name" className="text-sm font-medium">Deck Name *</Label>
              <Input
                id="deck-name"
                placeholder="Enter deck name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deck-type" className="text-sm font-medium">Type *</Label>
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
              <Label htmlFor="author-name" className="text-sm font-medium">Author Name</Label>
              <Input
                id="author-name"
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
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
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Your Deck ({selectedCards.length}/13)
            </h2>
            
            <div className="space-y-4 min-h-[400px]">
              {/* Deck Info and Legendary Card Combined */}
              <div className="bg-muted/20 rounded-lg p-4 flex items-center gap-4">
                {/* Legendary Card on Left */}
                <div className="flex-shrink-0 w-24">
                  {selectedCards.find(c => c.is_legendary) ? (
                    <div className="relative group aspect-[3/4]">
                      <CardImage 
                        cardId={selectedCards.find(c => c.is_legendary)!.card_id}
                        cardName={selectedCards.find(c => c.is_legendary)!.card_name}
                        className="w-full h-full object-cover rounded border-2 border-yellow-400"
                      />
                      <button
                        onClick={() => handleCardRemove(selectedCards.find(c => c.is_legendary)!.card_id)}
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
                  <div className="text-lg font-bold text-card-foreground">
                    {deckName || "Deck Name"}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {deckType || "Type"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {authorName || "Author"}
                  </div>
                </div>
              </div>

              {/* Regular Cards Section */}
              <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: 12 }, (_, i) => {
                    const nonLegendaryCards = selectedCards.filter(c => !c.is_legendary);
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
                      <div key={i + 1} className="aspect-[3/4] border border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
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
                <Label className="text-sm font-medium">Cost Range: {costRange[0]} - {costRange[1]}</Label>
                <Slider
                  value={costRange}
                  onValueChange={setCostRange}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="units"
                    checked={showUnits}
                    onCheckedChange={(checked) => setShowUnits(checked === true)}
                  />
                  <Label htmlFor="units" className="text-sm">Units</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legendary"
                    checked={showLegendary}
                    onCheckedChange={(checked) => setShowLegendary(checked === true)}
                  />
                  <Label htmlFor="legendary" className="text-sm">Legendary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spells"
                    checked={showSpells}
                    onCheckedChange={(checked) => setShowSpells(checked === true)}
                  />
                  <Label htmlFor="spells" className="text-sm">Spells</Label>
                </div>
              </div>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative cursor-pointer transition-all ${
                    isCardSelected(card.id) 
                      ? 'opacity-50 pointer-events-none' 
                      : 'hover:scale-105'
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