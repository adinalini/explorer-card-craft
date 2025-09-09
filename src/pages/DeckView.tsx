import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WaveDivider } from "@/components/ui/wave-divider";
import { DeckCodeDisplay } from "@/components/DeckCodeDisplay";
import { CardImage } from "@/components/CardImage";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Share, Copy, Check, Flame, Droplet, Cloud, Bomb, Plus, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Deck {
  id: string;
  name: string;
  type: 'aggro' | 'control' | 'destroy' | 'discard' | 'move' | 'ramp';
  description?: string;
  author_name?: string;
  is_featured: boolean;
  notes?: string;
  patch: string;
  created_at: string;
  cards: Array<{
    card_id: string;
    card_name: string;
    card_image: string;
    is_legendary: boolean;
    position: number;
  }>;
}

const deckTypeIcons = {
  aggro: Flame,
  control: Droplet,
  destroy: Bomb,
  discard: CreditCard,
  move: Cloud,
  ramp: Plus,
};

const DeckView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDeck();
    }
  }, [id]);

  const fetchDeck = async () => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .select(`
          *,
          deck_cards (
            card_id,
            card_name,
            card_image,
            is_legendary,
            position
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const formattedDeck = {
          ...data,
          cards: data.deck_cards.sort((a, b) => a.position - b.position)
        };
        setDeck(formattedDeck);
      }
    } catch (error) {
      console.error('Error fetching deck:', error);
      toast({
        title: "Error",
        description: "Failed to load deck. Please try again.",
        variant: "destructive"
      });
      navigate('/decks');
    } finally {
      setLoading(false);
    }
  };

  const handleShareDeck = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Link Copied",
        description: "Deck link has been copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center">
        <div className="text-xl text-foreground">Loading deck...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Deck Not Found</h2>
          <Button onClick={() => navigate('/decks')}>
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  const TypeIcon = deckTypeIcons[deck.type];
  const legendaryCard = deck.cards.find(c => c.is_legendary);
  const normalCards = deck.cards.filter(c => !c.is_legendary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/decks')}
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <ThemeToggle className="text-foreground hover:bg-accent" />
        </div>

        {/* Deck Info */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TypeIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold text-card-foreground">{deck.name}</h1>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm capitalize">
              {deck.type}
            </span>
            {deck.is_featured && (
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-card-foreground mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {deck.description || 'N/A'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">Author</h3>
              <p className="text-muted-foreground">
                {deck.author_name || 'N/A'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">Patch</h3>
              <p className="text-muted-foreground">
                {deck.patch}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleShareDeck}
              className="flex items-center gap-2"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Share Deck"}
            </Button>
            
            <DeckCodeDisplay 
              cards={deck.cards.map(card => ({
                card_id: card.card_id,
                card_name: card.card_name,
                card_image: card.card_image,
                is_legendary: card.is_legendary,
                selection_order: card.position
              }))}
            />
          </div>
        </div>

        {/* Deck Visual */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-card-foreground">Deck Cards</h2>
          
          {/* Section Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            <div className="text-center">
              <h3 className="font-semibold text-card-foreground">Legendary</h3>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Cards</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Legendary Card */}
            <div className="flex flex-col items-center justify-center">
              <div className="aspect-[3/4] max-w-sm">
                {legendaryCard ? (
                  <CardImage
                    cardId={legendaryCard.card_id}
                    cardName={legendaryCard.card_name}
                    className="w-full h-full object-cover rounded border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                    <span className="text-muted-foreground">No Legendary Card</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Normal Cards */}
            <div>
              <div className="grid grid-cols-4 gap-3">
                {normalCards.concat(Array(12 - normalCards.length).fill(null)).map((card, index) => (
                  <div key={index} className="aspect-[3/4]">
                    {card ? (
                      <CardImage
                        cardId={card.card_id}
                        cardName={card.card_name}
                        className="w-full h-full object-cover rounded border"
                      />
                    ) : (
                      <div className="w-full h-full border border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">{index + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <WaveDivider />
    </div>
  );
};

export default DeckView;