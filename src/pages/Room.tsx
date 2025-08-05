import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WaveDivider } from "@/components/ui/wave-divider"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { DraftCard } from "@/components/DraftCard"
import { DeckDisplay } from "@/components/DeckDisplay"
import { getRandomCards, getCardById } from "@/utils/cardData"
import { ArrowLeft } from "lucide-react"

// Helper functions for session management
const getUserSessionId = () => {
  let sessionId = sessionStorage.getItem('userSessionId')
  if (!sessionId) {
    sessionId = 'user_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('userSessionId', sessionId)
  }
  return sessionId
}

const getUserRole = (room: Room, sessionId: string) => {
  const creatorSessionId = localStorage.getItem(`room_${room.id}_creator`)
  const joinerSessionId = localStorage.getItem(`room_${room.id}_joiner`)
  
  if (creatorSessionId === sessionId) return 'creator'
  if (joinerSessionId === sessionId) return 'joiner'
  return 'spectator'
}

interface Room {
  id: string
  draft_type: string
  status: string
  creator_name: string
  joiner_name: string | null
  creator_ready: boolean
  joiner_ready: boolean
  current_round: number
}

interface RoomCard {
  id: string
  room_id: string
  round_number: number
  side: string
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selected_by: string | null
}

interface PlayerCard {
  id: string
  room_id: string
  player_side: string
  card_id: string
  card_name: string
  card_image: string
  is_legendary: boolean
  selection_order: number
}

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [roomCards, setRoomCards] = useState<RoomCard[]>([])
  const [playerDecks, setPlayerDecks] = useState<PlayerCard[]>([])
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(15)
  const [isSelectionLocked, setIsSelectionLocked] = useState(false)
  const [userSessionId] = useState(getUserSessionId())
  const [userRole, setUserRole] = useState<'creator' | 'joiner' | 'spectator'>('spectator')

  useEffect(() => {
    if (!roomId) return

    // Fetch initial room data
    fetchRoom()
    fetchRoomCards()
    fetchPlayerDecks()

    // Subscribe to room changes
    const roomChannel = supabase
      .channel('room-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room
            setRoom(updatedRoom)
            
            // Start draft when both players are ready
            if (updatedRoom.creator_ready && updatedRoom.joiner_ready && updatedRoom.status === 'waiting') {
              startDraft()
            }
          }
        }
      )
      .subscribe()

    // Subscribe to room cards changes
    const cardsChannel = supabase
      .channel('room-cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_cards',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          fetchRoomCards()
        }
      )
      .subscribe()

    // Subscribe to player decks changes
    const decksChannel = supabase
      .channel('player-decks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'player_decks',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          fetchPlayerDecks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(roomChannel)
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(decksChannel)
    }
  }, [roomId])

  const fetchRoom = async () => {
    if (!roomId) return

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error) throw error
      setRoom(data)
      
      // Determine user role and set session storage for creator/joiner identification
      if (data) {
        const role = getUserRole(data, userSessionId)
        setUserRole(role)
        
        // Store session IDs for room participants
        if (!localStorage.getItem(`room_${roomId}_creator`) && !data.joiner_name) {
          localStorage.setItem(`room_${roomId}_creator`, userSessionId)
          setUserRole('creator')
        } else if (!localStorage.getItem(`room_${roomId}_joiner`) && data.joiner_name && role === 'spectator') {
          localStorage.setItem(`room_${roomId}_joiner`, userSessionId)
          setUserRole('joiner')
        }
      }
    } catch (error) {
      console.error('Error fetching room:', error)
      toast({
        title: "Error",
        description: "Failed to load room data.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRoomCards = async () => {
    if (!roomId) return

    try {
      const { data, error } = await supabase
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .order('round_number', { ascending: true })

      if (error) throw error
      setRoomCards(data || [])
    } catch (error) {
      console.error('Error fetching room cards:', error)
    }
  }

  const fetchPlayerDecks = async () => {
    if (!roomId) return

    try {
      const { data, error } = await supabase
        .from('player_decks')
        .select('*')
        .eq('room_id', roomId)
        .order('selection_order', { ascending: true })

      if (error) throw error
      setPlayerDecks(data || [])
    } catch (error) {
      console.error('Error fetching player decks:', error)
    }
  }

  const handleReady = async () => {
    if (!room || userRole === 'spectator') return

    const updateField = userRole === 'creator' ? 'creator_ready' : 'joiner_ready'
    const currentValue = userRole === 'creator' ? room.creator_ready : room.joiner_ready
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ [updateField]: !currentValue })
        .eq('id', roomId!)

      if (error) throw error
      setIsReady(!currentValue)
    } catch (error) {
      console.error('Error updating ready status:', error)
      toast({
        title: "Error",
        description: "Failed to update ready status.",
        variant: "destructive"
      })
    }
  }

  const startDraft = async () => {
    if (!room) return

    try {
      // Update room status to drafting
      await supabase
        .from('rooms')
        .update({ status: 'drafting', current_round: 1 })
        .eq('id', roomId!)

      // Generate initial cards for round 1
      generateRoundCards(1)
    } catch (error) {
      console.error('Error starting draft:', error)
    }
  }

  const generateRoundCards = async (round: number) => {
    if (!roomId || !room) return

    try {
      // Get used cards from previous rounds
      const { data: usedCardsData } = await supabase
        .from('room_cards')
        .select('card_id')
        .eq('room_id', roomId)

      const usedCards = new Set(usedCardsData?.map(card => card.card_id) || [])

      // Determine round type (only for default draft type)
      if (room.draft_type === 'default') {
        const legendaryRound = Math.floor(Math.random() * 13) + 1
        const spellRound = Math.floor(Math.random() * 12) + 1
        const adjustedSpellRound = spellRound >= legendaryRound ? spellRound + 1 : spellRound

        const isLegendaryRound = round === legendaryRound
        const isSpellRound = round === adjustedSpellRound

        // Generate cards based on round type
        const { generateDraftChoices } = await import('@/utils/cardData')
        const usedCardIds = Array.from(usedCards)
        const choices = generateDraftChoices(usedCardIds)
        
        if (!choices) return
        
        // Assign 2 cards to creator side and 2 to joiner side
        const creatorCards = choices.cards.slice(0, 2)
        const joinerCards = choices.cards.slice(2, 4)

        const roomCardsData = [
          ...creatorCards.map((card) => ({
            room_id: roomId,
            round_number: round,
            side: 'creator',
            card_id: card.id,
            card_name: card.name,
            card_image: card.image,
            is_legendary: card.isLegendary,
            selected_by: null
          })),
          ...joinerCards.map((card) => ({
            room_id: roomId,
            round_number: round,
            side: 'joiner',
            card_id: card.id,
            card_name: card.name,
            card_image: card.image,
            is_legendary: card.isLegendary,
            selected_by: null
          }))
        ]

        const { error } = await supabase
          .from('room_cards')
          .insert(roomCardsData)

        if (error) throw error
      } else {
        // For other draft types, use simple random selection for now
        const { getRandomCards } = await import('@/utils/cardData')
        const availableCards = (await import('@/utils/cardData')).cardDatabase.filter(
          card => card.cost !== undefined && !usedCards.has(card.id)
        )
        
        const cards = getRandomCards(4, Array.from(usedCards))
        
        const creatorCards = cards.slice(0, 2)
        const joinerCards = cards.slice(2, 4)

        const roomCardsData = [
          ...creatorCards.map((card) => ({
            room_id: roomId,
            round_number: round,
            side: 'creator',
            card_id: card.id,
            card_name: card.name,
            card_image: card.image,
            is_legendary: card.isLegendary || false,
            selected_by: null
          })),
          ...joinerCards.map((card) => ({
            room_id: roomId,
            round_number: round,
            side: 'joiner',
            card_id: card.id,
            card_name: card.name,
            card_image: card.image,
            is_legendary: card.isLegendary || false,
            selected_by: null
          }))
        ]

        const { error } = await supabase
          .from('room_cards')
          .insert(roomCardsData)

        if (error) throw error
      }

      // Start the 15-second timer
      startRoundTimer()
    } catch (error) {
      console.error('Error generating round cards:', error)
      toast({
        title: "Error",
        description: "Failed to generate cards for this round.",
        variant: "destructive"
      })
    }
  }

  const startRoundTimer = () => {
    setTimeLeft(15)
    setIsSelectionLocked(false)
    setSelectedCard(null)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          lockSelections()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const lockSelections = async () => {
    setIsSelectionLocked(true)
    
    // Process selections and move to next round or end draft
    setTimeout(() => {
      processRoundEnd()
    }, 3000) // Show selections for 3 seconds
  }

  const processRoundEnd = async () => {
    if (!room || !roomId) return

    try {
      const currentRound = room.current_round
      
      // Get current round cards with selections
      const currentRoundCards = roomCards.filter(card => 
        card.round_number === currentRound && card.selected_by
      )

      // Add selected cards to player decks
      for (const card of currentRoundCards) {
        await supabase
          .from('player_decks')
          .insert({
            room_id: roomId,
            player_side: card.selected_by!,
            card_id: card.card_id,
            card_name: card.card_name,
            card_image: card.card_image,
            is_legendary: card.is_legendary,
            selection_order: currentRound
          })
      }

      // Check if draft is complete (13 rounds)
      if (currentRound >= 13) {
        await supabase
          .from('rooms')
          .update({ status: 'completed' })
          .eq('id', roomId)
      } else {
        // Move to next round
        const nextRound = currentRound + 1
        await supabase
          .from('rooms')
          .update({ current_round: nextRound })
          .eq('id', roomId)
        
        generateRoundCards(nextRound)
      }
    } catch (error) {
      console.error('Error processing round end:', error)
    }
  }

  const handleCardSelect = async (cardId: string) => {
    if (!room || isSelectionLocked || !roomId || userRole === 'spectator') return

    const playerSide = userRole
    
    setSelectedCard(cardId)

    try {
      // Update the selected card in the database
      await supabase
        .from('room_cards')
        .update({ selected_by: playerSide })
        .eq('room_id', roomId)
        .eq('card_id', cardId)
        .eq('round_number', room.current_round)
    } catch (error) {
      console.error('Error selecting card:', error)
    }
  }

  const handleBackToHome = async () => {
    if (!roomId) return

    try {
      // Log the room data before deletion
      const roomData = {
        room_id: roomId,
        cards_presented: roomCards,
        player_choices: playerDecks,
        completed_at: new Date().toISOString()
      }
      
      console.log('Room data logged:', roomData)
      // In a real app, you'd send this to a logging service

      // Delete room and associated data
      await supabase.from('player_decks').delete().eq('room_id', roomId)
      await supabase.from('room_cards').delete().eq('room_id', roomId)
      await supabase.from('rooms').delete().eq('id', roomId)

      navigate('/')
    } catch (error) {
      console.error('Error deleting room:', error)
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-primary">Loading...</div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-destructive">Room not found</div>
      </div>
    )
  }

  const getDraftTypeDisplay = (type: string) => {
    switch (type) {
      case 'default': return 'Default'
      case 'triple': return 'Triple Draft'
      case 'mega': return 'Mega Draft'
      default: return type
    }
  }

  const currentRoundCards = roomCards.filter(card => 
    card.round_number === room?.current_round && card.side === userRole
  )
  const creatorDeck = playerDecks.filter(card => card.player_side === 'creator')
  const joinerDeck = playerDecks.filter(card => card.player_side === 'joiner')

  return (
    <div className="min-h-screen bg-white">
      {/* Header with wave */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 relative">
        <div className="py-6 px-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-1">Project O Draft Battle</h1>
              <p className="text-lg md:text-xl">Draft Type: {getDraftTypeDisplay(room.draft_type)}</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
        <svg viewBox="0 0 1200 120" className="w-full h-auto">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path 
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,112C960,117,1056,107,1152,90.7C1248,75,1344,53,1392,42.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" 
            fill="url(#wave-gradient)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!room.joiner_name ? (
          // Waiting for player
          <div className="text-center space-y-8">
            <div className="text-2xl md:text-3xl text-primary font-semibold">
              Waiting for a player to join the room
            </div>
            <div className="text-xl md:text-2xl text-muted-foreground">
              Share this code: <span className="font-bold text-primary text-3xl tracking-wider">{room.id}</span>
            </div>
          </div>
        ) : room.status === 'waiting' ? (
          // Both players joined, waiting for ready
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[60vh]">
            {/* Creator Side */}
            <div className="border-r-2 lg:border-r-2 lg:border-b-0 border-b-2 border-muted lg:pr-8 pb-8 lg:pb-0">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-black">{room.creator_name}</h2>
                <div className="text-lg text-muted-foreground">Room Creator</div>
                
                <Button
                  onClick={handleReady}
                  variant={room.creator_ready ? "secondary" : "default"}
                  size="lg"
                  className="px-8 py-4 text-lg"
                  disabled={userRole !== 'creator'}
                >
                  {room.creator_ready ? "Ready ✓" : "Ready?"}
                </Button>
              </div>
            </div>

            {/* Joiner Side */}
            <div className="lg:pl-8 pt-8 lg:pt-0">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-black">{room.joiner_name}</h2>
                <div className="text-lg text-muted-foreground">Joined Player</div>
                
                <Button
                  onClick={handleReady}
                  variant={room.joiner_ready ? "secondary" : "default"}
                  size="lg"
                  className="px-8 py-4 text-lg"
                  disabled={userRole !== 'joiner'}
                >
                  {room.joiner_ready ? "Ready ✓" : "Ready?"}
                </Button>
              </div>
            </div>

            {/* Ready Status */}
            <div className="col-span-full text-center mt-12">
              <div className="text-xl text-muted-foreground mb-4">
                Waiting for both players to be ready...
              </div>
              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${room.creator_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-black">{room.creator_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${room.joiner_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-black">{room.joiner_name}</span>
                </div>
              </div>
              
              {room.creator_ready && room.joiner_ready && (
                <div className="mt-8 text-2xl font-bold text-primary animate-pulse">
                  Starting Draft...
                </div>
              )}
            </div>
          </div>
        ) : room.status === 'drafting' ? (
          // Draft in progress
          <div className="space-y-8">
            {/* Draft Status */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-black">
                Round {room.current_round} of 13
              </h2>
              {!isSelectionLocked ? (
                <div className="space-y-2">
                  <p className="text-lg text-black">Choose your card!</p>
                  <div className="text-2xl font-bold text-primary">
                    {timeLeft}s remaining
                  </div>
                </div>
              ) : (
                <p className="text-lg text-black">Revealing selections...</p>
              )}
            </div>

            {/* Card Selection */}
            <div className="grid grid-cols-1 gap-8">
              {/* Player's cards */}
              {userRole !== 'spectator' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center text-black">
                    {userRole === 'creator' ? room.creator_name : room.joiner_name}'s Cards
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentRoundCards.map((card) => (
                      <DraftCard
                        key={card.id}
                        cardId={card.card_id}
                        cardName={card.card_name}
                        cardImage={card.card_image}
                        isLegendary={card.is_legendary}
                        isSelected={selectedCard === card.card_id || (isSelectionLocked && card.selected_by === userRole)}
                        onSelect={() => handleCardSelect(card.card_id)}
                        disabled={isSelectionLocked}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show all cards for spectators or opponent's cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Creator's cards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center text-black">
                    {room.creator_name}'s Cards
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {roomCards
                      .filter(card => 
                        card.round_number === room.current_round && 
                        card.side === 'creator'
                      )
                      .map((card) => (
                        <DraftCard
                          key={card.id}
                          cardId={card.card_id}
                          cardName={card.card_name}
                          cardImage={card.card_image}
                          isLegendary={card.is_legendary}
                          isSelected={isSelectionLocked && !!card.selected_by}
                          onSelect={() => {}}
                          disabled={true}
                        />
                      ))}
                  </div>
                </div>

                {/* Joiner's cards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center text-black">
                    {room.joiner_name}'s Cards
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {roomCards
                      .filter(card => 
                        card.round_number === room.current_round && 
                        card.side === 'joiner'
                      )
                      .map((card) => (
                        <DraftCard
                          key={card.id}
                          cardId={card.card_id}
                          cardName={card.card_name}
                          cardImage={card.card_image}
                          isLegendary={card.is_legendary}
                          isSelected={isSelectionLocked && !!card.selected_by}
                          onSelect={() => {}}
                          disabled={true}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Player Decks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
              <DeckDisplay
                cards={creatorDeck.map(card => ({
                  card_id: card.card_id,
                  card_name: card.card_name,
                  card_image: card.card_image,
                  is_legendary: card.is_legendary,
                  selection_order: card.selection_order
                }))}
                playerName={room.creator_name}
                isOwn={userRole === 'creator'}
              />
              <DeckDisplay
                cards={joinerDeck.map(card => ({
                  card_id: card.card_id,
                  card_name: card.card_name,
                  card_image: card.card_image,
                  is_legendary: card.is_legendary,
                  selection_order: card.selection_order
                }))}
                playerName={room.joiner_name}
                isOwn={userRole === 'joiner'}
              />
            </div>
          </div>
        ) : room.status === 'completed' ? (
          // Draft completed
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Draft Complete!
              </h2>
              <p className="text-xl text-black">Good luck, have fun!</p>
            </div>

            {/* Final Decks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DeckDisplay
                cards={creatorDeck.map(card => ({
                  card_id: card.card_id,
                  card_name: card.card_name,
                  card_image: card.card_image,
                  is_legendary: card.is_legendary,
                  selection_order: card.selection_order
                }))}
                playerName={room.creator_name}
                isOwn={userRole === 'creator'}
              />
              <DeckDisplay
                cards={joinerDeck.map(card => ({
                  card_id: card.card_id,
                  card_name: card.card_name,
                  card_image: card.card_image,
                  is_legendary: card.is_legendary,
                  selection_order: card.selection_order
                }))}
                playerName={room.joiner_name}
                isOwn={userRole === 'joiner'}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Room