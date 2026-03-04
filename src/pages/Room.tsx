import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WaveDivider } from "@/components/ui/wave-divider"
import { supabase, getSupabaseWithSession } from "@/integrations/supabase/client"
import { createClient } from '@supabase/supabase-js'
import { toast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"
import { DraftCard } from "@/components/DraftCard"
import { DeckDisplay } from "@/components/DeckDisplay"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { getRandomCards, getCardById } from "@/utils/cardData"
import { generateTripleDraftChoice } from "@/utils/tripleDraftCards"
import { generateMegaDraftCards } from "@/utils/megaDraftCards"
import { TripleDraftCards } from "@/components/TripleDraftCards"
import { MegaDraftGrid } from "@/components/MegaDraftGrid"
import { ArrowLeft } from "lucide-react"
import { cardImages } from "@/components/CardImage"
import { useImagePreloader } from "@/hooks/use-image-preloader"

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
  const [isDraftStarting, setIsDraftStarting] = useState(false)
  const [draftStartTimeout, setDraftStartTimeout] = useState<NodeJS.Timeout | null>(null)
  const [backgroundAutoSelectTimeout, setBackgroundAutoSelectTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isUpdatingReady, setIsUpdatingReady] = useState(false)
  const [roomCodeCopied, setRoomCodeCopied] = useState(false)
  const isProcessingRoundRef = useRef(false)
  const isProcessingTriplePhaseRef = useRef(false) // Specific lock for triple phase transitions
  const [isProcessingSelection, setIsProcessingSelection] = useState<boolean>(false)
  const [megaDraftCards, setMegaDraftCards] = useState<any[]>([])
  const [megaDraftTurnSequence, setMegaDraftTurnSequence] = useState<string[]>([])
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [isRevealing, setIsRevealing] = useState(false)
  const [nextRoundImageUrls, setNextRoundImageUrls] = useState<string[]>([])
  useImagePreloader(nextRoundImageUrls, nextRoundImageUrls.length > 0)

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
  
  // UI-only mirror reveal for manual selections (no backend change)
  const [uiMirrorReveal, setUiMirrorReveal] = useState(false)
  const mirrorRevealTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSelectionRef = useRef<{ round: number; count: number }>({ round: 0, count: 0 })
  const selectionInFlightRef = useRef(false)

  useEffect(() => {
    if (!room || room.status !== 'drafting' || room.draft_type !== 'triple') return
    if (!room.current_round) return

    const round = room.current_round
    const selectedCount = roomCards.filter(c => c.round_number === round && c.selected_by).length

    const prev = lastSelectionRef.current
    const countIncreased = round !== prev.round || selectedCount > prev.count

    if (countIncreased) {
      // Trigger a 2s reveal-only UI when a new selection appears and we're not already revealing
      if (selectedCount > 0 && !isSelectionLocked && !isRevealing) {
        if (mirrorRevealTimeoutRef.current) {
          clearTimeout(mirrorRevealTimeoutRef.current)
        }
        setUiMirrorReveal(true)
        mirrorRevealTimeoutRef.current = setTimeout(() => {
          setUiMirrorReveal(false)
        }, 2000)
      }
      lastSelectionRef.current = { round, count: selectedCount }
    }
  }, [room?.status, room?.draft_type, room?.current_round, roomCards, isSelectionLocked, isRevealing])

  // Reset in-flight guard on round/phase/status changes
  useEffect(() => {
    selectionInFlightRef.current = false
  }, [room?.current_round, room?.triple_draft_phase, room?.status])

  const handleTimeUp = async () => {
    if (isSelectionLocked || isProcessingRoundRef.current || isProcessingSelection) return
    
    if (room?.draft_type === 'triple') {
      const currentPhase = room.triple_draft_phase || 1
      const currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round
      )
      const selectedCards = currentRoundCards.filter(card => card.selected_by)
      
      // CRITICAL FIX: Restore auto-selection for both Phase 1 and Phase 2
      // Both phases should have 8-second timers with auto-selection fallback
      setTimeout(async () => {
        // Check if user has made a manual selection after delay
        const freshRoundCards = roomCards.filter(card => 
          card.round_number === room.current_round
        )
        const freshSelectedCards = freshRoundCards.filter(card => card.selected_by)
        const hasManualSelection = selectedCard || freshSelectedCards.some(card => card.selected_by === userRole)
        
        let autoSelectTriggered = false
        
        // Auto-select logic for both phases
        if (!hasManualSelection) {
          if (currentPhase === 1 && isMyTurn && freshSelectedCards.length === 0) {
            await autoSelectRandomCard()
            autoSelectTriggered = true
          } else if (currentPhase === 2) {
            const mySelection = freshSelectedCards.find(card => card.selected_by === userRole)
            if (isMyTurn && freshSelectedCards.length === 1 && !mySelection) {
              await autoSelectRandomCard()
              autoSelectTriggered = true
            }
          }
        } else {
          console.log('🔷 TRIPLE: Auto-select skipped - manual selection detected after 0.5s delay')
        }
        
        // Only trigger phase end check if auto-select was NOT triggered
        // This prevents duplicate calls to handleTriplePhaseEnd
        if (!autoSelectTriggered) {
          setTimeout(() => {
            handleTriplePhaseEnd()
          }, 500)
        }
      }, 500)
      return
    }
    
    // CRITICAL FIX: Only lock for non-triple drafts
    if (room?.draft_type !== 'triple') {
      setIsSelectionLocked(true)
      setShowReveal(true)
    }
    
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
    if (userRole === 'creator' && !isProcessingRoundRef.current && room?.draft_type === 'default') {
      setTimeout(() => {
        if (!isProcessingRoundRef.current) {
          processRoundEnd()
        }
      }, 3000)
    }
  }

  // Centralized timer effect for all draft types
  useEffect(() => {
    if (!room || room.status !== 'drafting' || !room.round_start_time) {
      setTimeRemaining(0)
      return
    }

    const updateTimer = () => {
      const now = new Date()
      const roundStart = new Date(room.round_start_time)
      const elapsed = (now.getTime() - roundStart.getTime()) / 1000
      
      let roundDuration = room.round_duration_seconds || 15
      if (room.draft_type === 'mega') roundDuration = 10
      if (room.draft_type === 'triple') roundDuration = 8 // 8 seconds total for each phase
      
      // CRITICAL FIX: Display remaining time with latency buffer consideration
      // Show 0 only when grace period is truly exhausted
      const DISPLAY_BUFFER = 0.5 // Show timer as 0 half a second before hard cutoff
      const remaining = Math.max(0, roundDuration - elapsed + DISPLAY_BUFFER)
      setTimeRemaining(Math.max(0, Math.floor(remaining)))
      
      // Trigger time-up only when grace period exhausted
      if (elapsed >= roundDuration + 1.0 && !isProcessingRoundRef.current) {
        handleTimeUp()
      }
    }

    // Initial calculation
    updateTimer()

    // Set up interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    timerIntervalRef.current = setInterval(updateTimer, 1000)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [room?.status, room?.current_round, room?.draft_type, room?.round_start_time, isSelectionLocked])

  useEffect(() => {
    if (room?.current_round && room?.status === 'drafting' && userRole !== 'spectator') {
      setSelectedCard(null)
      setIsSelectionLocked(false)
      setShowReveal(false)
      isProcessingRoundRef.current = false
      isProcessingTriplePhaseRef.current = false // Reset triple phase lock too
      
      if (backgroundAutoSelectTimeout) {
        clearTimeout(backgroundAutoSelectTimeout)
        setBackgroundAutoSelectTimeout(null)
      }
    }
  }, [room?.current_round, room?.status, userRole])

  // Preload next round card images to reduce perceived latency
  useEffect(() => {
    if (!room || room.status !== 'drafting') return
    const nextRound = room.draft_type === 'mega' ? 1 : ((room.current_round || 0) + 1)
    const relevant = roomCards.filter(c => 
      c.round_number === nextRound && (room.draft_type === 'default' ? c.side === userRole : true)
    )
    const urls = relevant
      .map(c => cardImages[c.card_id])
      .filter(Boolean) as string[]
    setNextRoundImageUrls(urls)
  }, [room?.current_round, room?.status, room?.draft_type, roomCards, userRole])

  useEffect(() => {
    if (!roomId) return

    // Fetch initial room data
    fetchRoom()
    fetchRoomCards()
    fetchPlayerDecks()
    
    // CRITICAL FIX: Add a retry mechanism for room data to ensure ready buttons sync properly
    const roomDataRetry = setTimeout(() => {
      if (!room || (room.creator_ready === undefined && room.joiner_ready === undefined)) {
        console.log('🔧 ROOM SYNC: Retrying room data fetch to ensure ready state sync')
        fetchRoom()
      }
    }, 1000) // Retry after 1 second if room data is incomplete

    // Add failsafe cleanup for stuck draft starting states
    const stuckStateCleanup = setInterval(() => {
      if (isStartingDraft && room?.status === 'drafting') {
        console.log('🔧 FAILSAFE: Clearing stuck isStartingDraft state')
        setIsStartingDraft(false)
      }
      if (isDraftStarting && room?.status === 'drafting') {
        console.log('🔧 FAILSAFE: Clearing stuck isDraftStarting state')  
        setIsDraftStarting(false)
      }
    }, 5000) // Check every 5 seconds

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
          console.log('🔴 REALTIME: Room update received:', payload.eventType, payload)
          
          if (payload.eventType === 'UPDATE') {
            const updatedRoom = payload.new as Room
            
            console.log('🔴 REALTIME: Updated room data:', {
              creator_ready: updatedRoom.creator_ready,
              joiner_ready: updatedRoom.joiner_ready,
              joiner_name: updatedRoom.joiner_name,
              status: updatedRoom.status
            })
            
            // CRITICAL FIX: Check if draft has already been started for this room
            const isDraftAlreadyActive = updatedRoom.status === 'drafting' || updatedRoom.current_round > 0
            
            setRoom(updatedRoom)
            
            const role = getUserRole(updatedRoom, userSessionId)
            setUserRole(role)
            
            // CRITICAL FIX: Force a re-render when ready states change to ensure UI sync
            if (room && (room.creator_ready !== updatedRoom.creator_ready || room.joiner_ready !== updatedRoom.joiner_ready)) {
              console.log('🔧 ROOM SYNC: Ready states changed - forcing UI update')
              // Force a re-render by updating a state that triggers UI refresh
              setTimeRemaining(prev => prev) // This will trigger a re-render
              
              // Additional sync: Update room state immediately to ensure UI reflects changes
              setRoom(updatedRoom)
              
              // CRITICAL FIX: Add a more robust sync mechanism
              // Force a complete UI refresh by updating multiple state variables
              setTimeout(() => {
                console.log('🔧 ROOM SYNC: Forcing complete UI refresh')
                setTimeRemaining(prev => prev + 0.001) // Minimal change to trigger re-render
                setRoom(prev => ({ ...prev, ...updatedRoom })) // Force room state update
              }, 100)
            }
            
            // Handle triple draft phase transitions with debouncing
            if (updatedRoom.draft_type === 'triple' && updatedRoom.status === 'drafting') {
              const isPhaseTransition = room && updatedRoom.triple_draft_phase !== room.triple_draft_phase
              const isPhase2Locked = updatedRoom.triple_draft_phase === 2 && isSelectionLocked
              const isInitialPhase2Load = !room && updatedRoom.triple_draft_phase === 2
              
              // Phase 1 → 2: unlock selections (but never interrupt active reveal)
              if ((isPhaseTransition && updatedRoom.triple_draft_phase === 2) || isPhase2Locked || isInitialPhase2Load) {
                if (!isRevealing) {
                  setIsSelectionLocked(false)
                  setShowReveal(false)
                  // Fetch fresh card data to ensure we have updated state
                  setTimeout(() => {
                    fetchRoomCards()
                  }, 100)
                } else {
                  // Defer unlocking until reveal window ends so both UIs show cross/tick + paused timer
                  setTimeout(() => {
                    setIsSelectionLocked(false)
                    setShowReveal(false)
                    fetchRoomCards()
                  }, 2100)
                }
              }
              // Moving to next round: unlock and reset (also defer if reveal is active)
              else if (isPhaseTransition && updatedRoom.current_round !== room.current_round) {
                if (!isRevealing) {
                  setIsSelectionLocked(false)
                  setShowReveal(false)
                  setSelectedCard(null)
                  // Fetch fresh data for new round
                  setTimeout(() => {
                    fetchRoomCards()
                    fetchPlayerDecks()
                  }, 100)
                } else {
                  setTimeout(() => {
                    setIsSelectionLocked(false)
                    setShowReveal(false)
                    setSelectedCard(null)
                    fetchRoomCards()
                    fetchPlayerDecks()
                  }, 2100)
                }
              }
            }
             
             // CRITICAL FIX: Only trigger draft start if:
            // 1. Room is in 'waiting' status
            // 2. Both players are ready  
            // 3. Draft is not already starting (multiple flags check)
            // 4. Draft is not already active (status is not 'drafting' and current_round is 0)
            // 5. No existing draft timeout is running
            if (updatedRoom.creator_ready && 
                updatedRoom.joiner_ready && 
                updatedRoom.status === 'waiting' && 
                !isStartingDraft && 
                !isDraftStarting && 
                !isDraftAlreadyActive && 
                !draftStartTimeout) {
              
    console.log('🚀 ROOM UPDATE: Both players ready, starting draft countdown')
              
              // Cancel any existing draft start timeout to prevent race conditions
              if (draftStartTimeout) {
                console.log('🚀 ROOM UPDATE: Cancelling existing draft start timeout')
                clearTimeout(draftStartTimeout)
                setDraftStartTimeout(null)
              }
              
              // Set flags immediately to prevent any race conditions
              setIsStartingDraft(true)
              
              if (role === 'creator') {
                console.log('🚀 ROOM UPDATE: Creator will start draft in 5 seconds')
                const timeoutId = setTimeout(() => {
                  console.log('🚀 ROOM UPDATE: Creator starting draft now')
                  startDraft(updatedRoom)
                    .then(() => {
                      setIsStartingDraft(false)
                      setDraftStartTimeout(null)
                    })
                    .catch(() => {
                      setIsStartingDraft(false)
                      setDraftStartTimeout(null)
                    })
                }, 5000)
                setDraftStartTimeout(timeoutId)
              } else {
                console.log('🚀 ROOM UPDATE: Joiner waiting for draft start')
                const timeoutId = setTimeout(() => {
                  setIsStartingDraft(false)
                  setDraftStartTimeout(null)
                }, 6000) // Give joiner a bit more time to see the draft start
                setDraftStartTimeout(timeoutId)
              }
            } else if (isDraftAlreadyActive) {
              console.log('🚀 ROOM UPDATE: Draft already active, skipping countdown')
              // Clear any stale flags if draft is already active
              if (isStartingDraft || isDraftStarting) {
                setIsStartingDraft(false)
                if (draftStartTimeout) {
                  clearTimeout(draftStartTimeout)
                  setDraftStartTimeout(null)
                }
              }
            } else if (isStartingDraft || isDraftStarting) {
              console.log('🚀 ROOM UPDATE: Draft start already in progress, ignoring duplicate trigger')
            } else if (draftStartTimeout) {
              console.log('🚀 ROOM UPDATE: Draft timeout already running, ignoring duplicate trigger')
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('🔴 REALTIME: Room subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('🔴 REALTIME: Successfully subscribed to room updates')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('🔴 REALTIME: Room subscription error, falling back to polling')
          // Fallback to polling if realtime fails
          const pollInterval = setInterval(() => {
            console.log('🔄 POLLING: Fetching room data due to realtime failure')
            fetchRoom()
          }, 3000)
          
          // Cleanup polling when component unmounts
          return () => clearInterval(pollInterval)
        }
      })

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
          console.log('🔴 REALTIME: Cards update received:', payload.eventType)
          if (payload.eventType === 'INSERT') {
            // Debounce multiple INSERT events to prevent excessive API calls
            clearTimeout(fetchCardsTimeoutRef.current)
            fetchCardsTimeoutRef.current = setTimeout(() => {
              fetchRoomCards()
            }, 200)
          } else if (payload.eventType === 'UPDATE') {
            // Always refresh cards on updates
            fetchRoomCards()

          } else {
            fetchRoomCards()
          }
        }
      )
      .subscribe((status) => {
        console.log('🔴 REALTIME: Cards subscription status:', status)
      })

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
        (payload) => {
          console.log('🔴 REALTIME: Decks update received:', payload.eventType)
          fetchPlayerDecks()
        }
      )
      .subscribe((status) => {
        console.log('🔴 REALTIME: Decks subscription status:', status)
      })

    return () => {
      console.log('🔴 REALTIME: Cleaning up subscriptions for room:', roomId)
      supabase.removeChannel(roomChannel)
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(decksChannel)
      clearInterval(stuckStateCleanup)
      clearTimeout(roomDataRetry)
      if (backgroundAutoSelectTimeout) {
        clearTimeout(backgroundAutoSelectTimeout)
      }
      if (draftStartTimeout) {
        clearTimeout(draftStartTimeout)
      }
      console.log('🔴 REALTIME: Cleanup completed')
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

  const handleCopyRoomCode = async () => {
    if (!room?.id) return

    try {
      await navigator.clipboard.writeText(room.id)
      setRoomCodeCopied(true)
      setTimeout(() => setRoomCodeCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy room code to clipboard', error)
    }
  }

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
    if (!room || userRole === 'spectator' || isUpdatingReady) return
    
    console.log('🔘 READY: Handling ready state change')
    console.log('🔘 READY: Current ready states - Creator:', room.creator_ready, 'Joiner:', room.joiner_ready)
    console.log('🔘 READY: User role:', userRole, 'Room status:', room.status)
    
    // Prevent interaction once both are ready or if draft is already starting/active
    if ((room.creator_ready && room.joiner_ready) || room.status !== 'waiting' || isStartingDraft || isDraftStarting) {
      console.log('🔘 READY: Interaction blocked - both ready or draft active')
      return
    }

    const updateField = userRole === 'creator' ? 'creator_ready' : 'joiner_ready'
    const currentValue = userRole === 'creator' ? room.creator_ready : room.joiner_ready
    
    setIsUpdatingReady(true)
    
    try {
      console.log('🔘 READY: Updating ready status to:', !currentValue)
      
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
      
      console.log('🔘 READY: Ready status updated successfully')
      
      // CRITICAL FIX: Update local room state immediately to prevent button spam
      setRoom(prev => prev ? {
        ...prev,
        [updateField]: !currentValue
      } : prev)
      
      setIsReady(!currentValue)
      
      // Force refresh room data to ensure sync
      setTimeout(() => {
        fetchRoom()
      }, 500)
      
    } catch (error) {
      console.error('🚨 READY: Error updating ready status:', error)
      toast({
        title: "Error",
        description: "Failed to update ready status.",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingReady(false)
    }
  }

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

    // For triple draft, add additional check for recent manual selections
    if (room.draft_type === 'triple') {
      const currentRoundCards = roomCards.filter(card => 
        card.round_number === room.current_round
      )
      const userSelectedCard = currentRoundCards.find(card => card.selected_by === userRole)
      if (userSelectedCard) {
        console.log('🔹 TRIPLE: Auto-select skipped - Database shows manual selection exists')
        setSelectedCard(userSelectedCard.card_id)
        return
      }
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
    
    // For default draft, filter by player side
    if (room.draft_type === 'default') {
      availableCards = availableCards.filter(card => card.side === userRole)
    }
    
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
      console.log('🔄 AUTO-SELECT: Starting auto-select process')
      console.log('🔄 AUTO-SELECT: Card:', card.card_id, card.card_name)
      console.log('🔄 AUTO-SELECT: User Role:', userRole)
      console.log('🔄 AUTO-SELECT: Current Round:', room?.current_round)
      console.log('🔄 AUTO-SELECT: Draft Type:', room?.draft_type)
      console.log('🔄 AUTO-SELECT: Triple Phase:', room?.triple_draft_phase)
      
      const supabaseWithToken = getSupabaseWithSession()
      
      // CRITICAL FIX: Single atomic update with proper filters
      let updateQuery = supabaseWithToken
        .from('room_cards')
        .update({ selected_by: userRole })
        .eq('room_id', roomId)
        .eq('card_id', card.card_id)
        .eq('round_number', room?.draft_type === 'mega' ? 1 : room?.current_round)
      
      // For triple draft, add side filter to ensure we only update the correct card
      if (room?.draft_type === 'triple') {
        updateQuery = updateQuery.eq('side', 'both')
      }
      
      console.log('🔄 AUTO-SELECT: Database update initiated')
      const { data: updateResult, error: updateError } = await updateQuery.select()
        
      console.log('🔄 AUTO-SELECT: Database update result:', updateResult)
      if (updateError) {
        console.error('🔄 AUTO-SELECT: Database update error:', updateError)
        return
      }
      
      if (!updateResult || updateResult.length === 0) {
        console.error('🔄 AUTO-SELECT: No cards updated - card may not exist or wrong filters')
        return
      }
      
      // Verify the selection was actually set
      console.log('🔄 AUTO-SELECT: Verifying selection...')
      const { data: verifyResult } = await supabaseWithToken
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .eq('card_id', card.card_id)
        .eq('round_number', room?.current_round)
      
      console.log('🔄 AUTO-SELECT: Verification result:', verifyResult)
      
      // Get all current selections for this round
      const { data: allSelections } = await supabaseWithToken
        .from('room_cards')
        .select('card_id, selected_by')
        .eq('room_id', roomId)
        .eq('round_number', room?.current_round)
        .not('selected_by', 'is', null)
      
      console.log('🔄 AUTO-SELECT: All current selections:', allSelections)
      
      setSelectedCard(card.card_id)
      console.log('✅ AUTO-SELECT: Process completed successfully')
      console.log('✅ AUTO-SELECT: Selected card:', card.card_name)
      console.log('✅ AUTO-SELECT: Total selections now:', allSelections?.length || 0)
      
      // For triple draft, add additional logging about phase state
      if (room?.draft_type === 'triple') {
        console.log('🔷 AUTO-SELECT: Triple draft post-selection state:')
        console.log('🔷 AUTO-SELECT: Phase:', room.triple_draft_phase)
        console.log('🔷 AUTO-SELECT: Is My Turn:', isMyTurn)
        console.log('🔷 AUTO-SELECT: First Pick Player:', room.triple_draft_first_pick)
        console.log('🔷 AUTO-SELECT: Selection Locked:', isSelectionLocked)
        
        // For triple draft, trigger reveal phase for auto-selection
        console.log('🔷 TRIPLE AUTO-SELECT: Starting reveal phase...')
        
        // If auto-select completes Phase 1, start Phase 2 timer immediately and add to deck now
        const currentPhase = room?.triple_draft_phase || 1
        if (currentPhase === 1) {
          console.log('🔷 TRIPLE AUTO-SELECT: Phase 1 complete, deferring transition to creator (no timer reset, no deck insert here).')
        }
        
        setIsSelectionLocked(true)
        setShowReveal(true)
        setIsRevealing(true)
        
        // After 2 seconds, trigger phase end check
        setTimeout(() => {
          console.log('🔷 TRIPLE AUTO-SELECT: Reveal ended, checking phase advancement')
          setShowReveal(false)
          setIsRevealing(false)
          handleTriplePhaseEnd()
        }, 2000)
      }
      
    } catch (error) {
      console.error('❌ AUTO-SELECT: Critical error during auto-select:', error)
    }
  }

  const processRoundEnd = async () => {
    console.log('🔄 PROCESS ROUND END CALLED')
    console.log('Room:', room?.id, 'Round:', room?.current_round, 'User Role:', userRole, 'Is Processing:', isProcessingRoundRef.current)
    
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
    if (isProcessingRoundRef.current) {
      console.log('❌ Process round end blocked - race condition detected')
      return
    }

    isProcessingRoundRef.current = true
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
        isProcessingRoundRef.current = false
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
      isProcessingRoundRef.current = false
    }
  }

  const handleTriplePhaseEnd = async () => {
    console.log('🔷 TRIPLE PHASE END: ================== FUNCTION START ==================')
    console.log('🔷 TRIPLE PHASE END: Room:', room?.id)
    console.log('🔷 TRIPLE PHASE END: User role:', userRole)
    console.log('🔷 TRIPLE PHASE END: Timestamp:', new Date().toISOString())
    
    if (!room || !roomId) {
      console.log('🔷 TRIPLE PHASE END: ❌ Blocked - missing room data')
      return
    }
    
    // CRITICAL FIX: Use specific lock for triple phase transitions to prevent duplicate calls
    if (isProcessingTriplePhaseRef.current) {
      console.log('🔷 TRIPLE PHASE END: ⏳ Already processing triple phase, skipping (triple lock active)')
      return
    }
    
    // Also check the general processing lock
    if (isProcessingRoundRef.current) {
      console.log('🔷 TRIPLE PHASE END: ⏳ Already processing round, skipping (round lock active)')
      return
    }
    
    console.log('🔷 TRIPLE PHASE END: 🔒 Setting triple phase processing locks')
    isProcessingTriplePhaseRef.current = true
    isProcessingRoundRef.current = true

    // Only the creator should perform phase transitions and DB writes
    if (userRole !== 'creator') {
      console.log('🔷 TRIPLE PHASE END: Non-creator client - deferring to creator and exiting.')
      isProcessingTriplePhaseRef.current = false
      isProcessingRoundRef.current = false
      return
    }
    
    // Add a small delay to ensure card updates have been processed
    console.log('🔷 TRIPLE PHASE END: ⏳ Waiting 200ms for card updates...')
    await new Promise(resolve => setTimeout(resolve, 200))
    
    try {
      const supabaseWithToken = getSupabaseWithSession()
      const currentRound = room.current_round
      const currentPhase = room.triple_draft_phase || 1
      
      console.log('🔷 TRIPLE PHASE END: 📊 Current state:')
      console.log('🔷 TRIPLE PHASE END:   - Round:', currentRound)
      console.log('🔷 TRIPLE PHASE END:   - Phase:', currentPhase)
      console.log('🔷 TRIPLE PHASE END:   - First Pick:', room.triple_draft_first_pick)
      console.log('🔷 TRIPLE PHASE END:   - Selection Locked:', isSelectionLocked)
      console.log('🔷 TRIPLE PHASE END:   - Is My Turn:', isMyTurn)
      
      // Get current round cards with fresh data
      console.log('🔷 TRIPLE PHASE END: 🔍 Fetching fresh card data...')
      const { data: roundCards, error: cardsError } = await supabaseWithToken
        .from('room_cards')
        .select('*')
        .eq('room_id', roomId)
        .eq('round_number', currentRound)
      
      if (cardsError) {
        console.error('🔷 TRIPLE PHASE END: ❌ Error fetching cards:', cardsError)
        return
      }
      
      const selectedCards = roundCards?.filter(card => card.selected_by) || []
      
      console.log('🔷 TRIPLE PHASE END: 📋 Card analysis:')
      console.log('🔷 TRIPLE PHASE END:   - Total round cards:', roundCards?.length || 0)
      console.log('🔷 TRIPLE PHASE END:   - Selected cards:', selectedCards.length)
      console.log('🔷 TRIPLE PHASE END:   - Expected selections for phase', currentPhase + ':', currentPhase)
      console.log('🔷 TRIPLE PHASE END: 📋 Selected cards details:')
      selectedCards.forEach((card, index) => {
        console.log(`🔷 TRIPLE PHASE END:   ${index + 1}. ${card.card_id} (${card.card_name}) by ${card.selected_by}`)
      })
      
      // Log phase transition eligibility
      const phase1Ready = currentPhase === 1 && selectedCards.length >= 1
      const phase2Ready = currentPhase === 2 && selectedCards.length >= 2
      
      console.log('🔷 TRIPLE PHASE END: 🎯 Phase transition eligibility:')
      console.log('🔷 TRIPLE PHASE END:   - Phase 1 → 2 ready:', phase1Ready)
      console.log('🔷 TRIPLE PHASE END:   - Phase 2 → next round ready:', phase2Ready)
      
      if (currentPhase === 1 && selectedCards.length >= 1) {
        console.log('🔷 TRIPLE PHASE END: ✅ PHASE 1 → 2 TRANSITION TRIGGERED')
        console.log('🔷 TRIPLE PHASE END: 🎯 Phase 1 complete - transitioning to phase 2')
        
        // CRITICAL FIX: Check for multiple selections in Phase 1 (shouldn't happen with proper generation)
        if (selectedCards.length > 1) {
          console.error('🔷 TRIPLE PHASE END: 🚨 ERROR: Multiple cards selected in Phase 1!')
          console.error('🔷 TRIPLE PHASE END: This indicates a card generation bug - reporting details:')
          selectedCards.forEach((card, i) => {
            console.error(`🔷 TRIPLE PHASE END:   ${i+1}. ${card.card_id} (${card.card_name}) by ${card.selected_by}`)
          })
          
          // Use first selection and report the issue
          const firstSelection = selectedCards[0]
          console.error('🔷 TRIPLE PHASE END: Using first selection:', firstSelection.card_id, 'by', firstSelection.selected_by)
          console.error('🔷 TRIPLE PHASE END: PLEASE REPORT THIS BUG - duplicates should never occur')
        }
        
        // Add phase 1 selected card to player deck: must be the first pick player's selection
        const firstPickPlayer = (room.triple_draft_first_pick as 'creator' | 'joiner')
        const phase1Card = selectedCards.find(c => c.selected_by === firstPickPlayer)
        if (!phase1Card) {
          console.warn('🔷 TRIPLE PHASE END: ⚠️ No phase 1 card found for first pick player, aborting deck insert')
          return
        }
        console.log('🔷 TRIPLE PHASE END: 📦 Adding phase 1 card to deck:', phase1Card.card_id, 'by', phase1Card.selected_by)
        try {
        // ENHANCED DUPLICATE CHECK: Check by card_id AND player_side AND selection_order
        const { data: existingDeck } = await supabaseWithToken
          .from('player_decks')
          .select('id, card_id, player_side, selection_order')
          .eq('room_id', roomId)
          .eq('card_id', phase1Card.card_id)
          .eq('player_side', phase1Card.selected_by)
          .eq('selection_order', currentRound)
        
        if (!existingDeck || existingDeck.length === 0) {
            const { error: insertError } = await supabaseWithToken
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
            
            if (insertError) {
              console.error('🔷 TRIPLE: ❌ CRITICAL - Failed to insert phase 1 card:', insertError)
              // Don't proceed to phase 2 if deck insertion failed
              return
            }
            console.log('🔷 TRIPLE: Phase 1 card added to deck successfully')
          } else {
            console.log('🔷 TRIPLE: Phase 1 card already in deck, skipping duplicate')
            console.log('🔷 TRIPLE: Existing deck entries:', existingDeck.length)
          }

          // REMOVED RETRY LOGIC to prevent duplicate insertions
        } catch (error) {
          console.error('🔷 TRIPLE: ❌ CRITICAL - Error adding phase 1 card to deck:', error)
          // Don't proceed to phase 2 if deck insertion failed
          return
        }
        
        // Move to phase 2 immediately without additional reveal
        // CRITICAL FIX: Set a proper Phase 2 start time to fix timer calculation
        const phase2StartTime = new Date().toISOString()
        console.log('🔷 TRIPLE PHASE END: 🕐 Setting Phase 2 start time:', phase2StartTime)
        
        const { data: phaseUpdateResult, error: phaseUpdateError } = await supabaseWithToken
          .from('rooms')
          .update({ 
            triple_draft_phase: 2,
            round_start_time: phase2StartTime // CRITICAL FIX: Update start time for Phase 2
          })
          .eq('id', roomId)
          .select()
        
        if (phaseUpdateError) {
          console.error('🔷 TRIPLE PHASE END: ❌ Error updating to phase 2:', phaseUpdateError)
          return
        }
        
        console.log('🔷 TRIPLE PHASE END: ✅ Successfully moved to phase 2')
        console.log('🔷 TRIPLE PHASE END: 📊 Phase update result:', phaseUpdateResult)
        
        // Verify the phase change took effect
        const { data: verifyRoom } = await supabaseWithToken
          .from('rooms')
          .select('triple_draft_phase, round_start_time')
          .eq('id', roomId)
          .single()
        
        console.log('🔷 TRIPLE PHASE END: 🔍 Verification - Room phase is now:', verifyRoom?.triple_draft_phase)
        console.log('🔷 TRIPLE PHASE END: 🔍 Verification - Round start time:', verifyRoom?.round_start_time)
      } else if (currentPhase === 2 && selectedCards.length >= 2) {
        console.log('🔷 TRIPLE: Phase 2 complete - moving to next round')
        
        // Add phase 2 selected card to player deck: must be the second pick player's selection
        const firstPickPlayer = (room.triple_draft_first_pick as 'creator' | 'joiner')
        const secondPickPlayer = firstPickPlayer === 'creator' ? 'joiner' : 'creator'
        const phase2Card = selectedCards.find(card => card.selected_by === secondPickPlayer)
        if (!phase2Card) {
          console.error('🔷 TRIPLE PHASE END: ❌ CRITICAL - No phase 2 card found for', secondPickPlayer)
          console.error('🔷 TRIPLE PHASE END: Selected cards:', selectedCards)
          // Don't proceed to next round if phase 2 card insertion failed
          return
        }
        
        console.log('🔷 TRIPLE: Adding phase 2 card to deck:', phase2Card.card_id, 'by', phase2Card.selected_by)
        
        try {
          // ENHANCED DUPLICATE CHECK: Check by card_id AND player_side AND selection_order
          const { data: existingDeck } = await supabaseWithToken
            .from('player_decks')
            .select('id, card_id, player_side, selection_order')
            .eq('room_id', roomId)
            .eq('card_id', phase2Card.card_id)
            .eq('player_side', phase2Card.selected_by)
            .eq('selection_order', currentRound)
          
          if (!existingDeck || existingDeck.length === 0) {
            const { error: insertError } = await supabaseWithToken
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
            
            if (insertError) {
              console.error('🔷 TRIPLE: ❌ CRITICAL - Failed to insert phase 2 card:', insertError)
              // Don't proceed to next round if deck insertion failed
              return
            }
            console.log('🔷 TRIPLE: Phase 2 card added to deck successfully')
          } else {
            console.log('🔷 TRIPLE: Phase 2 card already in deck, skipping duplicate')
            console.log('🔷 TRIPLE: Existing deck entries:', existingDeck.length)
          }
        } catch (error) {
          console.error('🔷 TRIPLE: ❌ CRITICAL - Error adding phase 2 card to deck:', error)
          // Don't proceed to next round if deck insertion failed
          return
        }
        
        // Move to next round immediately without additional reveal  
          const nextRound = currentRound + 1
          if (nextRound <= 13) {
            console.log('🔷 TRIPLE: Moving to round', nextRound)
            
            // Collect all card IDs used in previous rounds to avoid duplicates
            const usedCardIds = roomCards
              .filter(card => card.round_number < nextRound)
              .map(card => card.card_id)
            console.log(`🔷 TRIPLE: Tracked ${usedCardIds.length} used cards from previous rounds`)
            
            // Generate cards for the next round
            console.log('🔷 TRIPLE: Generating cards for next round:', nextRound)
            const { data: cardGenResponse, error: cardGenError } = await supabase.functions.invoke('generate-round-cards', {
              body: { 
                roomId,
                round: nextRound.toString(),
                usedCardIds,
                draftType: 'triple'
              }
            })
            
            if (cardGenError) {
              console.error('🔷 TRIPLE: Error generating cards for next round:', cardGenError)
            } else {
              console.log('🔷 TRIPLE: Cards generated for next round:', cardGenResponse)
            }
            
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
      } else {
        console.log('🔷 TRIPLE PHASE END: ❌ CONDITIONS NOT MET FOR PHASE TRANSITION')
        console.log('🔷 TRIPLE PHASE END: 📊 Current state analysis:')
        console.log('🔷 TRIPLE PHASE END:   - Phase:', currentPhase)
        console.log('🔷 TRIPLE PHASE END:   - Selected cards:', selectedCards.length)
        console.log('🔷 TRIPLE PHASE END:   - Required for Phase 1→2:', currentPhase === 1 ? '1 card' : 'N/A')
        console.log('🔷 TRIPLE PHASE END:   - Required for Phase 2→Next:', currentPhase === 2 ? '2 cards' : 'N/A')
        console.log('🔷 TRIPLE PHASE END: 🔍 Detailed analysis:')
        
        if (currentPhase === 1) {
          console.log('🔷 TRIPLE PHASE END:   - In Phase 1, need 1+ selections, have:', selectedCards.length)
          console.log('🔷 TRIPLE PHASE END:   - Phase 1 condition met:', selectedCards.length >= 1)
        } else if (currentPhase === 2) {
          console.log('🔷 TRIPLE PHASE END:   - In Phase 2, need 2+ selections, have:', selectedCards.length)
          console.log('🔷 TRIPLE PHASE END:   - Phase 2 condition met:', selectedCards.length >= 2)
          
          // Analyze the selections more deeply
          const uniqueSelectors = [...new Set(selectedCards.map(c => c.selected_by))]
          console.log('🔷 TRIPLE PHASE END:   - Unique selectors:', uniqueSelectors.length, '(', uniqueSelectors.join(', '), ')')
          console.log('🔷 TRIPLE PHASE END:   - Expected: 2 different players should have selected')
          
          if (selectedCards.length >= 2 && uniqueSelectors.length < 2) {
            console.log('🔷 TRIPLE PHASE END: 🚨 CRITICAL ISSUE: Multiple cards selected by same player!')
            selectedCards.forEach((card, i) => {
              console.log(`🔷 TRIPLE PHASE END:     ${i+1}. ${card.card_id} by ${card.selected_by}`)
            })
          }
        }
        
        console.log('🔷 TRIPLE PHASE END: 🔄 Will retry phase check on next timer or selection...')
      }
    } catch (error) {
      console.error('🔷 TRIPLE: Error in phase end:', error)
    } finally {
      console.log('🔷 TRIPLE PHASE END: 🔓 Releasing locks')
      isProcessingTriplePhaseRef.current = false
      isProcessingRoundRef.current = false
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
    
    // Prevent rapid double-clicks within same tick
    if (selectionInFlightRef.current) {
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Selection blocked - in-flight')
      }
      return
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
      
      // CRITICAL FIX: Check if user has already selected a card in Phase 1
      if (room.triple_draft_phase === 1) {
        const currentRoundCards = roomCards.filter(card => 
          card.round_number === room.current_round
        )
        const userSelectedCard = currentRoundCards.find(card => card.selected_by === userRole)
        if (userSelectedCard) {
          console.log('🔷 TRIPLE: Selection blocked - user already selected card in Phase 1:', userSelectedCard.card_id)
          return
        }
        
        // Also check if any card has been selected by anyone in Phase 1
        const anySelectedCard = currentRoundCards.find(card => card.selected_by)
        if (anySelectedCard) {
          console.log('🔷 TRIPLE: Selection blocked - card already selected in Phase 1:', anySelectedCard.card_id, 'by', anySelectedCard.selected_by)
          return
        }
      }
    }

    // Additional check: verify time hasn't expired even if isSelectionLocked hasn't been updated yet
    // CRITICAL FIX: Add latency buffer (1 second grace period) to account for network lag
    if (room?.status === 'drafting' && room.round_start_time) {
      const now = new Date()
      const roundStart = new Date(room.round_start_time)
      const elapsed = (now.getTime() - roundStart.getTime()) / 1000
      let roundDuration = room.round_duration_seconds || 15
      if (room.draft_type === 'triple') roundDuration = 8
      if (room.draft_type === 'mega') roundDuration = 10
      const remaining = roundDuration - elapsed
      
      // Add 1 second grace period for high-latency connections
      const LATENCY_BUFFER = 1.0

      if (remaining <= -LATENCY_BUFFER) {
        if (room?.draft_type === 'triple') {
          console.log('🔷 TRIPLE: Selection blocked - time has expired (grace period exhausted)')
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
    selectionInFlightRef.current = true
    setIsProcessingSelection(true)
    
    // Update selected card immediately for instant UI feedback
    setSelectedCard(cardId)

    // Extend session when user interacts with the game
    await extendSession()

    try {
      // CRITICAL FIX: Find the specific card instance in the current round
      const currentRoundNumber = room?.draft_type === 'mega' ? 1 : room?.current_round
      const currentRoundCards = roomCards.filter(card => 
        card.round_number === currentRoundNumber &&
        card.card_id === cardId
      )
      
      // CRITICAL: If there are multiple cards with the same card_id (duplicates),
      // select the first unselected one
      const selectedCardData = currentRoundCards.find(card => !card.selected_by) || currentRoundCards[0]
      
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

      // CRITICAL FIX: Set new selection using the unique card instance ID
      // This ensures we only update ONE card even if there are duplicates
      console.log('Setting new selection in database for card instance ID:', selectedCardData.id)
      const { error } = await supabaseWithToken
        .from('room_cards')
        .update({ selected_by: userRole })
        .eq('id', selectedCardData.id) // Use unique ID instead of card_id

      if (error) {
        console.error('Error updating card selection:', error)
        setSelectedCard(null) // Reset on error
        return
      }

      console.log('✅ Manual selection confirmed:', cardId)
      
      // For triple draft, trigger reveal phase first, then phase end check
      if (room?.draft_type === 'triple') {
        console.log('🔷 TRIPLE: Card selected, starting reveal phase')
        setIsSelectionLocked(true)
        setShowReveal(true)
        setIsRevealing(true)
        
        // Force immediate card data refresh to show correct tick/cross
        setTimeout(() => {
          fetchRoomCards()
        }, 100)
        
        // After 2 seconds, trigger phase end check
        setTimeout(() => {
          console.log('🔷 TRIPLE: Reveal ended, checking phase advancement')
          setShowReveal(false)
          setIsRevealing(false)
          handleTriplePhaseEnd()
        }, 2000)
      } else if (room?.draft_type === 'mega') {
        // For mega draft, immediately lock and start reveal phase
        setIsSelectionLocked(true)
        setShowReveal(true)
        
        if (userRole === 'creator' && !isProcessingRoundRef.current) {
          setTimeout(() => {
            if (!isProcessingRoundRef.current) {
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
      selectionInFlightRef.current = false
    } finally {
      // Always clear the processing flag
      setIsProcessingSelection(false)
      selectionInFlightRef.current = false
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
      return userRole === firstPick && selectedCards.length === 0
    } else if (currentPhase === 2) {
      // Phase 2: Second pick player's turn (only if exactly 1 selection exists)
      const secondPick = firstPick === 'creator' ? 'joiner' : 'creator'
      // CRITICAL FIX: Don't check isSelectionLocked here - let the room update handle unlocking
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

  // UI-only reveal state for manual selections (mirror auto-select)
  const uiRevealActive = (() => {
    if (!room || room.status !== 'drafting' || room.draft_type !== 'triple') return false
    if (isSelectionLocked || isRevealing) return false
    if (!room.current_round) return false
    const roundCards = roomCards.filter(card => card.round_number === room.current_round)
    const selectedCount = roundCards.filter(card => card.selected_by).length
    const phase = room.triple_draft_phase || 1
    const expected = phase === 1 ? 1 : 2
    return selectedCount === expected
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
    <div className="min-h-screen room-background">
      {/* Header with gradient wave */}
      <div className="relative">
        <div className="bg-gradient-to-r from-[hsl(320_100%_60%)] to-[hsl(30_100%_60%)] py-3 px-4">
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
            <div className="flex items-center gap-2">
              <ThemeToggle className="text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-accent" />
            </div>
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
          <div className="text-xl md:text-2xl text-muted-foreground flex items-center justify-center gap-4">
            Share this code: 
            <span className="font-bold text-primary text-3xl tracking-wider">{room.id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyRoomCode}
              className="flex items-center gap-2"
            >
              {roomCodeCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
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
                  <h2 className="text-2xl font-bold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">{room.creator_name}</h2>
                  <div className="text-lg text-muted-foreground">Room Creator</div>
                  
                  <Button
                    onClick={handleReady}
                    variant={room.creator_ready ? "secondary" : "default"}
                    size="lg"
                    className="px-8 py-4 text-lg"
                    disabled={userRole !== 'creator' || room.creator_ready || isUpdatingReady || (room.creator_ready && room.joiner_ready)}
                  >
                    {isUpdatingReady && userRole === 'creator' ? "Updating..." : room.creator_ready ? "Ready ✓" : "Ready?"}
                  </Button>
                </div>
              </div>

              {/* Joiner Side */}
              <div className="flex flex-col items-center justify-center pt-8 md:pt-0 md:pl-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">{room.joiner_name}</h2>
                  <div className="text-lg text-muted-foreground">Joined Player</div>
                  
                  <Button
                    onClick={handleReady}
                    variant={room.joiner_ready ? "secondary" : "default"}
                    size="lg"
                    className="px-8 py-4 text-lg"
                    disabled={userRole !== 'joiner' || room.joiner_ready || isUpdatingReady || (room.creator_ready && room.joiner_ready)}
                  >
                    {isUpdatingReady && userRole === 'joiner' ? "Updating..." : room.joiner_ready ? "Ready ✓" : "Ready?"}
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
                  <span className="text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">{room.creator_name}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-4 h-4 rounded-full ${room.joiner_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span className="text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">{room.joiner_name}</span>
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
                  <h2 className="text-2xl font-bold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
                    Round {room.current_round} of 13
                  </h2>
                  <div className="min-h-[4rem]">
                    {!isSelectionLocked ? (
                      <div className="space-y-2">
                        <p className="text-lg text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Choose your card!</p>
                        <div className="text-2xl font-bold text-primary">
                          {Math.ceil(timeRemaining)}s remaining
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Revealing selections...</p>
                    )}
                  </div>
                </div>

                {/* Card Selection - Mobile responsive */}
                <div className="space-y-8">
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Creator's cards */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-center text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
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
                      <h3 className="text-xl font-semibold text-center text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
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
                  <h2 className="text-2xl font-bold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
                    Round {room.current_round} of 13
                  </h2>
                  <div className="space-y-4 min-h-[7rem]">
                    {/* Player Names with Turn Arrow */}
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
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
                         <div className="text-sm text-primary font-medium mt-1 min-h-[1.25rem]">
                           {currentTurnPlayer === 'creator' ? `${room.creator_name}'s turn` : 
                            currentTurnPlayer === 'joiner' ? `${room.joiner_name}'s turn` : 
                            'Revealing...'}
                         </div>
                       </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
                          {room.joiner_name} {room.triple_draft_first_pick === 'joiner' ? '(First Pick)' : ''}
                        </div>
                      </div>
                    </div>
                    
                      <div className="min-h-[2.5rem]">
                        {!(isSelectionLocked || isRevealing || uiMirrorReveal || uiRevealActive) ? (
                          <div className="text-2xl font-bold text-primary">
                            {Math.ceil(timeRemaining)}s remaining
                          </div>
                        ) : (
                          <p className="text-lg text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Revealing selection...</p>
                        )}
                      </div>
                  </div>
                </div>

                {/* Triple Draft Cards */}
                <TripleDraftCards
                  cards={roomCards.filter(card => card.round_number === room.current_round)}
                  selectedCard={selectedCard}
                  userRole={userRole}
                  isSelectionLocked={isSelectionLocked || uiMirrorReveal || uiRevealActive}
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
                    <h2 className="text-2xl font-bold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Mega Draft</h2>
                    <div className="text-lg font-semibold text-primary">
                      Progress: {Math.min((room.mega_draft_turn_count || 0) + 1, 23)}/23 cards selected
                    </div>
                  </div>
                  <div className="space-y-4 min-h-[7rem]">
                    {/* Player Names with Turn Arrow */}
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
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
                        <div className="text-sm text-primary font-medium mt-1 min-h-[1.25rem]">
                          {isMyTurn ? 'Your turn' : 'Opponent\'s turn'}
                        </div>
                      </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-lg font-semibold text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">
                          {room.joiner_name} {room.first_pick_player === 'joiner' ? '(First Pick)' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="min-h-[2.5rem]">
                      {!isSelectionLocked ? (
                        <div className="text-2xl font-bold text-primary">
                          {Math.ceil(timeRemaining)}s remaining
                        </div>
                      ) : (
                        <p className="text-lg text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Processing selection...</p>
                      )}
                    </div>
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
              <p className="text-lg lg:text-xl text-[hsl(260_90%_10%)] dark:text-[hsl(240_10%_85%)]">Good luck, have fun!</p>
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