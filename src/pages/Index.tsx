import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import whiteRabbit from "@/assets/white_rabbit.webp"

const Index = () => {
  const navigate = useNavigate()
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [isReversed, setIsReversed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoEnd = () => {
    setIsReversed(!isReversed)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  const getTextColor = () => {
    if (!hoveredButton) return "text-[hsl(var(--homepage-text))]"
    
    switch (hoveredButton) {
      case 'cards':
        return "text-[hsl(var(--homepage-button-cards))]"
      case 'decks':
        return "text-[hsl(var(--homepage-button-decks))]"
      case 'draft':
        return "text-[hsl(var(--homepage-button-draft))]"
      case 'random':
        return "text-[hsl(var(--homepage-button-random))]"
      default:
        return "text-[hsl(var(--homepage-text))]"
    }
  }

  return (
    <>
      <SEOHead 
        title="Project O Zone"
        description="Master the cards, build decks, battle in drafts, and explore random strategies! Your complete Project O gaming hub."
        image="/og-images/homepage.jpg"
        url="/"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(var(--homepage-background-start))] to-[hsl(var(--homepage-background-end))]">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            onEnded={handleVideoEnd}
            className={`w-full h-full object-cover opacity-20 transition-transform duration-1000 ${isReversed ? 'scale-x-[-1]' : ''}`}
            onLoadedData={(e) => {
              const video = e.currentTarget;
              video.playbackRate = 0.8;
            }}
          >
            <source src="/animated_card_reel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Abstract Blobs */}
        <Blob variant="pink" size="lg" className="top-20 left-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <Blob variant="yellow" size="md" className="top-32 right-20 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <Blob variant="orange" size="sm" className="bottom-40 left-32 animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }} />
        <Blob variant="pink" size="md" className="bottom-20 right-16 animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }} />
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle className="text-[hsl(var(--homepage-text))] hover:bg-white/10 dark:hover:bg-black/20" />
        </div>

        {/* Top - Project O Zone Title */}
        <div className="relative z-10 h-[15vh] sm:h-[20vh] flex flex-col items-center justify-center px-4">
          <h1 className={`text-3xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl ${getTextColor()}`}>
            Project O Zone
          </h1>
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