import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import whiteRabbit from "@/assets/white_rabbit.webp"
import projectOLogo from "/lovable-uploads/219c067b-3ac3-4955-96d1-76dc64562ea1.png"

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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
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
          <ThemeToggle className="text-white hover:bg-cyan-400/20 hover:text-cyan-400 transition-all duration-300" />
        </div>

        {/* Top - Project O Zone Title with Logo */}
        <div className="relative z-10 h-[18vh] sm:h-[22vh] flex flex-col items-center justify-center px-4 py-4">
          <div className="flex items-center justify-center text-3xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl leading-none">
            <span 
              className="inline-block bg-gradient-to-r leading-none align-baseline pb-[0.08em]"
              style={{ 
                background: 'var(--title-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '100% 200%',
                backgroundPosition: '50% 0%'
              }}
            >
              Project{" "}
            </span>
            {/* Logo O with CSS masking */}
            <div 
              aria-label="Project O Logo"
              className="inline-block w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-1 sm:mx-2 md:mx-3"
              style={{
                background: 'var(--title-gradient)',
                WebkitMaskImage: `url(${projectOLogo})`,
                maskImage: `url(${projectOLogo})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
            />
            <span 
              className="inline-block bg-gradient-to-r leading-none align-baseline pb-[0.08em]"
              style={{ 
                background: 'var(--title-gradient)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '100% 200%',
                backgroundPosition: '50% 0%'
              }}
            >
              Zone
            </span>
          </div>
        </div>

        {/* Main Content - Rabbit, Buttons, and Video */}
        <div className="relative z-10 h-[82vh] sm:h-[78vh] flex items-center justify-center px-4 sm:px-8">
          {/* Left Side - Rabbit */}
          <div className="absolute bottom-0 left-0 z-5">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[459px] sm:w-[536px] md:w-[612px] lg:w-[689px] object-contain animate-fade-in transform -translate-x-24"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Center - Buttons */}
          <div className="flex items-center justify-center z-10 ml-24 sm:ml-32 md:ml-40 lg:ml-48">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-64 sm:w-72 md:w-80">
              {/* Cards Button */}
              <Button 
                onClick={() => navigate('/cards')}
                className="h-12 sm:h-14 md:h-16 bg-white dark:bg-slate-900/90 border border-cyan-400/50 text-slate-900 dark:text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-white transition-all duration-300"
                style={{ animationDelay: '0.3s' }}
              >
                Cards
              </Button>

              {/* Decks Button */}
              <Button 
                onClick={() => navigate('/decks')}
                className="h-12 sm:h-14 md:h-16 bg-white dark:bg-slate-900/90 border border-cyan-400/50 text-slate-900 dark:text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-white transition-all duration-300"
                style={{ animationDelay: '0.4s' }}
              >
                Decks
              </Button>

              {/* Draft Button */}
              <Button 
                onClick={() => navigate('/draft')}
                className="h-12 sm:h-14 md:h-16 bg-white dark:bg-slate-900/90 border border-cyan-400/50 text-slate-900 dark:text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-white transition-all duration-300"
                style={{ animationDelay: '0.5s' }}
              >
                Draft
              </Button>

              {/* Random Deck Button */}
              <Button 
                onClick={() => navigate('/random')}
                className="h-12 sm:h-14 md:h-16 bg-white dark:bg-slate-900/90 border border-cyan-400/50 text-slate-900 dark:text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in flex items-center justify-center hover:bg-cyan-400 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-white transition-all duration-300"
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