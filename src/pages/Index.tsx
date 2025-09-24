import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"
import whiteRabbit from "@/assets/white_rabbit.webp"
import logoIcon from "@/assets/ProjectOLogoIcon_512x512.png"

const Index = () => {
  const navigate = useNavigate()
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

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
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover opacity-20"
            ref={(video) => {
              if (video) {
                video.playbackRate = 0.8;
              }
            }}
          >
            <source src="/animated_card_reel_reverse.mp4" type="video/mp4" />
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

        {/* Top - Project O Zone Title with Center Logo */}
        <div className="relative z-10 h-[15vh] sm:h-[20vh] flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold transition-colors duration-500 drop-shadow-2xl bg-gradient-to-r ${
              hoveredButton 
                ? getTextColor().replace('text-[hsl(var(--homepage-', 'from-[hsl(var(--homepage-').replace('))]', '))] to-[hsl(var(--homepage-' + hoveredButton + '))]')
                : 'from-[hsl(var(--homepage-title-gradient-light))] to-[hsl(var(--homepage-title-gradient-dark))] dark:from-[hsl(var(--homepage-title-gradient-dark))] dark:to-[hsl(var(--homepage-title-gradient-light))]'
            } bg-clip-text text-transparent`}>
              Project
            </h1>
            
            {/* Center O Logo with matching gradient */}
            <div className="relative">
              <img 
                src={logoIcon} 
                alt="Project O Logo" 
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain"
                style={{
                  filter: `
                    ${hoveredButton 
                      ? `hue-rotate(${hoveredButton === 'cards' ? '180deg' : hoveredButton === 'decks' ? '300deg' : hoveredButton === 'draft' ? '45deg' : '120deg'})` 
                      : ''
                    }
                    drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))
                  `
                }}
              />
              {/* Gradient overlay mask for theme matching */}
              <div 
                className="absolute inset-0 opacity-75 mix-blend-multiply"
                style={{
                  background: hoveredButton 
                    ? `hsl(var(--homepage-button-${hoveredButton}))`
                    : 'linear-gradient(135deg, hsl(258, 42%, 22%) 0%, hsl(339, 86%, 44%) 100%)',
                  WebkitMask: `url(${logoIcon}) center/contain no-repeat`,
                  mask: `url(${logoIcon}) center/contain no-repeat`
                }}
              />
            </div>
            
            <h1 className={`text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold transition-colors duration-500 drop-shadow-2xl bg-gradient-to-r ${
              hoveredButton 
                ? getTextColor().replace('text-[hsl(var(--homepage-', 'from-[hsl(var(--homepage-').replace('))]', '))] to-[hsl(var(--homepage-' + hoveredButton + '))]')
                : 'from-[hsl(var(--homepage-title-gradient-light))] to-[hsl(var(--homepage-title-gradient-dark))] dark:from-[hsl(var(--homepage-title-gradient-dark))] dark:to-[hsl(var(--homepage-title-gradient-light))]'
            } bg-clip-text text-transparent`}>
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
                onMouseEnter={() => setHoveredButton('cards')}
                onMouseLeave={() => setHoveredButton(null)}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-cyan-400/50 text-cyan-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-cyan-400/50 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: '0.3s' }}
              >
                Cards
              </Button>

              {/* Decks Button */}
              <Button 
                onClick={() => navigate('/decks')}
                onMouseEnter={() => setHoveredButton('decks')}
                onMouseLeave={() => setHoveredButton(null)}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-purple-400/50 text-purple-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-purple-400/10 hover:border-purple-400 hover:shadow-purple-400/50 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: '0.4s' }}
              >
                Decks
              </Button>

              {/* Draft Button */}
              <Button 
                onClick={() => navigate('/draft')}
                onMouseEnter={() => setHoveredButton('draft')}
                onMouseLeave={() => setHoveredButton(null)}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-orange-400/50 text-orange-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-orange-400/10 hover:border-orange-400 hover:shadow-orange-400/50 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: '0.5s' }}
              >
                Draft
              </Button>

              {/* Random Deck Button */}
              <Button 
                onClick={() => navigate('/random')}
                onMouseEnter={() => setHoveredButton('random')}
                onMouseLeave={() => setHoveredButton(null)}
                className="h-12 sm:h-14 md:h-16 bg-slate-900/90 border border-green-400/50 text-green-400 text-sm sm:text-base md:text-lg font-bold rounded-lg shadow-lg backdrop-blur-sm animate-fade-in hover:bg-green-400/10 hover:border-green-400 hover:shadow-green-400/50 hover:shadow-lg flex items-center justify-center transition-all duration-300"
                style={{ animationDelay: '0.6s' }}
              >
                <span className="text-center leading-tight text-xs sm:text-sm md:text-base">
                  Random<br />Deck
                </span>
              </Button>
            </div>
          </div>

        </div>

        {/* Floating Animations */}
        <FloatingCards isActive={true} />
        <FloatingBubbles isActive={true} />
        <FloatingBubblesDown isActive={true} />
        <FloatingQuestionMarksHorizontal isActive={true} />

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