import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { cardDatabase, Card } from "@/utils/cardData";

const Cards = () => {
  const navigate = useNavigate();
  const [showUnits, setShowUnits] = useState(true);
  const [showLegendary, setShowLegendary] = useState(true);
  const [showSpells, setShowSpells] = useState(true);
  const [showItems, setShowItems] = useState(true);
  const [cardImages, setCardImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load all card images
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};
      
      for (const card of cardDatabase) {
        try {
          // Dynamic import based on card id
          const module = await import(`../assets/cards/${getCardFileName(card.id)}.png`);
          images[card.id] = module.default;
        } catch (error) {
          // Try alternate naming conventions
          try {
            const altModule = await import(`../assets/cards/${card.id}.png`);
            images[card.id] = altModule.default;
          } catch {
            console.warn(`Could not load image for ${card.id}`);
          }
        }
      }
      
      setCardImages(images);
      setLoading(false);
    };

    loadImages();
  }, []);

  // Helper to get the correct file name
  const getCardFileName = (id: string): string => {
    const specialCases: Record<string, string> = {
      dark_omen: "Dark_Omen",
      goldi: "Goldi",
      tuck: "Tuck",
      rain_of_arrows: "Rai_of_arrows",
      red_cap: "Red_cap",
      robinhood: "Robinhood",
      animated_broomstick: "Animated_Broomstick",
      babe_the_blue_ox: "Babe_the_blue_ox",
      baby_bear: "Baby_Bear",
      bagheera: "Bagheera",
      baker: "Baker",
      bigfoot: "Bigfoot",
      brandy: "Brandy",
      butcher: "Butcher",
      cake: "Cake",
      captain_ahab: "Captain_Ahab",
      cerberus: "Cerberus",
      chimera: "Chimera",
      drop_bear: "Drop_Bear",
      first_aid: "First_Aid",
      flying_dutchman: "Flying_Dutchman",
      hare: "Hare",
      hercules: "Hercules",
      huck_finn: "Huck_Finn",
      impundulu: "Impundulu",
      koschei: "KOschei",
      mary: "Mary",
      momotaro: "Momotaro",
      morgan_le_fay: "Morgan_le_Fay",
      mortal_coil: "Mortal_Coil",
      mothman: "Mothman",
      obliterate: "Obliterate",
      piglet: "Piglet",
      popeye: "Popeye",
      run_over: "Run_Over",
      sandman: "Sandman",
      sinbad: "Sinbad",
      thumbelina: "Thumbelina",
      tinker_bell: "Tinker_Bell",
      tortoise: "Tortoise",
      wicked_stepmother: "Wicked_Stepmother",
      winnie_the_pooh: "Winnie_the_pooh",
      yuki_onna: "Yuki_onna",
    };
    return specialCases[id] || id;
  };

  // Filter cards based on checkboxes
  const filteredCards = cardDatabase.filter((card) => {
    if (card.isItem && !showItems) return false;
    if (card.isSpell && !card.isItem && !showSpells) return false;
    if (card.isLegendary && !card.isSpell && !card.isItem && !showLegendary) return false;
    if (!card.isLegendary && !card.isSpell && !card.isItem && !showUnits) return false;
    return true;
  });

  // Sort cards alphabetically
  const sortedCards = [...filteredCards].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <SEOHead 
        title="Card Explorer - Project O Zone"
        description="Explore all cards in Project O Zone. Browse, search, and filter through our extensive card collection with detailed stats and artwork."
        image="/og-images/cards.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Card Explorer
            </h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>

          {/* Filter toggles */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 p-4 bg-black/20 backdrop-blur-sm rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="units-cards"
                checked={showUnits}
                onCheckedChange={(checked) => setShowUnits(checked === true)}
              />
              <Label htmlFor="units-cards" className="text-sm text-slate-200">Units</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="legendary-cards"
                checked={showLegendary}
                onCheckedChange={(checked) => setShowLegendary(checked === true)}
              />
              <Label htmlFor="legendary-cards" className="text-sm text-slate-200">Legendary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spells-cards"
                checked={showSpells}
                onCheckedChange={(checked) => setShowSpells(checked === true)}
              />
              <Label htmlFor="spells-cards" className="text-sm text-slate-200">Spells</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="items-cards"
                checked={showItems}
                onCheckedChange={(checked) => setShowItems(checked === true)}
              />
              <Label htmlFor="items-cards" className="text-sm text-slate-200">Items</Label>
            </div>
          </div>

          {/* Card count */}
          <p className="text-center text-slate-400 mb-6">
            Showing {sortedCards.length} cards
          </p>

          {/* Cards grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-slate-400">Loading cards...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedCards.map((card) => (
                <div
                  key={card.id}
                  className="group relative bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/20"
                >
                  {cardImages[card.id] ? (
                    <img
                      src={cardImages[card.id]}
                      alt={card.name}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-slate-800 flex items-center justify-center">
                      <span className="text-slate-500 text-xs text-center p-2">{card.name}</span>
                    </div>
                  )}
                  
                  {/* Card info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium truncate">{card.name}</p>
                    <div className="flex gap-1 mt-1">
                      {card.isLegendary && (
                        <span className="text-[10px] px-1 py-0.5 bg-amber-500/80 text-white rounded">Legendary</span>
                      )}
                      {card.isSpell && (
                        <span className="text-[10px] px-1 py-0.5 bg-blue-500/80 text-white rounded">Spell</span>
                      )}
                      {card.isItem && (
                        <span className="text-[10px] px-1 py-0.5 bg-green-500/80 text-white rounded">Item</span>
                      )}
                      {card.cost !== undefined && (
                        <span className="text-[10px] px-1 py-0.5 bg-violet-500/80 text-white rounded">Cost: {card.cost}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cards;
