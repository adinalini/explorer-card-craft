import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Cards = () => {
  const navigate = useNavigate();
  const [showUnits, setShowUnits] = useState(true);
  const [showLegendary, setShowLegendary] = useState(true);
  const [showSpells, setShowSpells] = useState(true);
  const [showItems, setShowItems] = useState(true);

  return (
    <>
      <SEOHead 
        title="Card Explorer - Project O Zone"
        description="Explore all cards in Project O Zone. Browse, search, and filter through our extensive card collection with detailed stats and artwork."
        image="/og-images/cards.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Card Explorer
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            This page is down until further notice.
          </p>
          
          {/* Filter toggles (disabled) */}
          <div className="flex gap-4 justify-center mb-8 opacity-50 pointer-events-none">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="units-cards"
                checked={showUnits}
                onCheckedChange={(checked) => setShowUnits(checked === true)}
                disabled
              />
              <Label htmlFor="units-cards" className="text-sm">Units</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="legendary-cards"
                checked={showLegendary}
                onCheckedChange={(checked) => setShowLegendary(checked === true)}
                disabled
              />
              <Label htmlFor="legendary-cards" className="text-sm">Legendary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="spells-cards"
                checked={showSpells}
                onCheckedChange={(checked) => setShowSpells(checked === true)}
                disabled
              />
              <Label htmlFor="spells-cards" className="text-sm">Spells</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="items-cards"
                checked={showItems}
                onCheckedChange={(checked) => setShowItems(checked === true)}
                disabled
              />
              <Label htmlFor="items-cards" className="text-sm">Items</Label>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cards;
