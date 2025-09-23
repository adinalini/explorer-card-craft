import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Blob } from "@/components/ui/blob"
import { WaveDivider } from "@/components/ui/wave-divider"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { FloatingCards, FloatingBubbles, FloatingBubblesDown, FloatingQuestionMarksHorizontal } from "@/components/ui/homepage-animations"

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
        {/* Abstract Blobs */}
        <Blob variant="pink" size="lg" className="top-20 left-10 animate-float" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <Blob variant="yellow" size="md" className="top-32 right-20 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <Blob variant="orange" size="sm" className="bottom-40 left-32 animate-float" style={{ animationDelay: '4s', animationDuration: '7s' }} />
        <Blob variant="pink" size="md" className="bottom-20 right-16 animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }} />
        
        {/* Theme Toggle in top right */}
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle className="text-[hsl(var(--homepage-text))] hover:bg-white/10 dark:hover:bg-black/20" />
        </div>

        {/* Top 30% - Project O Zone Title */}
        <div className="relative z-10 h-[30vh] flex flex-col items-center justify-center px-4">
          <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold transition-colors duration-500 drop-shadow-2xl ${getTextColor()}`}>
            Project O Zone
          </h1>
        </div>

        {/* Bottom 70% - 2x2 Button Grid */}
        <div className="relative z-10 h-[70vh] p-8">
          <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full max-w-6xl mx-auto">
            {/* Cards Button */}
            <Button 
              onClick={() => navigate('/cards')}
              onMouseEnter={() => setHoveredButton('cards')}
              onMouseLeave={() => setHoveredButton(null)}
              className="h-full bg-[hsl(var(--homepage-button-cards))] hover:bg-[hsl(var(--homepage-button-cards-hover))] text-foreground text-4xl md:text-6xl font-bold rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              Cards
            </Button>

            {/* Decks Button */}
            <Button 
              onClick={() => navigate('/decks')}
              onMouseEnter={() => setHoveredButton('decks')}
              onMouseLeave={() => setHoveredButton(null)}
              className="h-full bg-[hsl(var(--homepage-button-decks))] hover:bg-[hsl(var(--homepage-button-decks-hover))] text-foreground text-4xl md:text-6xl font-bold rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Decks
            </Button>

            {/* Draft Button */}
            <Button 
              onClick={() => navigate('/draft')}
              onMouseEnter={() => setHoveredButton('draft')}
              onMouseLeave={() => setHoveredButton(null)}
              className="h-full bg-[hsl(var(--homepage-button-draft))] hover:bg-[hsl(var(--homepage-button-draft-hover))] text-foreground text-4xl md:text-6xl font-bold rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              Draft
            </Button>

            {/* Random Deck Button */}
            <Button 
              onClick={() => navigate('/random')}
              onMouseEnter={() => setHoveredButton('random')}
              onMouseLeave={() => setHoveredButton(null)}
              className="h-full bg-[hsl(var(--homepage-button-random))] hover:bg-[hsl(var(--homepage-button-random-hover))] text-foreground text-4xl md:text-6xl font-bold rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in flex items-center justify-center"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="text-center leading-tight">
                <span className="hidden sm:inline">Random Deck</span>
                <span className="sm:hidden">Random<br />Deck</span>
              </span>
            </Button>
          </div>
        </div>


        {/* Animation Components */}
        <FloatingCards isActive={hoveredButton === 'cards'} />
        <FloatingBubbles isActive={hoveredButton === 'decks'} />
        <FloatingBubblesDown isActive={hoveredButton === 'draft'} />
        <FloatingQuestionMarksHorizontal isActive={hoveredButton === 'random'} />
      </div>
    </>
  )
}

export default Index