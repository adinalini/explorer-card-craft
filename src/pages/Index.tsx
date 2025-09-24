import { useState, useRef, useEffect, type SyntheticEvent } from "react"
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

  // Seamless loop: freeze last frame for 0.2s, then switch to the other video (already playing)
  const FREEZE_MS = 200;
  const isSwitchingRef = useRef(false);

  const prepareAndSwitch = (current: 'original' | 'reverse') => {
    const currentRef = current === 'original' ? originalVideoRef : reverseVideoRef;
    const nextRef = current === 'original' ? reverseVideoRef : originalVideoRef;
    const next = current === 'original' ? 'reverse' : 'original';

    if (!currentRef.current || !nextRef.current) return;

    // Hold the last frame of the current video
    currentRef.current.pause();

    // Prepare and start the next video behind the scenes
    try {
      nextRef.current.currentTime = 0;
      nextRef.current.play().catch(() => {});
    } catch {}

    // After a short freeze, reveal the next video (crossfade handled by CSS)
    setTimeout(() => {
      setCurrentVideo(next);
      isSwitchingRef.current = false;
    }, FREEZE_MS);
  };

  const handleTimeUpdate = (current: 'original' | 'reverse', e: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (isSwitchingRef.current) return;
    const video = e.currentTarget as HTMLVideoElement;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    const remaining = video.duration - video.currentTime;
    if (remaining <= FREEZE_MS / 1000) {
      isSwitchingRef.current = true;
      prepareAndSwitch(current);
    }
  };

  // Fallback in case 'ended' fires before our timeupdate threshold
  const handleVideoEnd = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (isSwitchingRef.current) return;
    isSwitchingRef.current = true;
    const current = e.currentTarget === originalVideoRef.current ? 'original' : 'reverse';
    prepareAndSwitch(current);
  };

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
            onTimeUpdate={(e) => handleTimeUpdate('original', e)}
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
            poster="/lovable-uploads/918d2f07-eec2-4aea-9105-f29011a86707.png"
            onEnded={handleVideoEnd}
            onTimeUpdate={(e) => handleTimeUpdate('reverse', e)}
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
          <div className="flex items-center justify-center text-3xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl leading-[1.05]">
            <span 
              className="inline-block bg-gradient-to-r leading-none align-baseline pb-[0.18em]"
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
              className="inline-block bg-gradient-to-r leading-none align-baseline pb-[0.18em]"
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

          {/* Right Side - Buttons */}
          <div className="absolute right-4 sm:right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-10">
            <div className="relative grid grid-cols-2 w-80 sm:w-96 md:w-[420px] lg:w-[480px]" style={{ height: '459px' }}>
              {/* Cross-style borders */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30 -translate-x-0.5"></div>
                {/* Horizontal line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30 -translate-y-0.5"></div>
              </div>
              
              {/* Cards Button */}
              <div 
                onClick={() => navigate('/cards')}
                className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Cards
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-tight">
                  View all the cards along with their variants and blueprints. You can also browse through old versions and download the images.
                </div>
              </div>

              {/* Decks Button */}
              <div 
                onClick={() => navigate('/decks')}
                className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Decks
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Browse through the featured decks that have secured positions or community decks made you. Deck builder feature with deck codes available.
                </div>
              </div>

              {/* Draft Button */}
              <div 
                onClick={() => navigate('/draft')}
                className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Draft
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Play a draft game with someone. Current modes available are: Default double draft and triple draft. Mega Draft coming soon.
                </div>
              </div>

              {/* Random Deck Button */}
              <div 
                onClick={() => navigate('/random')}
                className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Random Deck
                </div>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-center leading-tight">
                  Feeling adventurous? Just play a random deck.
                </div>
              </div>
            </div>
          </div>

        </div>


      </div>
    </>
  )
}

export default Index