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
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReverse, setIsReverse] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      // Switch to the other video
      setIsReverse(!isReverse)
      video.currentTime = 0
      video.play()
    }

    video.addEventListener('ended', handleVideoEnd)
    
    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [isReverse])

  return (
    <>
      <SEOHead 
        title="Project O Zone"
        description="Master the cards, build decks, battle in drafts, and explore random strategies! Your complete Project O gaming hub."
        image="/og-images/homepage.jpg"
        url="/"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(var(--homepage-background-start))] to-[hsl(var(--homepage-background-end))]">
        {/* Background Video with Reverse Feature */}
        <div className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            autoPlay 
            loop={false}
            muted 
            className="video-background"
          >
            <source src={isReverse ? "/animated_card_reel_reverse.mp4" : "/animated_card_reel.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Project O Style Guide - Irregular Abstract Shapes */}
        <div className="absolute top-10 left-8 w-32 h-32 bg-gradient-to-br from-[hsl(var(--project-o-bright-cyan))] to-[hsl(var(--project-o-purple))] opacity-20 shape-irregular animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-20 right-12 w-24 h-24 bg-gradient-to-br from-[hsl(var(--project-o-neon-green))] to-[hsl(var(--project-o-cyan))] opacity-25 asymmetric-cut animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-[hsl(var(--project-o-orange))] to-[hsl(var(--project-o-hot-pink))] opacity-15 shape-diagonal-cut animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-16 right-20 w-28 h-28 bg-gradient-to-br from-[hsl(var(--project-o-purple-neon))] to-[hsl(var(--project-o-pink-bright))] opacity-20 shape-clean animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }}></div>
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Top - Project O Zone Title */}
          <div className="flex-none h-[25vh] flex flex-col items-center justify-center px-4">
            <h1 className="text-impact-title text-[hsl(var(--homepage-text))] text-center leading-none drop-shadow-2xl effect-chromatic-aberration">
              PROJECT O ZONE
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