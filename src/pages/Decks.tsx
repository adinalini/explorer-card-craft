import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { WaveDivider } from "@/components/ui/wave-divider";
import { CardImage } from "@/components/CardImage";
import { supabase } from "@/integrations/supabase/client";
import { Star, Users, ArrowLeft, Flame, Droplet, Cloud, Bomb, Plus, CreditCard, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { encodeDeck } from "@/utils/deckCodeGenerator";
import { getCardKey } from "@/utils/cardKeyMapping";

interface Deck {
  id: string;
  name: string;
  type: 'aggro' | 'control' | 'destroy' | 'discard' | 'move' | 'ramp';
  description?: string;
  author_name?: string;
  is_featured: boolean;
  notes?: string;
  patch: string;
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

const Decks = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedDeckId, setCopiedDeckId] = useState<string | null>(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const { data: decksData, error: decksError } = await supabase
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
        .order('created_at', { ascending: false });

      if (decksError) throw decksError;

      const formattedDecks = decksData?.map(deck => ({
        ...deck,
        cards: deck.deck_cards.sort((a, b) => a.position - b.position)
      })) || [];

      setDecks(formattedDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
      toast({
        title: "Error",
        description: "Failed to load decks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => {
      const matchesSearch = 
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.cards.some(card => 
          card.card_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesType = selectedType === "all" || deck.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [decks, searchQuery, selectedType]);

  const featuredDecks = filteredDecks.filter(deck => deck.is_featured);
  const communityDecks = filteredDecks; // Show all decks in community section

  // Pagination logic
  const getPaginatedDecks = (deckList: Deck[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return deckList.slice(startIndex, endIndex);
  };

  const getTotalPages = (deckList: Deck[]) => {
    return Math.ceil(deckList.length / itemsPerPage);
  };

  const paginatedFeaturedDecks = getPaginatedDecks(featuredDecks);
  const paginatedCommunityDecks = getPaginatedDecks(communityDecks);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, itemsPerPage]);

  const handleCopyDeckCode = async (deck: Deck, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent deck navigation
    
    const cardKeys: string[] = [];
    for (const card of deck.cards) {
      const cardKey = getCardKey(card.card_id);
      if (cardKey) {
        cardKeys.push(cardKey);
      }
    }

    if (cardKeys.length === 0) {
      return;
    }

    const deckCode = encodeDeck(cardKeys);
    if (!deckCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(deckCode);
      setCopiedDeckId(deck.id);
      setTimeout(() => setCopiedDeckId(null), 2000);
    } catch (error) {
      // Silent fail
    }
  };

  const PaginationControls = ({ deckList }: { deckList: Deck[] }) => {
    const totalPages = getTotalPages(deckList);
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          if (pageNum > totalPages) return null;
          
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className="w-8"
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const DeckCard = ({ deck, showDescription = false }: { deck: Deck; showDescription?: boolean }) => {
    const TypeIcon = deckTypeIcons[deck.type];
    
    return (
      <div 
        className="bg-card border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => navigate(`/deck/${deck.id}`)}
      >
        <div className="flex items-center gap-2 mb-2">
          <TypeIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-card-foreground">{deck.name}</h3>
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded capitalize">
            {deck.type}
          </span>
        </div>
        
        {showDescription && deck.description && (
          <p className="text-sm text-muted-foreground mb-3">{deck.description}</p>
        )}
        
        <div className="grid grid-cols-13 gap-1 mb-3">
          {deck.cards.map((card) => (
            <div key={card.position} className="aspect-square">
              <CardImage 
                cardId={card.card_id}
                cardName={card.card_name}
                className="w-full h-full object-cover rounded border"
              />
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground">
          By: {deck.author_name || 'N/A'}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center">
        <div className="text-xl text-foreground">Loading decks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-accent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-4xl font-bold text-foreground">Deck Builder</h1>
            </div>
            
            <Button
              onClick={() => navigate('/deck-builder')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Deck
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <Input
              placeholder="Search decks by name, creator, or card names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-foreground">Deck Type:</Label>
                <RadioGroup
                  value={selectedType}
                  onValueChange={setSelectedType}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-sm">All</Label>
                  </div>
                  {Object.entries(deckTypeIcons).map(([type, Icon]) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="text-sm flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium text-foreground">Decks per page:</Label>
                <RadioGroup
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                  className="flex gap-4"
                >
                  {[10, 25, 50].map(num => (
                    <div key={num} className="flex items-center space-x-2">
                      <RadioGroupItem value={num.toString()} id={`per-page-${num}`} />
                      <Label htmlFor={`per-page-${num}`} className="text-sm">{num}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured Decks
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Decks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <div className="space-y-4">
                {paginatedFeaturedDecks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No featured decks found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {paginatedFeaturedDecks.map((deck, index) => (
                       <div key={deck.id} className="flex items-center gap-2">
                         <div 
                           className="flex-1 bg-card border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
                           onClick={() => navigate(`/deck/${deck.id}`)}
                         >
                           <div className="grid grid-cols-12 gap-4 items-center">
                             <div className="text-sm font-mono text-muted-foreground">
                               {(currentPage - 1) * itemsPerPage + index + 1}
                             </div>
                             <div className="col-span-2">
                               <h3 className="font-semibold text-card-foreground">{deck.name}</h3>
                             </div>
                             <div className="flex items-center gap-1">
                               {React.createElement(deckTypeIcons[deck.type], { className: "h-4 w-4 text-primary" })}
                               <span className="text-sm capitalize">{deck.type}</span>
                             </div>
                             <div className="col-span-5">
                               <div className="grid grid-cols-13 gap-1">
                                 {deck.cards.map((card) => (
                                   <div key={card.position} className="aspect-square">
                                     <CardImage 
                                       cardId={card.card_id}
                                       cardName={card.card_name}
                                       className="w-full h-full object-cover rounded border"
                                     />
                                   </div>
                                 ))}
                               </div>
                             </div>
                             <div className="col-span-2 text-sm text-muted-foreground">
                               {deck.notes || 'N/A'}
                             </div>
                             <div className="text-sm text-muted-foreground text-right">
                               {deck.author_name || 'N/A'}
                             </div>
                           </div>
                         </div>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={(e) => handleCopyDeckCode(deck, e)}
                           className="text-muted-foreground hover:text-muted-foreground/80 p-2"
                         >
                           {copiedDeckId === deck.id ? (
                             <Check className="h-4 w-4" />
                           ) : (
                             <Copy className="h-4 w-4" />
                           )}
                         </Button>
                       </div>
                     ))}
                  </div>
                )}
                <PaginationControls deckList={featuredDecks} />
              </div>
            </TabsContent>

            <TabsContent value="community">
              <div className="space-y-4">
                {paginatedCommunityDecks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No community decks found.</p>
                    <Button
                      onClick={() => navigate('/deck-builder')}
                      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Create the First Deck
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {paginatedCommunityDecks.map((deck, index) => (
                       <div key={deck.id} className="flex items-center gap-2">
                         <div 
                           className="flex-1 bg-card border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
                           onClick={() => navigate(`/deck/${deck.id}`)}
                         >
                           <div className="grid grid-cols-12 gap-4 items-center">
                             <div className="text-sm font-mono text-muted-foreground">
                               {(currentPage - 1) * itemsPerPage + index + 1}
                             </div>
                             <div className="col-span-2">
                               <h3 className="font-semibold text-card-foreground">{deck.name}</h3>
                             </div>
                             <div className="flex items-center gap-1">
                               {React.createElement(deckTypeIcons[deck.type], { className: "h-4 w-4 text-primary" })}
                               <span className="text-sm capitalize">{deck.type}</span>
                             </div>
                             <div className="col-span-6">
                               <div className="grid grid-cols-13 gap-1">
                                 {deck.cards.map((card) => (
                                   <div key={card.position} className="aspect-square">
                                     <CardImage 
                                       cardId={card.card_id}
                                       cardName={card.card_name}
                                       className="w-full h-full object-cover rounded border"
                                     />
                                   </div>
                                 ))}
                               </div>
                             </div>
                             <div className="col-span-2 text-sm text-muted-foreground text-right">
                               {deck.author_name || 'N/A'}
                             </div>
                           </div>
                         </div>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={(e) => handleCopyDeckCode(deck, e)}
                           className="text-muted-foreground hover:text-muted-foreground/80 p-2"
                         >
                           {copiedDeckId === deck.id ? (
                             <Check className="h-4 w-4" />
                           ) : (
                             <Copy className="h-4 w-4" />
                           )}
                         </Button>
                       </div>
                     ))}
                  </div>
                )}
                <PaginationControls deckList={communityDecks} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <WaveDivider />
    </div>
  );
};

export default Decks;