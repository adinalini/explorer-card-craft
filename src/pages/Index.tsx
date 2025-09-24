import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import whiteRabbit from "@/assets/white_rabbit.webp"

const Index = () => {
  // Force rebuild to clear videoRef cache issue
  const navigate = useNavigate()
  const [currentVideo, setCurrentVideo] = useState<'original' | 'reverse'>('original')
  const originalVideoRef = useRef<HTMLVideoElement>(null)
  const reverseVideoRef = useRef<HTMLVideoElement>(null)

  // Handle video end with immediate next video start and crossfade
  const handleVideoEnd = () => {
    const nextVideo = currentVideo === 'original' ? 'reverse' : 'original'
    const nextVideoRef = currentVideo === 'original' ? reverseVideoRef : originalVideoRef
    
    // Start next video immediately
    if (nextVideoRef.current) {
      nextVideoRef.current.currentTime = 0
      nextVideoRef.current.play().catch(() => {})
    }
    
    // Switch after brief delay for crossfade
    setTimeout(() => {
      setCurrentVideo(nextVideo)
    }, 200) // 0.2s crossfade
  }

  useEffect(() => {
    // Preload and prepare both videos
    const original = originalVideoRef.current
    const reverse = reverseVideoRef.current
    
    if (original && reverse) {
      // Prepare the reverse video (paused and ready)
      reverse.currentTime = 0
      reverse.pause()
    }
  }, [])

  return (
    <>
      <SEOHead 
        title="Project O Zone"
        description="Master the cards, build decks, battle in drafts, and explore random strategies! Your complete Project O gaming hub."
        image="/og-images/homepage.jpg"
        url="/"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(var(--draft-background-start))] to-[hsl(var(--draft-background-end))]">
        {/* Background Videos */}
        <div className="absolute inset-0 z-0">
          {/* Original Video */}
          <video 
            ref={originalVideoRef}
            autoPlay 
            muted 
            playsInline
            preload="auto"
            poster="/lovable-uploads/918d2f07-eec2-4aea-9105-f29011a86707.png"
            onEnded={handleVideoEnd}
            className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
              currentVideo === 'original' ? 'opacity-40' : 'opacity-0'
            }`}
            onLoadedData={(e) => {
              const video = e.currentTarget;
              video.playbackRate = 0.8;
            }}
            style={{ position: 'absolute' }}
          >
            <source src="/animated_card_reel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Reverse Video - Always mounted */}
          <video 
            ref={reverseVideoRef}
            muted 
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
              currentVideo === 'reverse' ? 'opacity-40' : 'opacity-0'
            }`}
            onLoadedData={(e) => {
              const video = e.currentTarget;
              video.playbackRate = 0.8;
            }}
            style={{ position: 'absolute' }}
          >
            <source src="/animated card reel reverse.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Abstract Blobs - Removed as requested */}
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle className="text-[hsl(var(--homepage-text))] hover:bg-white/10 dark:hover:bg-black/20" />
        </div>

        {/* Top - Project O Zone Title with Logo */}
        <div className="relative z-10 h-[15vh] sm:h-[20vh] flex flex-col items-center justify-center px-4">
          <div className="flex items-center text-3xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl">
            <span 
              className="bg-gradient-to-r from-[hsl(320_100%_50%)] via-[hsl(290_90%_45%)] to-[hsl(320_100%_50%)] dark:from-[hsl(320_100%_75%)] dark:via-[hsl(290_90%_65%)] dark:to-[hsl(320_100%_75%)] bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease infinite' }}
            >
              Project{" "}
            </span>
            {/* Logo O - Purple in light mode, Red in dark mode */}
            <div className="inline-block mx-1 sm:mx-2">
              <img 
                src="/lovable-uploads/219c067b-3ac3-4955-96d1-76dc64562ea1.png" 
                alt="O Logo" 
                className="w-8 sm:w-16 md:w-20 lg:w-24 h-auto dark:hidden"
              />
              <img 
                src="/lovable-uploads/fc4bded4-d154-4368-9ba7-fcc6d9eedc5b.png" 
                alt="O Logo" 
                className="w-8 sm:w-16 md:w-20 lg:w-24 h-auto hidden dark:block"
              />
            </div>
            <span 
              className="bg-gradient-to-r from-[hsl(320_100%_50%)] via-[hsl(290_90%_45%)] to-[hsl(320_100%_50%)] dark:from-[hsl(320_100%_75%)] dark:via-[hsl(290_90%_65%)] dark:to-[hsl(320_100%_75%)] bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease infinite' }}
            >
              {" "}Zone
            </span>
          </div>
        </div>

        {/* Main Content - Rabbit, Buttons, and Video */}
        <div className="relative z-10 h-[85vh] sm:h-[80vh] flex items-center justify-center px-4 sm:px-8">
          {/* Left Side - Rabbit */}
          <div className="absolute bottom-0 left-0 z-5">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[510px] sm:w-[595px] md:w-[680px] lg:w-[765px] object-contain animate-fade-in transform -translate-x-24"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Center - Buttons */}
          <div className="flex items-center justify-center z-10 ml-24 sm:ml-32 md:ml-40 lg:ml-48">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-64 sm:w-72 md:w-80">
              {/* Cards Button */}
              <Button 
                onClick={() => navigate('/cards')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                Cards
              </Button>

              {/* Decks Button */}
              <Button 
                onClick={() => navigate('/decks')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                Decks
              </Button>

              {/* Draft Button */}
              <Button 
                onClick={() => navigate('/draft')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                Draft
              </Button>

              {/* Random Deck Button */}
              <Button 
                onClick={() => navigate('/random')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in flex items-center justify-center"
                style={{ animationDelay: '0.6s' }}
              >
                <span className="text-center leading-tight text-xs sm:text-sm md:text-base">
                  Random<br />Deck
                </span>
              </Button>
            </div>
          </div>

        </div>


      </div>
    </>
  )
}

export default Index