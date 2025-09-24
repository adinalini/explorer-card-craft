import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import whiteRabbit from "@/assets/white_rabbit.webp"
import projectOLogoLight from "@/assets/project-o-logo-light.png"
import projectOLogoDark from "@/assets/project-o-logo-dark.png"

const Index = () => {
  const navigate = useNavigate()
  const videoRef1 = useRef<HTMLVideoElement>(null)
  const videoRef2 = useRef<HTMLVideoElement>(null)
  const [activeVideo, setActiveVideo] = useState(1)

  useEffect(() => {
    const video1 = videoRef1.current
    const video2 = videoRef2.current
    if (!video1 || !video2) return

    const handleVideo1End = () => {
      setActiveVideo(2)
      video2.currentTime = 0
      video2.play()
    }

    const handleVideo2End = () => {
      setActiveVideo(1)
      video1.currentTime = 0
      video1.play()
    }

    video1.addEventListener('ended', handleVideo1End)
    video2.addEventListener('ended', handleVideo2End)
    
    return () => {
      video1.removeEventListener('ended', handleVideo1End)
      video2.removeEventListener('ended', handleVideo2End)
    }
  }, [])

  // Preload both videos
  useEffect(() => {
    const video1 = videoRef1.current
    const video2 = videoRef2.current
    if (!video1 || !video2) return

    video1.load()
    video2.load()
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
        {/* Background Videos with Preloading */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef1}
            autoPlay 
            muted 
            preload="auto"
            poster="/animated_card_reel.jpg"
            className={`video-background transition-opacity duration-300 ${activeVideo === 1 ? 'opacity-25' : 'opacity-0'}`}
          >
            <source src="/animated_card_reel.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <video 
            ref={videoRef2}
            muted 
            preload="auto"
            className={`video-background absolute inset-0 transition-opacity duration-300 ${activeVideo === 2 ? 'opacity-25' : 'opacity-0'}`}
          >
            <source src="/animated_card_reel_reverse.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Top - Project O Zone Title */}
          <div className="flex-none h-[25vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-impact-title text-center leading-none drop-shadow-2xl effect-chromatic-aberration flex items-center justify-center gap-2">
              <span style={{ background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                PROJECT
              </span>
              <img 
                src={projectOLogoLight} 
                alt="O" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 inline-block dark:brightness-0 dark:invert dark:hue-rotate-[270deg] dark:saturate-200" 
              />
              <span style={{ background: 'var(--title-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                ZONE
              </span>
            </h1>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
            {/* Left Side - Rabbit */}
            <div className="absolute bottom-0 left-0 z-5 hidden lg:block">
              <img 
                src={whiteRabbit} 
                alt="White Rabbit Character" 
                className="w-[510px] sm:w-[595px] md:w-[680px] lg:w-[765px] object-contain animate-fade-in transform -translate-x-24"
                style={{ animationDelay: '0.2s' }}
              />
            </div>

            {/* Center - Buttons Grid */}
            <div className="flex items-center justify-center z-10 lg:ml-48">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-72 sm:w-80 md:w-96">
                {/* Cards Button - Neon Green */}
                <Button 
                  onClick={() => navigate('/cards')}
                  variant="neonGreen"
                  className="h-14 sm:h-16 md:h-18 text-sm sm:text-base md:text-lg animate-fade-in"
                  style={{ animationDelay: '0.3s' }}
                >
                  <span className="text-montserrat-black">CARDS</span>
                </Button>

                {/* Decks Button - Epic Purple */}
                <Button 
                  onClick={() => navigate('/decks')}
                  variant="epicPurple"
                  className="h-14 sm:h-16 md:h-18 text-sm sm:text-base md:text-lg animate-fade-in"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="text-montserrat-black">DECKS</span>
                </Button>

                {/* Draft Button - Rare Blue */}
                <Button 
                  onClick={() => navigate('/draft')}
                  variant="rareBlue"
                  className="h-14 sm:h-16 md:h-18 text-sm sm:text-base md:text-lg animate-fade-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="text-montserrat-black">DRAFT</span>
                </Button>

                {/* Random Deck Button - Legendary Orange */}
                <Button 
                  onClick={() => navigate('/random')}
                  variant="legendaryOrange"
                  className="h-14 sm:h-16 md:h-18 text-xs sm:text-sm md:text-base animate-fade-in flex items-center justify-center"
                  style={{ animationDelay: '0.6s' }}
                >
                  <span className="text-montserrat-black text-center leading-tight">
                    RANDOM<br />DECK
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index