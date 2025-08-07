import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WaveDivider } from "@/components/ui/wave-divider"
import { supabase, getSupabaseWithSession } from "@/integrations/supabase/client"
import { createClient } from '@supabase/supabase-js'
import { toast } from "@/hooks/use-toast"
import { DraftCard } from "@/components/DraftCard"
import { DeckDisplay } from "@/components/DeckDisplay"
import { getRandomCards, getCardById } from "@/utils/cardData"
import { generateTripleDraftChoice } from "@/utils/tripleDraftCards"
import { generateMegaDraftCards } from "@/utils/megaDraftCards"
import { TripleDraftCards } from "@/components/TripleDraftCards"
import { MegaDraftGrid } from "@/components/MegaDraftGrid"
import { ArrowLeft } from "lucide-react"

// Helper functions for secure session management
const generateSessionToken = () => {
  return 'session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
}

const getUserSessionId = () => {
  let sessionId = sessionStorage.getItem('userSessionId')
  if (!sessionId) {
    sessionId = generateSessionToken()
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
  round_start_time: string | null
  round_duration_seconds: number
  current_turn_player?: string | null
  mega_draft_cards?: string[]
  first_pick_player?: string | null
  mega_draft_turn_count?: number
  current_phase?: string
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
  const [isSelectionLocked, setIsSelectionLocked] = useState(false)
  const [userSessionId] = useState(getUserSessionId())
  const [userRole, setUserRole] = useState<'creator' | 'joiner' | 'spectator'>('spectator')
  const [isStartingDraft, setIsStartingDraft] = useState(false)
  const [backgroundAutoSelectTimeout, setBackgroundAutoSelectTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isProcessingRound, setIsProcessingRound] = useState(false)
  const [isProcessingSelection, setIsProcessingSelection] = useState<boolean>(false)
  const [megaDraftCards, setMegaDraftCards] = useState<any[]>([])
  const [megaDraftTurnSequence, setMegaDraftTurnSequence] = useState<string[]>([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)

  const extendSession = async () => {
    const sessionId = sessionStorage.getItem('userSessionId')
    if (!sessionId) return
    
    try {
      const supabaseWithToken = getSupabaseWithSession()
      await supabaseWithToken.rpc('extend_session_expiry', { 
        session_token_param: sessionId 
      })
    } catch (error) {
      console.error('Failed to extend session:', error)
    }
  }
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [showReveal, setShowReveal] = useState(false)

  const handleTimeUp = async () => {
    if (isSelectionLocked || isProcessingRound || isProcessingSelection) return
    
    setIsSelectionLocked(true)
    setShowReveal(true)
    
    // Add 0.5s delay to prevent double selection for ALL draft types
    setTimeout(() => {
      // Check if user has made a manual selection after delay
      let currentRoundCards: RoomCard[] = []
      
      if (room?.draft_type === 'default') {
        currentRoundCards = roomCards.filter(card => 
          card.round_number === room?.current_round && card.side === userRole
        )
      } else if (room?.draft_type === 'triple') {
        currentRoundCards = roomCards.filter(card => 
          card.round_number === room?.current_round
        )
      } else if (room?.draft_type === 'mega') {
        currentRoundCards = roomCards.filter(card => 
          card.round_number === 1
        )
      }
      
      const hasManualSelection = selectedCard || currentRoundCards.some(card => card.selected_by === userRole)
      
      // Only auto-select if no manual selection exists
      if (!hasManualSelection && userRole !== 'spectator') {
        autoSelectRandomCard()
      }
    }, 500)
    
    if (userRole === 'creator' && !isProcessingRound) {
      setTimeout(() => {
        if (!isProcessingRound) {
          processRoundEnd()
        }
      }, 3000)
    }
  }

  // Centralized timer effect
  useEffect(() => {
    if (room?.status === 'drafting' && room.round_start_time) {
      const updateTimer = () => {
        const now = new Date()
        const roundStart = new Date(room.round_start_time!)
        const elapsed = (now.getTime() - roundStart.getTime()) / 1000
        // Get duration based on draft type
        let roundDuration = room.round_duration_seconds || 15
        if (room.draft_type === 'triple') roundDuration = 8
        if (room.draft_type === 'mega') roundDuration = 10
        const remaining = Math.max(0, roundDuration - elapsed)
        
        setTimeRemaining(remaining)
        
        if (remaining <= 0 && !isSelectionLocked) {
          setIsSelectionLocked(true)
          handleTimeUp()
        }
      }

      // Update immediately
      updateTimer()
      
      // Set up interval
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = setInterval(updateTimer, 1000) // Update every second

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
        }
      }
    }
  }, [room?.status, room?.round_start_time, room?.current_round, isSelectionLocked])

  useEffect(() => {
    if (room?.current_round && room?.status === 'drafting' && userRole !== 'spectator') {
      setSelectedCard(null)
      setIsSelectionLocked(false)
      setShowReveal(false)
      setIsProcessingRound(false)
      
      if (backgroundAutoSelectTimeout) {
        clearTimeout(backgroundAutoSelectTimeout)
        setBackgroundAutoSelectTimeout(null)
      }
    }
  }, [room?.current_round, room?.status, userRole])

  useEffect(() => {
    if (!roomId) return

    // Fetch initial room data
    fetchRoom()
    fetchRoomCards()
    fetchPlayerDecks()

    // Subscribe to room changes with realtime
    const roomChannel = supabase
      .channel(`room-${roomId}`)
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
            
            const role = getUserRole(updatedRoom, userSessionId)
            setUserRole(role)
            
            if (updatedRoom.creator_ready && updatedRoom.joiner_ready && updatedRoom.status === 'waiting') {
              setIsStartingDraft(true)
              
              if (role === 'creator') {
                setTimeout(() => {
                  startDraft(updatedRoom)
                  setIsStartingDraft(false)
                }, 5000)
              } else {
                setTimeout(() => {
                  setIsStartingDraft(false)
                }, 5000)
              }
            }
          }
        }
      )
      .subscribe()

    // Subscribe to room cards changes
    const cardsChannel = supabase
      .channel(`room-cards-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_cards',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log(`${userRole}: Room cards update:`, payload.eventType)
          fetchRoomCards()
        }
      )
      .subscribe()

    // Subscribe to player decks changes
    const decksChannel = supabase
      .channel(`player-decks-${roomId}`)
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
      if (backgroundAutoSelectTimeout) {
        clearTimeout(backgroundAutoSelectTimeout)
      }
    }
  }, [roomId, userSessionId])

  // Expire room after 30 minutes when draft is completed
  useEffect(() => {
    if (room?.status === 'completed') {
      const expireTimer = setTimeout(async () => {
        try {
          await supabase.from('rooms').delete().eq('id', roomId)
          await supabase.from('room_cards').delete().eq('room_id', roomId)
          await supabase.from('player_decks').delete().eq('room_id', roomId)
          await supabase.from('game_sessions').delete().eq('room_id', roomId)
          navigate('/')
        } catch (error) {
          console.error('Error expiring room:', error)
        }
      }, 30 * 60 * 1000) // 30 minutes

      return () => clearTimeout(expireTimer)
    }
  }, [room?.status, roomId, navigate])

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
      
      // Determine user role based on session storage flags
      if (data) {
        const role = getUserRole(data, userSessionId)
        setUserRole(role)
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
    
    // Prevent interaction once both are ready
    if (room.creator_ready && room.joiner_ready) return

    const updateField = userRole === 'creator' ? 'creator_ready' : 'joiner_ready'
    const currentValue = userRole === 'creator' ? room.creator_ready : room.joiner_ready
    
    try {
      // Create authenticated client to bypass RLS restrictions
      const supabaseWithToken = getSupabaseWithSession()

      const { data: existingSession, error: sessionError } = await supabaseWithToken
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomId!)
        .eq('session_token', userSessionId)
        .eq('player_role', userRole)
        .maybeSingle()

      if (!existingSession) {
        throw new Error(`No valid session found. Please refresh and try again.`)
      }

      const { data: updateData, error } = await supabaseWithToken
        .from('rooms')
        .update({ [updateField]: !currentValue })
        .eq('id', roomId!)
        .select()

      if (error) {
        throw error
      }
      
      if (updateData && updateData.length === 0) {
        throw new Error('Failed to update room - permission denied')
      }
      setIsReady(!currentValue)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ready status.",
        variant: "destructive"
      })
    }
  }

  const startDraft = async (roomData?: Room) => {
    const currentRoom = roomData || room
    if (!currentRoom) {
      return
    }

    try {
      const supabaseWithToken = getSupabaseWithSession()
      
      const { data: response, error: cardError } = await supabase.functions.invoke('generate-round-cards', {
        body: { 
          roomId,
          round: 'all',
          usedCardIds: [],
          draftType: currentRoom.draft_type
        }
      })

      if (cardError) {
        throw cardError
      }
      
      const { data: updateData, error } = await supabaseWithToken
        .from('rooms')
        .update({ 
          status: 'drafting', 
          current_round: 1,
          round_start_time: new Date().toISOString()
        })
        .eq('id', roomId!)
        .select()

      if (error) {
        toast({
          title: "Error",
          description: "Failed to start draft. Please refresh and try again.",
          variant: "destructive"
        })
        throw error
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start draft. Please refresh and try again.",
        variant: "destructive"
      })
    }
  }

  // Removed redundant generateRoundCards function - all cards are generated at draft start

  const startCentralizedRoundTimer = async () => {
    if (!roomId || userRole !== 'creator') return

    try {
      const supabaseWithToken = getSupabaseWithSession()

      // Set round start time in database
      await supabaseWithToken
        .from('rooms')
        .update({ 
          round_start_time: new Date().toISOString() 
        })
        .eq('id', roomId)

    } catch (error) {
      // Silent error for timer sync
    }
  }


  const autoSelectRandomCard = async () => {
    if (!room || !roomId || userRole === 'spectator') {
      return
    }

    // CRITICAL FIX: Check if user has already selected manually first
    if (selectedCard) {
      if (room.draft_type === 'triple') {
        console.log('🔹 TRIPLE: Auto-select skipped - User has manual selection in state')
      }
      return
    }

    let currentRoundCards: RoomCard[] = []

    // Handle different draft types for auto-selection
    if (room.draft_type === 'default') {
      currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round && card.side === userRole
      )
    } else if (room.draft_type === 'triple') {
      // For triple draft, all cards are in the middle (no sides)
      currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round
      )
    } else if (room.draft_type === 'mega') {
      // For mega draft, all cards are in round 1
      currentRoundCards = roomCards.filter(card => 
        card.round_number === 1
      )
    }
    
    // CRITICAL: Real-time check for manual selection
    const userSelectedCard = currentRoundCards.find(card => card.selected_by === userRole)
    if (userSelectedCard) {
      if (room.draft_type === 'triple') {
        console.log('🔹 TRIPLE: Auto-select skipped - Database shows manual selection exists')
      }
      setSelectedCard(userSelectedCard.card_id)
      return
    }

    // CRITICAL: Final fresh database check to prevent race condition
    try {
      const supabaseWithToken = getSupabaseWithSession()
      let freshCheck: any[] = []
      
      if (room.draft_type === 'default') {
        const { data, error: checkError } = await supabaseWithToken
          .from('room_cards')
          .select('*')
          .eq('room_id', roomId)
          .eq('round_number', room.current_round)
          .eq('side', userRole)
          .eq('selected_by', userRole)
        freshCheck = data || []
      } else {
        // For triple and mega draft, check if user has selected any card in this round
        const { data, error: checkError } = await supabaseWithToken
          .from('room_cards')
          .select('*')
          .eq('room_id', roomId)
          .eq('round_number', room.draft_type === 'mega' ? 1 : room.current_round)
          .eq('selected_by', userRole)
        freshCheck = data || []
      }
      
      if (freshCheck && freshCheck.length > 0) {
        if (room.draft_type === 'triple') {
          console.log('🔹 TRIPLE: Auto-select skipped - Fresh database check shows manual selection exists')
        }
        setSelectedCard(freshCheck[0].card_id)
        return
      }
    } catch (error) {
      // If we can't check, don't auto-select to be safe
      return
    }

    if (currentRoundCards.length === 0) {
      try {
        const supabaseWithToken = getSupabaseWithSession()
        const { data: freshCards, error: fetchError } = await supabaseWithToken
          .from('room_cards')
          .select('*')
          .eq('room_id', roomId)
          .eq('round_number', room.draft_type === 'mega' ? 1 : room.current_round)
        
        if (!fetchError && freshCards && freshCards.length > 0) {
          currentRoundCards = freshCards
          // Re-check for existing selection after fresh fetch
          const existingSelection = freshCards.find(card => card.selected_by === userRole)
          if (existingSelection) {
            console.log('🚫 Auto-select skipped: Fresh fetch shows manual selection')
            setSelectedCard(existingSelection.card_id)
            return
          }
        } else {
          return
        }
      } catch (error) {
        console.error('Error fetching cards for auto-selection:', error)
        return
      }
    }

    // Get available cards for this user to select
    const availableCards = currentRoundCards.filter(card => !card.selected_by)
    
    // Check if user already has legendary in their deck (for mega draft)
    if (room.draft_type === 'mega') {
      const userDeck = playerDecks.filter(card => card.player_side === userRole)
      const hasLegendary = userDeck.some(card => card.is_legendary)
      
      if (hasLegendary) {
        // Filter out legendary cards if user already has one
        const nonLegendaryCards = availableCards.filter(card => !card.is_legendary)
        if (nonLegendaryCards.length > 0) {
          const randomCard = nonLegendaryCards[Math.floor(Math.random() * nonLegendaryCards.length)]
          await performAutoSelect(randomCard)
          return
        }
      }
      
      // If it's the last card and no legendary, force select a legendary
      if (userDeck.length === 12 && !hasLegendary) {
        const legendaryCards = availableCards.filter(card => card.is_legendary)
        if (legendaryCards.length > 0) {
          const randomCard = legendaryCards[Math.floor(Math.random() * legendaryCards.length)]
          await performAutoSelect(randomCard)
          return
        }
      }
    }
    
    if (availableCards.length === 0) {
      console.log('🚫 Auto-select skipped: No available cards (all selected)')
      return
    }

    const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)]
    await performAutoSelect(randomCard)
  }

  const performAutoSelect = async (card: RoomCard) => {
    try {
      const supabaseWithToken = getSupabaseWithSession()
      
      await supabaseWithToken
        .from('room_cards')
        .update({ selected_by: userRole })
        .eq('room_id', roomId)
        .eq('card_id', card.card_id)
        .eq('round_number', room?.draft_type === 'mega' ? 1 : room?.current_round)
      
      setSelectedCard(card.card_id)
      console.log('✅ Auto-selected fallback card:', card.card_name)
    } catch (error) {
      console.error('Error auto-selecting card:', error)
    }
  }

  const processRoundEnd = async () => {
    console.log('🔄 PROCESS ROUND END CALLED')
    console.log('Room:', room?.id, 'Round:', room?.current_round, 'User Role:', userRole, 'Is Processing:', isProcessingRound)
    
    if (!room || !roomId || isProcessingRound) {
      console.log('❌ Process round end blocked - missing data or already processing')
      return
    }

    // CRITICAL FIX: Only the creator should process the round end
    if (userRole !== 'creator') {
      console.log('❌ Process round end blocked - user is not creator')
      return
    }

    // ADDITIONAL SAFEGUARD: Double-check if we're already processing
    if (isProcessingRound) {
      console.log('❌ Process round end blocked - race condition detected')
      return
    }

    setIsProcessingRound(true)
    console.log('🟡 Setting isProcessingRound to true')
    
    await extendSession()
    
    try {
      const supabaseWithToken = getSupabaseWithSession()
      const currentRound = room.current_round
      
      // DEBUGGING FOR ROUND 6 SPECIFICALLY
      if (currentRound === 6) {
        console.log('🔍 ROUND 6 DEBUG - Processing round end')
        console.log('🔍 ROUND 6 DEBUG - Room ID:', roomId)
        console.log('🔍 ROUND 6 DEBUG - Current round:', currentRound)
        console.log('🔍 ROUND 6 DEBUG - User role:', userRole)
      }
      
      const { data: allCurrentRoundCards, error: fetchError } = await supabaseWithToken
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .eq('round_number', currentRound)

      if (fetchError) {
        console.error('❌ Error fetching current round cards:', fetchError)
        return
      }

      console.log(`📋 Found ${allCurrentRoundCards?.length || 0} cards for round ${currentRound}`)
      
      const selectedCards = allCurrentRoundCards ? allCurrentRoundCards.filter(card => card.selected_by) : []
      console.log(`✅ Found ${selectedCards.length} selected cards:`, selectedCards.map(c => `${c.card_id} by ${c.selected_by}`))

      // CRITICAL: Check if both players have made selections
      const creatorSelected = selectedCards.find(card => card.selected_by === 'creator')
      const joinerSelected = selectedCards.find(card => card.selected_by === 'joiner')
      
      if (currentRound === 6) {
        console.log('🔍 ROUND 6 DEBUG - Creator selected:', creatorSelected?.card_id || 'NONE')
        console.log('🔍 ROUND 6 DEBUG - Joiner selected:', joinerSelected?.card_id || 'NONE')
      }

      // Both players must have selected before proceeding
      if (!creatorSelected || !joinerSelected) {
        console.log(`⏳ Waiting for selections - Creator: ${creatorSelected ? '✅' : '❌'}, Joiner: ${joinerSelected ? '✅' : '❌'}`)
        setIsProcessingRound(false)
        return
      }

      const { data: existingDeckCards } = await supabaseWithToken
        .from('player_decks')
        .select('card_id, player_side')
        .eq('room_id', roomId)
        .eq('selection_order', currentRound)

      const existingKeys = new Set(
        existingDeckCards?.map(c => `${c.card_id}_${c.player_side}`) || []
      )

      console.log(`💾 Adding ${selectedCards.length} cards to player decks...`)
      for (const card of selectedCards) {
        const cardKey = `${card.card_id}_${card.selected_by}`
        
        if (!existingKeys.has(cardKey)) {
          const { error: deckError } = await supabaseWithToken
            .from('player_decks')
            .insert({
              room_id: roomId,
              player_side: card.selected_by,
              card_id: card.card_id,
              card_name: card.card_name,
              card_image: card.card_image,
              is_legendary: card.is_legendary,
              selection_order: currentRound
            })
          
          if (deckError) {
            console.error('❌ Error adding card to deck:', deckError)
          } else {
            console.log(`✅ Added ${card.card_id} to ${card.selected_by} deck`)
          }
        }
      }

      // Handle different draft types
      if (room.draft_type === 'mega') {
        // Mega draft: advance turn count and check completion
        const newTurnCount = (room.mega_draft_turn_count || 0) + 1;
        const isComplete = newTurnCount >= 24; // 12 picks each

        console.log(`🎯 Mega draft turn ${newTurnCount}/24`)
        
        if (isComplete) {
          console.log('🏁 Mega draft complete - setting status to completed')
          await supabaseWithToken
            .from('rooms')
            .update({ status: 'completed' })
            .eq('id', roomId)
        } else {
          // Continue mega draft
          const nextRoundStartTime = new Date().toISOString()
          const { error: updateError } = await supabaseWithToken
            .from('rooms')
            .update({ 
              mega_draft_turn_count: newTurnCount,
              round_start_time: nextRoundStartTime
            })
            .eq('id', roomId)
          
          if (updateError) {
            console.error('❌ Error updating mega draft turn:', updateError)
          } else {
            console.log(`✅ Successfully advanced to mega draft turn ${newTurnCount}`)
          }
        }
      } else if (room.draft_type === 'triple') {
        // TRIPLE DRAFT: Show reveal phase, then advance to next round
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        console.log('🔷 TRIPLE: Starting reveal phase for 2 seconds')
        
        setTimeout(async () => {
          console.log('🔷 TRIPLE: Reveal phase complete, advancing to next round')
          
          if (currentRound >= 13) {
            // Draft is complete
            console.log('🔷 TRIPLE: Draft complete!')
            await supabaseWithToken
              .from('rooms')
              .update({ status: 'completed' })
              .eq('id', roomId)
          } else {
            // Advance to next round
            const nextRound = currentRound + 1
            const nextRoundStartTime = new Date().toISOString()
            
            console.log(`🔷 TRIPLE: Advancing from round ${currentRound} to ${nextRound}`)
            
            const { error: updateError } = await supabaseWithToken
              .from('rooms')
              .update({ 
                current_round: nextRound,
                round_start_time: nextRoundStartTime
              })
              .eq('id', roomId)
            
            if (updateError) {
              console.error('🔷 TRIPLE: Error advancing round:', updateError)
            } else {
              console.log(`🔷 TRIPLE: Successfully advanced to round ${nextRound}`)
            }
          }
          
          // Reset UI state after round advancement
          setIsSelectionLocked(false)
          setShowReveal(false)
          setIsRevealing(false)
          setSelectedCard(null)
        }, 2000) // 2 second reveal phase
      } else {
        // Default draft: round-based progression
        const totalRounds = 13;
        
        if (currentRound >= totalRounds) {
          console.log('🏁 Draft complete - setting status to completed')
          await supabaseWithToken
            .from('rooms')
            .update({ status: 'completed' })
            .eq('id', roomId)
        } else {
          const nextRound = currentRound + 1
          const nextRoundStartTime = new Date().toISOString()
          
          console.log(`⏭️ Advancing to round ${nextRound}`)
          
          const { error: updateError } = await supabaseWithToken
            .from('rooms')
            .update({ 
              current_round: nextRound,
              round_start_time: nextRoundStartTime
            })
            .eq('id', roomId)
            
          if (updateError) {
            console.error('❌ Error updating room for next round:', updateError)
          } else {
            console.log(`✅ Successfully advanced to round ${nextRound}`)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error processing round end:', error)
    } finally {
      console.log('🟢 Setting isProcessingRound to false')
      setIsProcessingRound(false)
    }
  }

  const handleCardSelect = async (cardId: string) => {
    if (room?.draft_type === 'triple') {
      console.log('🔷 TRIPLE: CARD SELECT CLICKED')
      console.log(`🔷 TRIPLE: Card ID: ${cardId}`)
      console.log(`🔷 TRIPLE: User Role: ${userRole}`)
      console.log(`🔷 TRIPLE: Is Selection Locked: ${isSelectionLocked}`)
      console.log(`🔷 TRIPLE: Current Selected Card: ${selectedCard}`)
      console.log(`🔷 TRIPLE: Current Round: ${room.current_round}`)
      console.log(`🔷 TRIPLE: Is My Turn: ${isMyTurn}`)
    }
    
    if (isSelectionLocked || userRole === 'spectator' || isProcessingSelection) {
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Selection blocked - locked, spectator, or processing')
      }
      return
    }

    // CRITICAL: For triple draft, check if it's the user's turn
    if (room?.draft_type === 'triple') {
      if (!isMyTurn) {
        console.log('🔷 TRIPLE: Selection blocked - not user\'s turn in triple draft')
        return
      }
    }

    // Additional check: verify time hasn't expired even if isSelectionLocked hasn't been updated yet
    if (room?.status === 'drafting' && room.round_start_time) {
      const now = new Date()
      const roundStart = new Date(room.round_start_time)
      const elapsed = (now.getTime() - roundStart.getTime()) / 1000
      let roundDuration = room.round_duration_seconds || 15
      if (room.draft_type === 'triple') roundDuration = 8
      if (room.draft_type === 'mega') roundDuration = 10
      const remaining = roundDuration - elapsed

      if (remaining <= 0) {
        if (room?.draft_type === 'triple') {
          console.log('🔷 TRIPLE: Selection blocked - time has expired')
        }
        return
      }
    }

    // For mega draft, immediately lock and reveal on selection
    if (room?.draft_type === 'mega') {
      if (selectedCard === cardId) {
        return
      }
    } else {
      // For default and triple draft, clicking the same card should NOT deselect it
      if (selectedCard === cardId) {
        if (room?.draft_type === 'triple') {
          console.log('🔷 TRIPLE: Same card clicked - keeping selection')
        }
        return
      }
    }

    if (room?.draft_type === 'triple') {
      console.log('🔷 TRIPLE: Setting new selection')
    }
    // Set processing flag to prevent race conditions with timer
    setIsProcessingSelection(true)
    
    // Update selected card immediately for instant UI feedback
    setSelectedCard(cardId)

    // Extend session when user interacts with the game
    await extendSession()

    try {
      const selectedCardData = roomCards.find(card => card.card_id === cardId)
      if (!selectedCardData) {
        console.log('Card data not found')
        return
      }

      console.log('Selected card data:', selectedCardData)

      // Create authenticated client for card selection
      const supabaseWithToken = getSupabaseWithSession()

      // Clear any previous selection for this user based on draft type
      console.log('Clearing previous selections for user:', userRole)
      
      if (room?.draft_type === 'default') {
        // Default draft: clear previous selection for this user's side
        await supabaseWithToken
          .from('room_cards')
          .update({ selected_by: null })
          .eq('room_id', roomId)
          .eq('side', userRole)
          .eq('round_number', room?.current_round)
          .not('selected_by', 'is', null)
      } else {
        // Triple/Mega draft: clear any previous selection by this user in this round
        const roundToCheck = room?.draft_type === 'mega' ? 1 : room?.current_round
        await supabaseWithToken
          .from('room_cards')
          .update({ selected_by: null })
          .eq('room_id', roomId)
          .eq('round_number', roundToCheck)
          .eq('selected_by', userRole)
      }

      // Set new selection
      console.log('Setting new selection in database')
      const roundToUpdate = room?.draft_type === 'mega' ? 1 : room?.current_round
      const { error } = await supabaseWithToken
        .from('room_cards')
        .update({ selected_by: userRole })
        .eq('room_id', roomId)
        .eq('card_id', cardId)
        .eq('round_number', roundToUpdate)

      if (error) {
        console.error('Error updating card selection:', error)
        setSelectedCard(null) // Reset on error
        return
      }

      console.log('✅ Manual selection confirmed:', cardId)
      
      // For triple draft, handle turn progression
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Card selected, showing 2-second highlight')
        
        // Show selection highlight for 2 seconds
        setTimeout(async () => {
          console.log('🔷 TRIPLE: Highlight phase complete, checking for round end')
          
          // Check if both players have selected
          const { data: freshCards } = await supabaseWithToken
            .from('room_cards')
            .select('*')
            .eq('room_id', roomId)
            .eq('round_number', room.current_round)
          
          const selectedCards = freshCards?.filter(card => card.selected_by) || []
          console.log(`🔷 TRIPLE: Found ${selectedCards.length} selected cards`)
          
          // If both have selected and I'm the creator, process round end
          if (selectedCards.length >= 2 && userRole === 'creator' && !isProcessingRound) {
            console.log('🔷 TRIPLE: Both players selected, creator processing round end')
            // Add a small delay to prevent race conditions
            setTimeout(() => {
              if (!isProcessingRound) {
                processRoundEnd()
              }
            }, 100)
          }
        }, 2000) // 2 second delay to show selection
      } else if (room?.draft_type === 'mega') {
        // For mega draft, immediately lock and start reveal phase
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        if (userRole === 'creator' && !isProcessingRound) {
          setTimeout(() => {
            if (!isProcessingRound) {
              processRoundEnd()
            }
          }, 1500) // Shorter delay for mega draft
        }
      }
    } catch (error) {
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Error in handleCardSelect:', error)
      }
      setSelectedCard(null) // Reset on error
    } finally {
      // Always clear the processing flag
      setIsProcessingSelection(false)
    }
  }

  const handleBackToHome = async () => {
    if (!roomId) return

    try {
      // Delete room and associated data
      await supabase.from('player_decks').delete().eq('room_id', roomId)
      await supabase.from('room_cards').delete().eq('room_id', roomId)
      await supabase.from('rooms').delete().eq('id', roomId)

      navigate('/')
    } catch (error) {
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

  // Determine current turn for triple draft
  const isMyTurn = (() => {
    if (!room || room.status !== 'drafting') return false
    if (room.draft_type !== 'triple') return true
    if (isRevealing) return false // No turns during reveal phase
    
    const roundCards = roomCards.filter(card => card.round_number === room.current_round)
    const selectedCards = roundCards.filter(card => card.selected_by)
    
    // If no selections yet, creator goes first
    if (selectedCards.length === 0) {
      return userRole === 'creator'
    }
    
    // If one selection made, the other player goes
    if (selectedCards.length === 1) {
      const whoSelected = selectedCards[0].selected_by
      return userRole !== whoSelected
    }
    
    // If both selected, nobody's turn (waiting for next round)
    return false
  })()

  // Get whose turn it is for triple draft display
  const currentTurnPlayer = (() => {
    if (!room || room.status !== 'drafting' || room.draft_type !== 'triple') return null
    if (isRevealing) return null
    
    const roundCards = roomCards.filter(card => card.round_number === room.current_round)
    const selectedCards = roundCards.filter(card => card.selected_by)
    
    // If no selections yet, creator goes first
    if (selectedCards.length === 0) {
      return 'creator'
    }
    
    // If one selection made, the other player goes
    if (selectedCards.length === 1) {
      const whoSelected = selectedCards[0].selected_by
      return whoSelected === 'creator' ? 'joiner' : 'creator'
    }
    
    // If both selected, nobody's turn
    return null
  })()

  // For triple draft, show cards for "both" side, for others filter by user role
  const currentRoundCards = roomCards.filter(card => {
    if (!room?.current_round) return false
    
    if (room.draft_type === 'triple') {
      return card.round_number === room.current_round && card.side === 'both'
    } else {
      return card.round_number === room.current_round && card.side === userRole
    }
  })
  const creatorDeck = playerDecks.filter(card => card.player_side === 'creator')
  const joinerDeck = playerDecks.filter(card => card.player_side === 'joiner')

  return (
    <div className="min-h-screen bg-white">
      {/* Header with gradient wave */}
      <div className="relative">
        <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] py-3 px-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button
              onClick={handleBackToHome}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-[hsl(var(--primary))] hover:scale-105 transition-all bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-center text-white">
              <h1 className="text-xl md:text-2xl font-bold mb-1">Project O Draft Battle</h1>
              <p className="text-sm md:text-base">Draft Type: {getDraftTypeDisplay(room.draft_type)}</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
      {!room.joiner_name && userRole === 'creator' ? (
        // Waiting for player (only show to creator)
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
          <div className="space-y-8">
            {/* Mobile-responsive layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[50vh]">
              {/* Creator Side */}
              <div className="flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-muted pb-8 md:pb-0 md:pr-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-black">{room.creator_name}</h2>
                  <div className="text-lg text-muted-foreground">Room Creator</div>
                  
                  <Button
                    onClick={handleReady}
                    variant={room.creator_ready ? "secondary" : "default"}
                    size="lg"
                    className="px-8 py-4 text-lg"
                    disabled={userRole !== 'creator' || (room.creator_ready && room.joiner_ready)}
                  >
                    {room.creator_ready ? "Ready ✓" : "Ready?"}
                  </Button>
                </div>
              </div>

              {/* Joiner Side */}
              <div className="flex flex-col items-center justify-center pt-8 md:pt-0 md:pl-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-black">{room.joiner_name}</h2>
                  <div className="text-lg text-muted-foreground">Joined Player</div>
                  
                  <Button
                    onClick={handleReady}
                    variant={room.joiner_ready ? "secondary" : "default"}
                    size="lg"
                    className="px-8 py-4 text-lg"
                    disabled={userRole !== 'joiner' || (room.creator_ready && room.joiner_ready)}
                  >
                    {room.joiner_ready ? "Ready ✓" : "Ready?"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Ready Status */}
            <div className="text-center">
              <div className="text-xl text-muted-foreground mb-4">
                Waiting for both players to be ready...
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${room.creator_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-black">{room.creator_name}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${room.joiner_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-black">{room.joiner_name}</span>
                </div>
              </div>
              
              {(room.creator_ready && room.joiner_ready) || isStartingDraft ? (
                <div className="mt-8 text-2xl font-bold text-primary animate-pulse">
                  Starting Draft...
                </div>
              ) : null}
            </div>
          </div>
        ) : room.status === 'drafting' ? (
          // Draft in progress - Different layouts based on draft type
          <div className="space-y-8">
            {room.draft_type === 'default' ? (
              // Default Draft Layout
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
                        {Math.ceil(timeRemaining)}s remaining
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg text-black">Revealing selections...</p>
                  )}
                </div>

                {/* Card Selection - Mobile responsive */}
                <div className="space-y-8">
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                          .sort((a, b) => a.card_id.localeCompare(b.card_id))
                          .map((card, index) => (
                            <DraftCard
                              key={`${card.id}-${index}`}
                              cardId={card.card_id}
                              cardName={card.card_name}
                              cardImage={card.card_image}
                              isLegendary={card.is_legendary}
                              isSelected={
                                isSelectionLocked 
                                  ? card.selected_by === 'creator'
                                  : (userRole === 'creator' ? selectedCard === card.card_id : false)
                              }
                              onSelect={() => userRole === 'creator' ? handleCardSelect(card.card_id) : {}}
                              disabled={isSelectionLocked || userRole !== 'creator'}
                              isRevealing={isSelectionLocked}
                              showUnselectedOverlay={isSelectionLocked && !card.selected_by}
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
                          .sort((a, b) => a.card_id.localeCompare(b.card_id))
                          .map((card, index) => (
                            <DraftCard
                              key={`${card.id}-${index}`}
                              cardId={card.card_id}
                              cardName={card.card_name}
                              cardImage={card.card_image}
                              isLegendary={card.is_legendary}
                              isSelected={
                                isSelectionLocked 
                                  ? card.selected_by === 'joiner'
                                  : (userRole === 'joiner' ? selectedCard === card.card_id : false)
                              }
                              onSelect={() => userRole === 'joiner' ? handleCardSelect(card.card_id) : {}}
                              disabled={isSelectionLocked || userRole !== 'joiner'}
                              isRevealing={isSelectionLocked}
                              showUnselectedOverlay={isSelectionLocked && !card.selected_by}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : room.draft_type === 'triple' ? (
              // Triple Draft Layout
              <div className="space-y-8">
                {/* Draft Status */}
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-black">
                    Round {room.current_round} of 13
                  </h2>
                  <div className="space-y-4">
                    {/* Player Names with Turn Arrow */}
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-black">
                          {room.creator_name} {room.first_pick_player === 'creator' ? '(First Pick)' : ''}
                        </div>
                      </div>
                      
                       {/* Turn Arrow with Whose Turn Display */}
                       <div className="flex flex-col items-center justify-center w-12">
                         {currentTurnPlayer === 'creator' ? (
                           <div className="text-6xl text-primary animate-pulse">←</div>
                         ) : currentTurnPlayer === 'joiner' ? (
                           <div className="text-6xl text-primary animate-pulse">→</div>
                         ) : (
                           <div className="text-6xl text-muted"></div>
                         )}
                         <div className="text-sm text-primary font-medium mt-1">
                           {currentTurnPlayer === 'creator' ? `${room.creator_name}'s turn` : 
                            currentTurnPlayer === 'joiner' ? `${room.joiner_name}'s turn` : 
                            'Revealing...'}
                         </div>
                       </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-black">
                          {room.joiner_name} {room.first_pick_player === 'joiner' ? '(First Pick)' : ''}
                        </div>
                      </div>
                    </div>
                    
                    {!isSelectionLocked ? (
                      <div className="text-2xl font-bold text-primary">
                        {Math.ceil(timeRemaining)}s remaining
                      </div>
                    ) : (
                      <p className="text-lg text-black">Revealing selection...</p>
                    )}
                  </div>
                </div>

                {/* Triple Draft Cards */}
                <TripleDraftCards
                  cards={roomCards.filter(card => card.round_number === room.current_round)}
                  selectedCard={selectedCard}
                  userRole={userRole}
                  isSelectionLocked={isSelectionLocked}
                  isMyTurn={isMyTurn}
                  onCardSelect={handleCardSelect}
                />
              </div>
            ) : (
              // Mega Draft Layout
              <div className="space-y-8">
                {/* Draft Status */}
                <div className="text-center space-y-4">
                  <div className="flex justify-between items-center max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-black">Mega Draft</h2>
                    <div className="text-lg font-semibold text-primary">
                      Progress: {Math.min((room.mega_draft_turn_count || 0) + 1, 23)}/23 cards selected
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Player Names with Turn Arrow */}
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-black">
                          {room.creator_name} {room.first_pick_player === 'creator' ? '(First Pick)' : ''}
                        </div>
                      </div>
                      
                      {/* Turn Arrow with Whose Turn Display */}
                      <div className="flex flex-col items-center justify-center w-12">
                        {isMyTurn && userRole === 'creator' ? (
                          <div className="text-6xl text-primary animate-pulse">←</div>
                        ) : isMyTurn && userRole === 'joiner' ? (
                          <div className="text-6xl text-primary animate-pulse">→</div>
                        ) : !isMyTurn && userRole === 'creator' ? (
                          <div className="text-6xl text-primary animate-pulse">→</div>
                        ) : (
                          <div className="text-6xl text-primary animate-pulse">←</div>
                        )}
                        <div className="text-sm text-primary font-medium mt-1">
                          {isMyTurn ? 'Your turn' : 'Opponent\'s turn'}
                        </div>
                      </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-black">
                          {room.joiner_name} {room.first_pick_player === 'joiner' ? '(First Pick)' : ''}
                        </div>
                      </div>
                    </div>
                    
                    {!isSelectionLocked ? (
                      <div className="text-2xl font-bold text-primary">
                        {Math.ceil(timeRemaining)}s remaining
                      </div>
                    ) : (
                      <p className="text-lg text-black">Processing selection...</p>
                    )}
                  </div>
                </div>

                {/* Mega Draft Grid */}
                <MegaDraftGrid
                  cards={roomCards.filter(card => card.round_number === 1)} // All cards in round 1 for mega draft
                  selectedCard={selectedCard}
                  userRole={userRole}
                  isMyTurn={isMyTurn}
                  onCardSelect={handleCardSelect}
                />
              </div>
            )}

            {/* Player Decks - Mobile responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
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
              <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
                Draft Complete!
              </h2>
              <p className="text-lg lg:text-xl text-black">Good luck, have fun!</p>
            </div>

            {/* Final Decks - Responsive layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <div className="space-y-4 lg:space-y-6">
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
                  isDraftComplete={true}
                />
              </div>
              <div className="space-y-4 lg:space-y-6">
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
                  isDraftComplete={true}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Room