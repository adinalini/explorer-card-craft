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
  triple_draft_phase?: number | null
  triple_draft_first_pick?: string | null
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
  const [draftStartTimeout, setDraftStartTimeout] = useState<NodeJS.Timeout | null>(null)
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
  const fetchCardsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [showReveal, setShowReveal] = useState(false)

  const handleTimeUp = async () => {
    console.log('⏰ HANDLE TIME UP CALLED')
    console.log('⏰ Room:', room?.id, 'Round:', room?.current_round, 'User Role:', userRole)
    console.log('⏰ Draft type:', room?.draft_type)
    console.log('⏰ Is selection locked:', isSelectionLocked)
    console.log('⏰ Is processing round:', isProcessingRound)
    console.log('⏰ Is processing selection:', isProcessingSelection)
    
    if (isSelectionLocked || isProcessingRound || isProcessingSelection) return
    
    if (room?.draft_type === 'triple') {
      // Triple draft auto-selection for phase timeout
      console.log('🔷 TRIPLE: Phase timeout - checking if auto-select needed')
      console.log('🔷 TRIPLE: Triple phase:', room?.triple_draft_phase)
      console.log('🔷 TRIPLE: Is my turn:', isMyTurn)
      
      // Get current phase and check if selections are actually needed
      const currentPhase = room.triple_draft_phase || 1
      const currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round
      )
      const selectedCards = currentRoundCards.filter(card => card.selected_by)
      
      console.log('🔷 TRIPLE: Current phase:', currentPhase)
      console.log('🔷 TRIPLE: Selected cards count:', selectedCards.length)
      console.log('🔷 TRIPLE: Should have selections for phase:', currentPhase)
      
      // Phase-specific auto-selection logic
      if (currentPhase === 1) {
        // Phase 1: First player should auto-select if no cards selected yet
        if (isMyTurn && selectedCards.length === 0) {
          console.log('🔷 TRIPLE: Phase 1 - Auto-selecting for first pick player')
          await autoSelectRandomCard()
          
          if (userRole === 'creator') {
            setTimeout(() => {
              handleTriplePhaseEnd()
            }, 500)
          }
        } else {
          console.log('🔷 TRIPLE: Phase 1 - No auto-select needed')
          if (userRole === 'creator') {
            handleTriplePhaseEnd()
          }
        }
      } else if (currentPhase === 2) {
        // Phase 2: Second player should auto-select if exactly 1 card selected
        if (isMyTurn && selectedCards.length === 1) {
          console.log('🔷 TRIPLE: Phase 2 - Auto-selecting for second pick player')
          await autoSelectRandomCard()
          
          if (userRole === 'creator') {
            setTimeout(() => {
              handleTriplePhaseEnd()
            }, 500)
          }
        } else {
          console.log('🔷 TRIPLE: Phase 2 - No auto-select needed')
          if (userRole === 'creator') {
            handleTriplePhaseEnd()
          }
        }
      }
      return
    }
    
    setIsSelectionLocked(true)
    setShowReveal(true)
    
    // Add 0.5s delay to prevent double selection for default/mega draft types
    setTimeout(() => {
      // Check if user has made a manual selection after delay
      let currentRoundCards: RoomCard[] = []
      
      if (room?.draft_type === 'default') {
        currentRoundCards = roomCards.filter(card => 
          card.round_number === room?.current_round && card.side === userRole
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
    
    // For default draft only, processRoundEnd is handled by timer
    if (userRole === 'creator' && !isProcessingRound && room?.draft_type === 'default') {
      setTimeout(() => {
        if (!isProcessingRound) {
          processRoundEnd()
        }
      }, 3000)
    }
  }

  // Centralized timer effect - FIXED to prevent resets
  useEffect(() => {
    console.log('🕐 TIMER EFFECT TRIGGERED')
    console.log('🕐 Room status:', room?.status)
    console.log('🕐 Round start time:', room?.round_start_time)
    console.log('🕐 Draft type:', room?.draft_type)
    console.log('🕐 Current round:', room?.current_round)
    console.log('🕐 Is selection locked:', isSelectionLocked)
    
    if (room?.status === 'drafting' && room.round_start_time) {
      const updateTimer = () => {
        const now = new Date()
        const roundStart = new Date(room.round_start_time!)
        const elapsed = (now.getTime() - roundStart.getTime()) / 1000
        
        // Get duration based on draft type
        let roundDuration = room.round_duration_seconds || 15
        if (room.draft_type === 'mega') roundDuration = 10
        if (room.draft_type === 'triple') roundDuration = 8 // Simple 8 seconds per phase
        
        const remaining = Math.max(0, roundDuration - elapsed)
        console.log('🕐 TIMER: Elapsed:', elapsed.toFixed(1), 'Remaining:', remaining.toFixed(1))
        setTimeRemaining(remaining)
        
        // CRITICAL FIX: Only trigger handleTimeUp if timer expires AND not already locked
        if (remaining <= 0 && !isSelectionLocked) {
          console.log('🕐 TIMER EXPIRED - Triggering handleTimeUp')
          setIsSelectionLocked(true)
          handleTimeUp()
        } else if (remaining <= 0 && isSelectionLocked) {
          console.log('🕐 TIMER AT ZERO - But selection locked, stopping timer')
          // Stop the timer when it reaches 0 and is locked
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null
          }
        }
      }

      // Update immediately
      updateTimer()
      
      // Set up interval
      if (timerIntervalRef.current) {
        console.log('🕐 CLEARING EXISTING TIMER INTERVAL')
        clearInterval(timerIntervalRef.current)
      }
      timerIntervalRef.current = setInterval(updateTimer, 1000)
      console.log('🕐 NEW TIMER INTERVAL CREATED')

      return () => {
        if (timerIntervalRef.current) {
          console.log('🕐 CLEANING UP TIMER INTERVAL')
          clearInterval(timerIntervalRef.current)
          timerIntervalRef.current = null
        }
      }
    }
  }, [room?.status, room?.current_round, room?.draft_type, room?.round_start_time, isSelectionLocked]) // REMOVED triple_draft_phase from dependencies

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
          console.log('🔄 ROOM UPDATE: Received room change event')
          console.log('🔄 ROOM UPDATE: Event type:', payload.eventType)
          console.log('🔄 ROOM UPDATE: Payload:', payload)
          
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room
            console.log('🔄 ROOM UPDATE: Setting new room data')
            
            // CRITICAL FIX: Check if draft has already been started for this room
            const isDraftAlreadyActive = updatedRoom.status === 'drafting' || updatedRoom.current_round > 0
            
            setRoom(updatedRoom)
            
            const role = getUserRole(updatedRoom, userSessionId)
            setUserRole(role)
            
            // CRITICAL FIX: Handle triple draft phase transitions
            if (updatedRoom.draft_type === 'triple' && 
                updatedRoom.status === 'drafting' && 
                room &&
                updatedRoom.triple_draft_phase !== room.triple_draft_phase) {
              
              console.log('🔷 TRIPLE: Phase transition detected', 
                room.triple_draft_phase, '→', updatedRoom.triple_draft_phase)
              
              // Moving from phase 1 to phase 2: unlock selections and clear selected card
              if (room.triple_draft_phase === 1 && updatedRoom.triple_draft_phase === 2) {
                console.log('🔷 TRIPLE: Unlocking for phase 2')
                setIsSelectionLocked(false)
                setShowReveal(false)
                setSelectedCard(null) // Clear selected card for new phase
                
                // Fetch fresh card data to ensure we have updated state
                setTimeout(() => {
                  fetchRoomCards()
                }, 100)
              }
              // Moving to next round: unlock and reset
              else if (updatedRoom.current_round !== room.current_round) {
                console.log('🔷 TRIPLE: New round detected, unlocking')
                setIsSelectionLocked(false)
                setShowReveal(false)
                setSelectedCard(null)
                
                // Fetch fresh data for new round
                setTimeout(() => {
                  fetchRoomCards()
                  fetchPlayerDecks()
                }, 100)
              }
            }
            
            // CRITICAL FIX: Only trigger draft start if:
            // 1. Room is in 'waiting' status
            // 2. Both players are ready  
            // 3. Draft is not already starting
            // 4. Draft is not already active (status is not 'drafting' and current_round is 0)
            if (updatedRoom.creator_ready && 
                updatedRoom.joiner_ready && 
                updatedRoom.status === 'waiting' && 
                !isStartingDraft && 
                !isDraftAlreadyActive) {
              
              console.log('🚀 ROOM UPDATE: Both players ready, starting draft countdown')
              
              // Cancel any existing draft start timeout to prevent race conditions
              if (draftStartTimeout) {
                console.log('🚀 ROOM UPDATE: Cancelling existing draft start timeout')
                clearTimeout(draftStartTimeout)
                setDraftStartTimeout(null)
              }
              
              // Set flag immediately to prevent any race conditions
              setIsStartingDraft(true)
              
              if (role === 'creator') {
                console.log('🚀 ROOM UPDATE: Creator will start draft in 5 seconds')
                const timeoutId = setTimeout(() => {
                  console.log('🚀 ROOM UPDATE: Creator starting draft now')
                  startDraft(updatedRoom)
                  setIsStartingDraft(false)
                  setDraftStartTimeout(null)
                }, 5000)
                setDraftStartTimeout(timeoutId)
              } else {
                console.log('🚀 ROOM UPDATE: Joiner waiting for draft start')
                const timeoutId = setTimeout(() => {
                  setIsStartingDraft(false)
                  setDraftStartTimeout(null)
                }, 5000)
                setDraftStartTimeout(timeoutId)
              }
            } else if (isDraftAlreadyActive) {
              console.log('🚀 ROOM UPDATE: Draft already active, skipping countdown')
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
          if (payload.eventType === 'INSERT') {
            const newCard = payload.new as any
            // Debounce multiple INSERT events to prevent excessive API calls
            clearTimeout(fetchCardsTimeoutRef.current)
            fetchCardsTimeoutRef.current = setTimeout(() => {
              fetchRoomCards()
            }, 200)
          } else {
            // For UPDATE events, fetch immediately
            fetchRoomCards()
          }
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
      if (draftStartTimeout) {
        clearTimeout(draftStartTimeout)
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

    console.log('🔍 FETCH ROOM: Starting room data fetch')
    console.log('🔍 FETCH ROOM: Room ID:', roomId)

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (error) {
        console.error('🚨 FETCH ROOM: Error fetching room:', error)
        throw error
      }
      
      console.log('🔍 FETCH ROOM: Successfully fetched room data:', data)
      setRoom(data)
      
      // Determine user role based on session storage flags
      if (data) {
        const role = getUserRole(data, userSessionId)
        console.log('🔍 FETCH ROOM: User role determined:', role)
        setUserRole(role)
      }
    } catch (error) {
      console.error('🚨 FETCH ROOM: Complete failure:', error)
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

    console.log('🃏 FETCH CARDS: Starting card data fetch')
    console.log('🃏 FETCH CARDS: Room ID:', roomId)

    try {
      const { data, error } = await supabase
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .order('round_number', { ascending: true })

      if (error) {
        console.error('🚨 FETCH CARDS: Error fetching cards:', error)
        throw error
      }
      
      console.log('🃏 FETCH CARDS: Successfully fetched cards:', data?.length || 0, 'total cards')
      if (data) {
        console.log('🃏 FETCH CARDS: Cards by round:', data.reduce((acc, card) => {
          acc[card.round_number] = (acc[card.round_number] || 0) + 1
          return acc
        }, {} as Record<number, number>))
      }
      setRoomCards(data || [])
    } catch (error) {
      console.error('🚨 FETCH CARDS: Complete failure:', error)
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

  // Add a state to prevent multiple simultaneous draft starts
  const [isDraftStarting, setIsDraftStarting] = useState(false)

  const startDraft = async (roomData?: Room) => {
    const currentRoom = roomData || room
    if (!currentRoom) {
      console.log('🚨 START DRAFT: No room data available')
      return
    }

    // Prevent duplicate draft starts
    if (currentRoom.status === 'drafting') {
      console.log('🚀 START DRAFT: Already drafting, skipping')
      return
    }

    // CRITICAL: Prevent race conditions with state flag
    if (isDraftStarting) {
      console.log('🚀 START DRAFT: Already starting, skipping duplicate call')
      return
    }

    setIsDraftStarting(true)
    console.log('🚀 START DRAFT: Beginning draft start process')

    try {
      const supabaseWithToken = getSupabaseWithSession()
      
      console.log('🚀 START DRAFT: Calling generate-round-cards edge function')
      const { data: response, error: cardError } = await supabase.functions.invoke('generate-round-cards', {
        body: { 
          roomId,
          round: 'all',
          usedCardIds: [],
          draftType: currentRoom.draft_type
        }
      })

      if (cardError) {
        console.error('🚨 START DRAFT: Edge function error:', cardError)
        throw cardError
      }
      
      console.log('🚀 START DRAFT: Edge function response:', response)
      
      // CRITICAL FIX: Only update room if cards were actually generated (not already existing)
      if (response?.cardsGenerated > 0 || !response?.message?.includes('already exist')) {
        const updateData = {
          status: 'drafting', 
          current_round: 1,
          round_start_time: new Date().toISOString()
        } as any

        // For triple draft, use the first pick from edge function response
        if (currentRoom.draft_type === 'triple') {
          const firstPick = response?.firstPickPlayer || 'creator' // Use edge function result
          updateData.triple_draft_phase = 1
          updateData.triple_draft_first_pick = firstPick
          console.log(`🔷 TRIPLE: Starting with first pick: ${firstPick}`)
        }

        console.log('🚀 START DRAFT: Updating room status to drafting')
        const { data: roomUpdateData, error } = await supabaseWithToken
          .from('rooms')
          .update(updateData)
          .eq('id', roomId!)
          .select()
        
        if (error) {
          console.error('🚨 START DRAFT: Room update error:', error)
          toast({
            title: "Error",
            description: "Failed to start draft. Please refresh and try again.",
            variant: "destructive"
          })
          throw error
        }
        
        console.log('🚀 START DRAFT: Room update successful:', roomUpdateData)
      } else {
        console.log('🚀 START DRAFT: Cards already exist, skipping room update to prevent timer reset')
        
        // For triple draft, still log the first pick info for consistency
        if (currentRoom.draft_type === 'triple') {
          const firstPick = response?.firstPickPlayer || 'creator'
          console.log(`🔷 TRIPLE: Starting with first pick: ${firstPick}`)
        }
      }
      
      // SUCCESS: Draft start completed without room update errors
      console.log('🚀 START DRAFT: Function completed successfully')

    } catch (error) {
      console.error('🚨 START DRAFT: Complete failure:', error)
      console.error('🚨 START DRAFT: Error stack:', error.stack)
      toast({
        title: "Error",
        description: "Failed to start draft. Please refresh and try again.",
        variant: "destructive"
      })
    } finally {
      setIsDraftStarting(false) // Always reset the flag
    }
  }

  // Removed redundant generateRoundCards function - all cards are generated at draft start



  const autoSelectRandomCard = async () => {
    if (!room || !roomId || userRole === 'spectator') {
      return
    }

    // For triple draft, only auto-select if it's actually my turn
    if (room.draft_type === 'triple' && !isMyTurn) {
      console.log('🔹 TRIPLE: Auto-select skipped - not my turn')
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
      // For triple draft, all cards are in the middle (no sides) but only for current round
      currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round && card.side === 'both'
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
      } else if (room.draft_type === 'triple') {
        // For triple draft, check if user has selected any card in this round
        const { data, error: checkError } = await supabaseWithToken
          .from('room_cards')
          .select('*')
          .eq('room_id', roomId)
          .eq('round_number', room.current_round)
          .eq('side', 'both')
          .eq('selected_by', userRole)
        freshCheck = data || []
      } else {
        // For mega draft, check if user has selected any card in round 1
        const { data, error: checkError } = await supabaseWithToken
          .from('room_cards')
          .select('*')
          .eq('room_id', roomId)
          .eq('round_number', 1)
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
    let availableCards = currentRoundCards.filter(card => !card.selected_by)
    
    // For triple draft, further filter based on phase and turn
    if (room.draft_type === 'triple') {
      const currentPhase = room.triple_draft_phase || 1
      const firstPickPlayer = room.triple_draft_first_pick || 'creator'
      const selectedCards = currentRoundCards.filter(card => card.selected_by)
      
      if (currentPhase === 1) {
        // Phase 1: First pick player can select from all 3 cards
        if (userRole !== firstPickPlayer) {
          console.log('🔹 TRIPLE: Auto-select blocked - not first pick player in phase 1')
          return
        }
      } else if (currentPhase === 2) {
        // Phase 2: Second pick player can select from remaining 2 cards
        const secondPickPlayer = firstPickPlayer === 'creator' ? 'joiner' : 'creator'
        if (userRole !== secondPickPlayer) {
          console.log('🔹 TRIPLE: Auto-select blocked - not second pick player in phase 2')
          return
        }
        // Filter out the card selected by first pick
        availableCards = availableCards.filter(card => !selectedCards.some(selected => selected.card_id === card.card_id))
      }
    }
    
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
        
      // For triple draft, also check the side
      if (room?.draft_type === 'triple') {
        await supabaseWithToken
          .from('room_cards')
          .update({ selected_by: userRole })
          .eq('room_id', roomId)
          .eq('card_id', card.card_id)
          .eq('round_number', room?.current_round)
          .eq('side', 'both')
      }
      
      setSelectedCard(card.card_id)
      console.log('✅ Auto-selected fallback card:', card.card_name)
    } catch (error) {
      console.error('Error auto-selecting card:', error)
    }
  }

  const processRoundEnd = async () => {
    console.log('🔄 PROCESS ROUND END CALLED')
    console.log('Room:', room?.id, 'Round:', room?.current_round, 'User Role:', userRole, 'Is Processing:', isProcessingRound)
    
    if (!room || !roomId) {
      console.log('❌ Process round end blocked - missing data')
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
        // TRIPLE DRAFT: Only process full round end (both phases complete)
        console.log('🔷 TRIPLE: Processing complete round end (both phases done)')
        
        // Show reveal phase for 2 seconds
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        setTimeout(async () => {
          if (currentRound >= 13) {
            // Draft is complete
            console.log('🔷 TRIPLE: Draft complete!')
            await supabaseWithToken
              .from('rooms')
              .update({ status: 'completed' })
              .eq('id', roomId)
          } else {
            // Advance to next round with alternating first pick
            const nextRound = currentRound + 1
            const nextRoundStartTime = new Date().toISOString()
            const nextFirstPick = room.triple_draft_first_pick === 'creator' ? 'joiner' : 'creator'
            
            console.log(`🔷 TRIPLE: Advancing to round ${nextRound}, first pick: ${nextFirstPick}`)
            
            const { error: updateError } = await supabaseWithToken
              .from('rooms')
              .update({ 
                current_round: nextRound,
                round_start_time: nextRoundStartTime,
                triple_draft_phase: 1,
                triple_draft_first_pick: nextFirstPick
              })
              .eq('id', roomId)
            
            if (updateError) {
              console.error('🔷 TRIPLE: Error advancing round:', updateError)
            } else {
              console.log(`🔷 TRIPLE: Successfully advanced to round ${nextRound}`)
            }
          }
          
          // Reset UI state
          setIsSelectionLocked(false)
          setShowReveal(false)
          setIsRevealing(false)
          setSelectedCard(null)
        }, 2000)
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

  const handleTriplePhaseEnd = async () => {
    console.log('🔷 TRIPLE PHASE END: Function called')
    console.log('🔷 TRIPLE PHASE END: Room:', room?.id)
    console.log('🔷 TRIPLE PHASE END: User role:', userRole)
    
    if (!room || !roomId || userRole !== 'creator') {
      console.log('🔷 TRIPLE PHASE END: Blocked - missing data or not creator')
      return
    }
    
    // Add a small delay to ensure card updates have been processed
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      const supabaseWithToken = getSupabaseWithSession()
      const currentRound = room.current_round
      const currentPhase = room.triple_draft_phase || 1
      
      console.log('🔷 TRIPLE PHASE END: Current round:', currentRound)
      console.log('🔷 TRIPLE PHASE END: Current phase:', currentPhase)
      
      // Get current round cards with fresh data
      const { data: roundCards } = await supabaseWithToken
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .eq('round_number', currentRound)
      
      const selectedCards = roundCards?.filter(card => card.selected_by) || []
      
      console.log('🔷 TRIPLE PHASE END: Total round cards:', roundCards?.length || 0)
      console.log('🔷 TRIPLE PHASE END: Selected cards:', selectedCards.length)
      console.log('🔷 TRIPLE PHASE END: Selected cards details:', selectedCards.map(c => `${c.card_id} by ${c.selected_by}`))
      
      if (currentPhase === 1 && selectedCards.length >= 1) {
        // CRITICAL FIX: Add phase 1 selected card to player deck immediately
        const phase1Card = selectedCards[0]
        console.log('🔷 TRIPLE: Adding phase 1 card to deck:', phase1Card.card_id, 'by', phase1Card.selected_by)
        
        try {
          // Check if card already exists in deck to prevent duplicates
          const { data: existingDeck } = await supabaseWithToken
            .from('player_decks')
            .select('card_id')
            .eq('room_id', roomId)
            .eq('card_id', phase1Card.card_id)
            .eq('player_side', phase1Card.selected_by)
            .eq('selection_order', currentRound)
          
          if (!existingDeck || existingDeck.length === 0) {
              await supabaseWithToken
                .from('player_decks')
                .insert({
                  room_id: roomId,
                  card_id: phase1Card.card_id,
                  card_name: phase1Card.card_name,
                  player_side: phase1Card.selected_by as 'creator' | 'joiner',
                  selection_order: currentRound,
                  is_legendary: phase1Card.is_legendary,
                  card_image: phase1Card.card_image
                })
            console.log('🔷 TRIPLE: Phase 1 card added to deck successfully')
          }
        } catch (error) {
          console.error('🔷 TRIPLE: Error adding phase 1 card to deck:', error)
        }
        
        // Move to phase 2
        console.log('🔷 TRIPLE: Moving to phase 2')
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        // Show phase 1 end (2 seconds)
        setTimeout(async () => {
          console.log('🔷 TRIPLE: Phase 1 timeout complete, updating to phase 2')
          const updateResult = await supabaseWithToken
            .from('rooms')
            .update({ 
              triple_draft_phase: 2,
              // CRITICAL FIX: Reset timer for phase 2 so joiner gets fresh 8 seconds
              round_start_time: new Date().toISOString()
            })
            .eq('id', roomId)
          
          console.log('🔷 TRIPLE: Phase 2 update result:', updateResult)
          // Don't unlock yet - let the room update listener handle the unlock
        }, 2000)
      } else if (currentPhase === 2 && selectedCards.length >= 2) {
        // Add phase 2 selected card to player deck
        const phase2Card = selectedCards.find(card => card.selected_by !== selectedCards[0].selected_by)
        if (phase2Card) {
          console.log('🔷 TRIPLE: Adding phase 2 card to deck:', phase2Card.card_id, 'by', phase2Card.selected_by)
          
          try {
            // Check if card already exists in deck to prevent duplicates
            const { data: existingDeck } = await supabaseWithToken
              .from('player_decks')
              .select('card_id')
              .eq('room_id', roomId)
              .eq('card_id', phase2Card.card_id)
              .eq('player_side', phase2Card.selected_by)
              .eq('selection_order', currentRound)
            
            if (!existingDeck || existingDeck.length === 0) {
              await supabaseWithToken
                .from('player_decks')
                .insert({
                  room_id: roomId,
                  card_id: phase2Card.card_id,
                  card_name: phase2Card.card_name,
                  player_side: phase2Card.selected_by as 'creator' | 'joiner',
                  selection_order: currentRound,
                  is_legendary: phase2Card.is_legendary,
                  card_image: phase2Card.card_image
                })
              console.log('🔷 TRIPLE: Phase 2 card added to deck successfully')
            }
          } catch (error) {
            console.error('🔷 TRIPLE: Error adding phase 2 card to deck:', error)
          }
        }
        
        // Process round end - move to next round
        console.log('🔷 TRIPLE PHASE END: Phase 2 complete, moving to next round')
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        // Small delay to show completion, then move to next round
        setTimeout(async () => {
          const nextRound = currentRound + 1
          if (nextRound <= 13) {
            console.log('🔷 TRIPLE: Moving to round', nextRound)
            await supabaseWithToken
              .from('rooms')
              .update({ 
                current_round: nextRound,
                triple_draft_phase: 1,
                round_start_time: new Date().toISOString(),
                triple_draft_first_pick: room.triple_draft_first_pick === 'creator' ? 'joiner' : 'creator' // Alternate first pick
              })
              .eq('id', roomId)
          } else {
            // Draft complete
            console.log('🔷 TRIPLE: Draft complete')
            await supabaseWithToken
              .from('rooms')
              .update({ status: 'completed' })
              .eq('id', roomId)
          }
        }, 2000)
      } else {
        console.log('🔷 TRIPLE PHASE END: Conditions not met for phase transition')
        console.log('🔷 TRIPLE PHASE END: Phase:', currentPhase, 'Selected:', selectedCards.length)
      }
    } catch (error) {
      console.error('🔷 TRIPLE: Error in phase end:', error)
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
      
      // For triple draft, handle phase progression
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Card selected, processing phase')
        
        // Check phase completion and handle accordingly
        if (userRole === 'creator') {
          setTimeout(() => {
            handleTriplePhaseEnd()
          }, 100)
        }
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
    
    const currentPhase = room.triple_draft_phase || 1
    const firstPick = room.triple_draft_first_pick || 'creator'
    
    const roundCards = roomCards.filter(card => card.round_number === room.current_round)
    const selectedCards = roundCards.filter(card => card.selected_by)
    
    if (currentPhase === 1) {
      // Phase 1: First pick player's turn (only if no selection yet)
      return userRole === firstPick && selectedCards.length === 0 && !isSelectionLocked
    } else if (currentPhase === 2) {
      // Phase 2: Second pick player's turn (only if exactly 1 selection exists)
      const secondPick = firstPick === 'creator' ? 'joiner' : 'creator'
      // CRITICAL FIX: Allow selection even if selection was just locked, 
      // as long as we haven't selected yet in this phase
      const mySelection = selectedCards.find(card => card.selected_by === userRole)
      return userRole === secondPick && selectedCards.length === 1 && !mySelection
    }
    
    return false
  })()

  // Get whose turn it is for triple draft display
  const currentTurnPlayer = (() => {
    if (!room || room.status !== 'drafting' || room.draft_type !== 'triple') return null
    if (isRevealing || isSelectionLocked) return null
    
    const currentPhase = room.triple_draft_phase || 1
    const firstPick = room.triple_draft_first_pick || 'creator'
    
    const roundCards = roomCards.filter(card => card.round_number === room.current_round)
    const selectedCards = roundCards.filter(card => card.selected_by)
    
    if (currentPhase === 1 && selectedCards.length === 0) {
      return firstPick
    } else if (currentPhase === 2 && selectedCards.length === 1) {
      return firstPick === 'creator' ? 'joiner' : 'creator'
    }
    
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
                          {room.creator_name} {room.triple_draft_first_pick === 'creator' ? '(First Pick)' : ''}
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
                          {room.joiner_name} {room.triple_draft_first_pick === 'joiner' ? '(First Pick)' : ''}
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
                  currentPhase={(room.triple_draft_phase || 1) as 1 | 2}
                  firstPickPlayer={room.triple_draft_first_pick || 'creator'}
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