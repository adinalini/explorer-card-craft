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
      const { data: room, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId.toUpperCase())
        .single()

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
          title: "Room Full",
          description: "This room already has two players.",
          variant: "destructive"
        })
        return
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update({ joiner_name: joinerName.trim() })
        .eq('id', roomId.toUpperCase())

      if (updateError) throw updateError

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
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center text-primary">Create New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-primary">Draft Type:</Label>
                    <RadioGroup value={draftType} onValueChange={setDraftType} className="grid grid-cols-1 gap-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 hover:scale-105 transition-all">
                        <RadioGroupItem value="default" id="default" />
                        <Label htmlFor="default" className="text-lg cursor-pointer text-primary font-semibold">Default</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 hover:scale-105 transition-all">
                        <RadioGroupItem value="triple" id="triple" />
                        <Label htmlFor="triple" className="text-lg cursor-pointer text-primary font-semibold">Triple Draft</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/20 hover:scale-105 transition-all">
                        <RadioGroupItem value="mega" id="mega" />
                        <Label htmlFor="mega" className="text-lg cursor-pointer text-primary font-semibold">Mega Draft</Label>
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
                <DialogHeader>
                  <DialogTitle className="text-2xl text-center text-primary">Join Room</DialogTitle>
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
