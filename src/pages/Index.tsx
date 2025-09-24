import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import whiteRabbit from "@/assets/white_rabbit.webp"
import logoIcon from "@/assets/ProjectOLogoIcon_512x512.png"
import logoDark from "@/assets/ProjectOLogo_Dark.png"

const Index = () => {
  const navigate = useNavigate()
  const [currentVideo, setCurrentVideo] = useState(0)
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)

  const videos = [
    "/animated_card_reel.mp4",
    "/animated_card_reel_reverse.mp4"
  ]

  useEffect(() => {
    const video1 = videoRef1.current
    const video2 = videoRef2.current
    
    if (!video1 || !video2) return

    const handleVideoEnd = () => {
      setCurrentVideo(prev => {
        const nextVideo = prev === 0 ? 1 : 0
        const nextVideoRef = nextVideo === 0 ? video1 : video2
        const currentVideoRef = nextVideo === 0 ? video2 : video1
        
        // Start next video
        nextVideoRef.currentTime = 0
        nextVideoRef.play()
        
        // Hide current video
        currentVideoRef.style.opacity = '0'
        nextVideoRef.style.opacity = '0.25'
        
        return nextVideo
      })
    }

    video1.addEventListener('ended', handleVideoEnd)
    video2.addEventListener('ended', handleVideoEnd)
    
    // Start first video
    video1.style.opacity = '0.25'
    video2.style.opacity = '0'
    video1.play()

    return () => {
      video1.removeEventListener('ended', handleVideoEnd)
      video2.removeEventListener('ended', handleVideoEnd)
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(var(--homepage-background-start))] to-[hsl(var(--homepage-background-end))]">
        {/* Background Videos */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef1}
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 opacity-25"
            poster="/og-images/homepage.jpg"
            preload="auto"
          >
            <source src={videos[0]} type="video/mp4" />
          </video>
          <video 
            ref={videoRef2}
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 opacity-0"
            preload="auto"
          >
            <source src={videos[1]} type="video/mp4" />
          </video>
        </div>
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle className="text-[hsl(var(--homepage-text))]" />
        </div>

        {/* Top - Project O Zone Title with Center Logo */}
        <div className="relative z-10 h-[15vh] sm:h-[20vh] flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-2xl bg-gradient-to-r from-[hsl(258,42%,22%)] to-[hsl(339,86%,44%)] dark:from-[hsl(352,100%,46%)] dark:to-[hsl(339,94%,40%)] bg-clip-text text-transparent">
              Project
            </h1>
            
            {/* Center O Logo */}
            <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20">
              <img 
                src={logoIcon}
                alt="Project O Logo" 
                className="w-full h-full object-contain hidden dark:block"
              />
              <img 
                src={logoDark}
                alt="Project O Logo" 
                className="w-full h-full object-contain dark:hidden"
              />
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-2xl bg-gradient-to-r from-[hsl(258,42%,22%)] to-[hsl(339,86%,44%)] dark:from-[hsl(352,100%,46%)] dark:to-[hsl(339,94%,40%)] bg-clip-text text-transparent">
              Zone
            </h1>
          </div>
        </div>

        {/* Main Content - Rabbit, Buttons, and Video */}
        <div className="relative z-10 h-[85vh] sm:h-[80vh] flex items-center justify-center px-4 sm:px-8">
          {/* Left Side - Rabbit */}
          <div className="absolute bottom-0 left-0 z-5">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[510px] sm:w-[595px] md:w-[680px] lg:w-[765px] object-contain transform -translate-x-24"
            />
          </div>

          {/* Center - Buttons */}
          <div className="flex items-center justify-center z-10 ml-24 sm:ml-32 md:ml-40 lg:ml-48">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-64 sm:w-72 md:w-80">
              {/* Cards Button */}
              <Button 
                onClick={() => navigate('/cards')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm"
              >
                Cards
              </Button>

              {/* Decks Button */}
              <Button 
                onClick={() => navigate('/decks')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-purple-400/50 text-purple-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm"
              >
                Decks
              </Button>

              {/* Draft Button */}
              <Button 
                onClick={() => navigate('/draft')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-orange-400/50 text-orange-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm"
              >
                Draft
              </Button>

              {/* Random Deck Button */}
              <Button 
                onClick={() => navigate('/random')}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-green-400/50 text-green-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center justify-center"
              >
                <span className="text-center leading-tight text-xs sm:text-sm md:text-base">
                  Random<br />Deck
                </span>
              </Button>
            </div>
          </div>

        </div>


        {/* Wave Divider at bottom */}
        <div className="absolute bottom-0 left-0 w-full z-5">
          <WaveDivider 
            className="h-16 sm:h-24 opacity-60" 
            inverted={false}
          />
        </div>

      </div>
    </>
  )
}

export default Index