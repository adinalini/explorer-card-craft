import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { createClient } from '@supabase/supabase-js'
import { toast } from "@/hooks/use-toast"

const Index = () => {
  const navigate = useNavigate()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [draftType, setDraftType] = useState("default")
  const [creatorName, setCreatorName] = useState("")
  const [joinerName, setJoinerName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const getUserSessionId = () => {
    let sessionId = sessionStorage.getItem('userSessionId')
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 16) + Date.now().toString(36)
      sessionStorage.setItem('userSessionId', sessionId)
    }
    return sessionId
  }

  const handleCreateRoom = async () => {
    if (!creatorName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to create a room.",
        variant: "destructive"
      })
      return
    }

    setIsCreating(true)
    const newRoomId = generateRoomId()

    try {
      const { error } = await supabase
        .from('rooms')
        .insert([{
          id: newRoomId,
          draft_type: draftType,
          creator_name: creatorName.trim(),
          status: 'waiting'
        }])

      if (error) throw error

      // Set session flag to indicate this user created this room
      const sessionId = getUserSessionId()
      localStorage.setItem(`room_${newRoomId}_creator`, sessionId)
      console.log('Creator session set:', { roomId: newRoomId, sessionId })
      setCreateDialogOpen(false)
      navigate(`/room/${newRoomId}`)
    } catch (error) {
      console.error('Error creating room:', error)
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!joinerName.trim() || !roomId.trim()) {
      toast({
        title: "Details Required",
        description: "Please enter both your name and room ID.",
        variant: "destructive"
      })
      return
    }

    setIsJoining(true)

    try {
      console.log('Attempting to join room:', { roomId: roomId.toUpperCase(), joinerName: joinerName.trim() })
      
      const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId.toUpperCase())
        .single()

      console.log('Fetched room data:', { room, fetchError })

      if (fetchError || !room) {
        toast({
          title: "Room Not Found",
          description: "The room ID you entered doesn't exist.",
          variant: "destructive"
        })
        return
      }

      if (room.joiner_name) {
        toast({
          title: "Draft has already begun",
          description: "This room already has two players.",
          variant: "destructive"
        })
        return
      }

      if (room.status === 'active' || room.status === 'completed') {
        toast({
          title: "Draft has already begun",
          description: "This room's draft is already in progress.",
          variant: "destructive"
        })
        return
      }

      // First create a game session for the joiner so they can update the room
      const sessionId = getUserSessionId()
      console.log('Creating game session for joiner:', { roomId: roomId.toUpperCase(), sessionId, joinerName: joinerName.trim() })
      
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          room_id: roomId.toUpperCase(),
          session_token: sessionId,
          player_role: 'joiner',
          player_name: joinerName.trim()
        })

      console.log('Game session creation result:', { sessionError })
      
      if (sessionError) throw sessionError

      console.log('Updating room with joiner:', { roomId: roomId.toUpperCase(), joinerName: joinerName.trim() })
      
      // Create a new supabase client instance with session token header
      const supabaseWithToken = createClient(
        "https://ophgbcyhxvwljfztlvyu.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGdiY3loeHZ3bGpmenRsdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzU4NzYsImV4cCI6MjA2OTkxMTg3Nn0.iiiRP6WtGtwI_jJDnAJUqmEZcoNUbYT3HiBl3VuBnKs",
        {
          global: {
            headers: {
              'x-session-token': sessionId
            }
          }
        }
      )
      
      const { data: updateData, error: updateError } = await supabaseWithToken
        .from('rooms')
        .update({ joiner_name: joinerName.trim() })
        .eq('id', roomId.toUpperCase())
        .select()

      console.log('Database update result:', { updateData, updateError })
      
      if (updateError) throw updateError

      // Set session flag to indicate this user joined this room  
      localStorage.setItem(`room_${roomId.toUpperCase()}_joiner`, sessionId)
      console.log('Joiner session set:', { roomId: roomId.toUpperCase(), sessionId })
      setJoinDialogOpen(false)
      navigate(`/room/${roomId.toUpperCase()}`)
    } catch (error) {
      console.error('Error joining room:', error)
      toast({
        title: "Error",
        description: "Failed to join room. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))]">
      {/* Abstract Blobs */}
      <Blob variant="pink" size="lg" className="top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }} />
      <Blob variant="yellow" size="md" className="top-32 right-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }} />
      <Blob variant="orange" size="sm" className="bottom-40 left-32 animate-bounce" style={{ animationDelay: '4s', animationDuration: '7s' }} />
      <Blob variant="pink" size="md" className="bottom-20 right-16 animate-bounce" style={{ animationDelay: '1s', animationDuration: '9s' }} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-16 drop-shadow-2xl">
            Project O Draft Battler
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105"
                >
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <div className="relative mb-4">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-full h-12"
                  >
                    <path
                      d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                      className="fill-gradient-to-r from-primary to-secondary"
                      fill="url(#gradient-create)"
                    />
                    <defs>
                      <linearGradient id="gradient-create" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <DialogHeader className="relative z-10 pt-6">
                  <DialogTitle className="text-2xl text-center text-white">Create New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-primary">Draft Type:</Label>
                     <RadioGroup value={draftType} onValueChange={setDraftType} className="grid grid-cols-1 gap-3">
                       <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 hover:scale-105 transition-all cursor-pointer">
                         <RadioGroupItem value="default" id="default" />
                         <span className="text-lg text-primary font-semibold">Default</span>
                       </label>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                          <RadioGroupItem value="triple" id="triple" disabled />
                          <span className="text-lg text-muted-foreground">Triple Draft (Not available)</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 border rounded-lg opacity-50 cursor-not-allowed">
                          <RadioGroupItem value="mega" id="mega" disabled />
                          <span className="text-lg text-muted-foreground">Mega Draft (Not available)</span>
                        </div>
                     </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="creator-name" className="text-lg font-semibold text-primary">Your Name:</Label>
                    <Input
                      id="creator-name"
                      placeholder="Enter your name"
                      value={creatorName}
                      onChange={(e) => setCreatorName(e.target.value)}
                      className="text-lg py-3"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCreateRoom} 
                    disabled={isCreating}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                  >
                    {isCreating ? "Creating..." : "Create Room"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 bg-transparent"
                >
                  Join Room
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <div className="relative mb-4">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-full h-12"
                  >
                    <path
                      d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                      className="fill-gradient-to-r from-primary to-secondary"
                      fill="url(#gradient-join)"
                    />
                    <defs>
                      <linearGradient id="gradient-join" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <DialogHeader className="relative z-10 pt-6">
                  <DialogTitle className="text-2xl text-center text-white">Join Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-id" className="text-lg font-semibold text-primary">Room ID:</Label>
                    <Input
                      id="room-id"
                      placeholder="Enter 4-character room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="text-lg py-3 uppercase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="joiner-name" className="text-lg font-semibold text-primary">Your Name:</Label>
                    <Input
                      id="joiner-name"
                      placeholder="Enter your name"
                      value={joinerName}
                      onChange={(e) => setJoinerName(e.target.value)}
                      className="text-lg py-3"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleJoinRoom}
                    disabled={isJoining}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                  >
                    {isJoining ? "Joining..." : "Join Room"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Wave Divider at bottom */}
      <div className="absolute bottom-0 w-full">
        <WaveDivider />
      </div>
    </div>
  );
};

export default Index;
