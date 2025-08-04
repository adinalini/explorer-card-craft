import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { WaveDivider } from "@/components/ui/wave-divider"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

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

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const [room, setRoom] = useState<Room | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    // Fetch initial room data
    fetchRoom()

    // Subscribe to room changes
    const channel = supabase
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
            setRoom(payload.new as Room)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
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

  const handleReady = async () => {
    if (!room) return

    const isCreator = !room.joiner_name
    const updateField = isCreator ? 'creator_ready' : 'joiner_ready'
    
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ [updateField]: !isReady })
        .eq('id', roomId!)

      if (error) throw error
      setIsReady(!isReady)
    } catch (error) {
      console.error('Error updating ready status:', error)
      toast({
        title: "Error",
        description: "Failed to update ready status.",
        variant: "destructive"
      })
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with wave */}
      <div className="bg-gradient-to-r from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] relative">
        <div className="py-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">Project O Draft Battle</h1>
          <p className="text-xl md:text-2xl">Draft Type: {getDraftTypeDisplay(room.draft_type)}</p>
        </div>
        <WaveDivider inverted />
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
        ) : (
          // Both players joined
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[60vh]">
            {/* Creator Side */}
            <div className="border-r-2 border-muted pr-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-primary">{room.creator_name}</h2>
                <div className="text-lg text-muted-foreground">Room Creator</div>
                
                {room.status === 'waiting' && (
                  <Button
                    onClick={handleReady}
                    variant={room.creator_ready ? "secondary" : "default"}
                    size="lg"
                    className="px-8 py-4 text-lg"
                    disabled={!room.joiner_name}
                  >
                    {room.creator_ready ? "Ready ✓" : "Ready?"}
                  </Button>
                )}
              </div>
            </div>

            {/* Joiner Side */}
            <div className="pl-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-primary">{room.joiner_name}</h2>
                <div className="text-lg text-muted-foreground">Joined Player</div>
                
                {room.status === 'waiting' && (
                  <div className="space-y-4">
                    <div className="text-lg">
                      {room.joiner_ready ? "Ready ✓" : "Getting Ready..."}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ready Status */}
        {room.joiner_name && room.status === 'waiting' && (
          <div className="text-center mt-12">
            <div className="text-xl text-muted-foreground mb-4">
              Waiting for both players to be ready...
            </div>
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${room.creator_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>{room.creator_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${room.joiner_ready ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>{room.joiner_name}</span>
              </div>
            </div>
            
            {room.creator_ready && room.joiner_ready && (
              <div className="mt-8 text-2xl font-bold text-primary animate-pulse">
                Starting Draft...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Room