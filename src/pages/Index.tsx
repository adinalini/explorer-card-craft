import { useState, useRef, useEffect, type SyntheticEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate, useLocation } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import { usePasswordProtection } from "@/hooks/usePasswordProtection"
import { useToast } from "@/hooks/use-toast"
import { PasswordGate } from "@/components/PasswordGate"
import { NavigationButtons } from "@/components/NavigationButtons"
import whiteRabbit from "@/assets/white_rabbit.webp"
import projectOLogo from "/lovable-uploads/219c067b-3ac3-4955-96d1-76dc64562ea1.png"

const Index = () => {
  // Force rebuild to clear videoRef cache issue
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { isAuthenticated, isLoading, verifyPassword } = usePasswordProtection()
  const [password, setPassword] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<'original' | 'reverse'>('original')
  const [videosLoaded, setVideosLoaded] = useState(false)
  const originalVideoRef = useRef<HTMLVideoElement>(null)
  const reverseVideoRef = useRef<HTMLVideoElement>(null)
  const [disableOriginal, setDisableOriginal] = useState(false)
  const [disableReverse, setDisableReverse] = useState(false)
  const errorCountsRef = useRef<{ original: number; reverse: number }>({ original: 0, reverse: 0 })

  // Seamless loop: use natural video end event for better timing
  const FREEZE_MS = 100;
  const isSwitchingRef = useRef(false);
  const lastSwitchTimeRef = useRef(0);

  const prepareAndSwitch = (current: 'original' | 'reverse') => {
    // Debounce: prevent rapid successive switches
    const now = Date.now();
    if (now - lastSwitchTimeRef.current < 800) return;
    lastSwitchTimeRef.current = now;

    const currentRef = current === 'original' ? originalVideoRef : reverseVideoRef;
    const nextRef = current === 'original' ? reverseVideoRef : originalVideoRef;
    const next = current === 'original' ? 'reverse' : 'original';

    if (!currentRef.current) return;

    // If next video is disabled, simply restart the current one
    if ((next === 'reverse' && disableReverse) || (next === 'original' && disableOriginal) || !nextRef.current) {
      try {
        currentRef.current.currentTime = 0;
        currentRef.current.play().catch(() => {});
      } catch {}
      isSwitchingRef.current = false;
      return;
    }

    console.log(`Switching from ${current} to ${next}`);

    try {
      nextRef.current.currentTime = 0;
      nextRef.current.play().catch(() => {});
    } catch (e) {
      console.error('Error starting next video:', e);
    }

    setCurrentVideo(next);

    setTimeout(() => {
      isSwitchingRef.current = false;
    }, FREEZE_MS);
  };

  const handleTimeUpdate = (current: 'original' | 'reverse', e: SyntheticEvent<HTMLVideoElement, Event>) => {
    if (isSwitchingRef.current) return;
    const video = e.currentTarget as HTMLVideoElement;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    
    // Only switch very close to the end (last 50ms)
    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.05 && remaining > 0) {
      console.log(`Time update switch triggered for ${current}, remaining: ${remaining}s`);
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

  // Handle video errors with bounded retries and graceful fallback
  const handleVideoError = (current: 'original' | 'reverse', e: SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget as HTMLVideoElement;
    const counts = errorCountsRef.current;
    counts[current] = (counts[current] ?? 0) + 1;

    console.warn(`Video error for ${current} (attempt ${counts[current]}), handling...`);

    // Try up to 2 quick retries
    if (counts[current] <= 2) {
      setTimeout(() => {
        try {
          video.pause();
          video.currentTime = 0;
          video.load();
          video.play().catch(() => {});
        } catch {}
      }, 500);
      return;
    }

    // Disable the problematic video and fall back to the other
    if (current === 'reverse') {
      setDisableReverse(true);
    } else {
      setDisableOriginal(true);
    }

    const otherRef = current === 'original' ? reverseVideoRef : originalVideoRef;
    const otherDisabled = current === 'original' ? disableReverse : disableOriginal;
    const next = current === 'original' ? 'reverse' : 'original';

    if (!otherDisabled && otherRef.current) {
      isSwitchingRef.current = true;
      try {
        otherRef.current.currentTime = 0;
        otherRef.current.play().catch(() => {});
      } catch {}
      setCurrentVideo(next);
      setTimeout(() => {
        isSwitchingRef.current = false;
      }, FREEZE_MS);
    } else {
      // Both videos unavailable; keep fallback background visible
      setVideosLoaded(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    setIsVerifying(true)
    
    const isValid = await verifyPassword(password)
    
    if (isValid) {
      toast({
        title: "Access granted",
        description: "Welcome to Project O Zone!"
      })
      
      // Redirect to intended destination if it exists
      const from = (location.state as { from?: string })?.from
      if (from && from !== "/") {
        navigate(from, { replace: true })
      }
    } else {
      toast({
        title: "Access denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive"
      })
    }
    
    setIsVerifying(false)
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
          {/* Fallback Background Image */}
          <div 
            className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-300 ${
              videosLoaded ? 'opacity-0' : 'opacity-40'
            }`}
            style={{
              backgroundImage: 'url(/lovable-uploads/3bc78144-de54-443f-8b86-d8f5835966a1.png)'
            }}
          />
          
          {/* Original Video */}
          {!disableOriginal && (
            <video 
              ref={originalVideoRef}
              autoPlay 
              muted 
              playsInline
              preload="auto"
              poster="/lovable-uploads/3bc78144-de54-443f-8b86-d8f5835966a1.png"
              onEnded={handleVideoEnd}
              onTimeUpdate={(e) => handleTimeUpdate('original', e)}
              onError={(e) => handleVideoError('original', e)}
              className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                currentVideo === 'original' ? 'opacity-40' : 'opacity-0'
              }`}
              onLoadedData={(e) => {
                const video = e.currentTarget;
                video.playbackRate = 0.8;
                setVideosLoaded(true);
              }}
              style={{ position: 'absolute' }}
            >
              <source src="/animated_card_reel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Reverse Video */}
          {!disableReverse && (
            <video 
              ref={reverseVideoRef}
              muted 
              playsInline
              preload="auto"
              poster="/lovable-uploads/3bc78144-de54-443f-8b86-d8f5835966a1.png"
              onEnded={handleVideoEnd}
              onTimeUpdate={(e) => handleTimeUpdate('reverse', e)}
              onError={(e) => handleVideoError('reverse', e)}
              className={`w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                currentVideo === 'reverse' ? 'opacity-40' : 'opacity-0'
              }`}
              onLoadedData={(e) => {
                const video = e.currentTarget;
                video.playbackRate = 0.8;
              }}
              style={{ position: 'absolute' }}
            >
              <source src="/animated_card_reel_reverse.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Abstract Blobs - Removed as requested */}
        

        {/* Top - Project O Zone Title with Logo */}
        <div className="relative z-10 h-[18vh] sm:h-[22vh] flex flex-col items-center justify-center px-4 py-4">
          <div className={`flex items-center justify-center text-5xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl leading-[1.05] ${videosLoaded ? 'opacity-75' : ''}`}>
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
              className="inline-block w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-1 sm:mx-2 md:mx-3"
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

        {/* Skull and Arrows Image - Positioned absolutely to not affect button layout */}
        <div className="absolute top-[18vh] sm:top-[22vh] left-1/2 -translate-x-1/2 z-5">
          <img 
            src="/lovable-uploads/skull-arrows.png" 
            alt="Skull with crossed arrows decoration" 
            className="w-14 h-14 sm:w-19 sm:h-19 md:w-24 md:h-24 object-contain animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          />
        </div>

        {/* Desktop Layout - Rabbit Left, Red Character Right, Buttons Center */}
        <div className="hidden md:block relative z-10 h-[82vh] sm:h-[78vh]">
          {/* Sketch Pattern - Left side, middle height */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-5 hidden xl:block">
            <img 
              src="/lovable-uploads/sketch-pattern.png" 
              alt="Sketch pattern decoration" 
              className="w-32 h-32 lg:w-40 lg:h-40 object-contain animate-fade-in opacity-60"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
          {/* Left Side - Rabbit (hidden on xl and smaller when space is tight) */}
          <div className="absolute bottom-0 left-0 z-5 hidden 2xl:block">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[729px] object-contain animate-fade-in transform -translate-x-24"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Right Side - Red Character (hidden first when space is tight, centered to rabbit height) */}
          <div className="absolute bottom-0 right-0 z-5 hidden 2xl:block">
            <img 
              src="/lovable-uploads/eba0e4ff-4de0-48d3-89b7-2c962d6b6c27.png" 
              alt="Red Character" 
              className="w-[551px] object-contain animate-fade-in transform translate-x-24"
              style={{ 
                animationDelay: '0.2s',
                transform: 'translateX(96px) translateY(-46px)' // Center to rabbit height + translate out
              }}
            />
          </div>

          {/* Rabbit only layout (when red is hidden but rabbit fits) - buttons moved to right */}
          <div className="absolute bottom-0 left-0 z-5 hidden xl:block 2xl:hidden">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[729px] object-contain animate-fade-in transform -translate-x-12"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Center - Buttons or Password Gate (when both characters visible) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden 2xl:block">
            {!isLoading && (
              isAuthenticated ? (
                <NavigationButtons />
              ) : (
                <PasswordGate onPasswordSubmit={handlePasswordSubmit} isVerifying={isVerifying} />
              )
            )}
          </div>

          {/* Right-aligned Buttons (when only rabbit visible) */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 transform translate-x-[-120px] z-10 hidden xl:block 2xl:hidden">
            {!isLoading && (
              isAuthenticated ? (
                <NavigationButtons />
              ) : (
                <PasswordGate onPasswordSubmit={handlePasswordSubmit} isVerifying={isVerifying} />
              )
            )}
          </div>

          {/* Center Buttons (when no characters visible) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block xl:hidden">
            {!isLoading && (
              isAuthenticated ? (
                <NavigationButtons />
              ) : (
                <PasswordGate onPasswordSubmit={handlePasswordSubmit} isVerifying={isVerifying} />
              )
            )}
          </div>
        </div>

        {/* Mobile Layout - Stacked vertically */}
        <div className="block md:hidden relative z-10 h-[82vh] sm:h-[78vh] flex flex-col items-center justify-center px-4 space-y-4 pt-8">
          {/* Buttons or Password Gate Section */}
          <div className="flex-shrink-0 w-full flex justify-center">
            {!isLoading && (
              isAuthenticated ? (
                <NavigationButtons sizeVariant="small" />
              ) : (
                <PasswordGate onPasswordSubmit={handlePasswordSubmit} isVerifying={isVerifying} />
              )
            )}
          </div>

          {/* Rabbit at bottom center on mobile */}
          <div className="flex-shrink-0 flex justify-center">
            <img 
              src={whiteRabbit} 
              alt="White Rabbit Character" 
              className="w-[338px] object-contain animate-fade-in"
              style={{ animationDelay: '0.7s' }}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-4 max-w-full pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm px-3 sm:px-6 py-2 rounded-md max-w-full">
            <p className="text-[10px] sm:text-xs text-slate-300 text-center leading-tight">
              This is not an official Project O website. Project O Zone is a community initiative. All assets used with permission.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Index