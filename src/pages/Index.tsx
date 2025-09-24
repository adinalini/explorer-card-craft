import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { SEOHead } from "@/components/SEOHead"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Play, ArrowRight, Sparkles, Zap, Star, Shuffle } from "lucide-react"

const Index = () => {
  const navigate = useNavigate()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [glitchEffect, setGlitchEffect] = useState(false)

  // Rotating hero cards
  const heroCards = [
    '/src/assets/cards/dracula.png',
    '/src/assets/cards/wukong.png',
    '/src/assets/cards/alice.png',
    '/src/assets/cards/merlin.png'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % heroCards.length)
        setGlitchEffect(false)
      }, 200)
    }, 4000)

    return () => clearInterval(interval)
  }, [heroCards.length])

  const features = [
    {
      title: "Cards",
      description: "Explore legendary cards with mystical powers",
      icon: Sparkles,
      path: "/cards",
      color: "neon-cyan"
    },
    {
      title: "Decks",
      description: "Build powerful combinations and strategies",
      icon: Star,
      path: "/decks", 
      color: "neon-pink"
    },
    {
      title: "Draft",
      description: "Test your skills in epic draft battles",
      icon: Zap,
      path: "/draft",
      color: "neon-yellow"
    },
    {
      title: "Random Deck",
      description: "Let fate decide your destiny",
      icon: Shuffle,
      path: "/random",
      color: "neon-purple"
    }
  ]

  return (
    <>
      <SEOHead 
        title="Project O Zone - Join the Zone"
        description="Join the Zone. Explore Cards. Build Decks. Draft Legends. The ultimate fantasy card game experience."
        image="/og-images/homepage.jpg"
        url="/"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[hsl(280_40%_15%)] to-[hsl(320_50%_20%)] text-[hsl(0_0%_98%)] overflow-x-hidden">
        {/* Header */}
        <header className="relative z-50 p-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="text-2xl font-bold neon-text">
              Project O Zone
            </div>
            
            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/cards')}
                className="text-[hsl(0_0%_98%)] hover:text-[hsl(var(--neon-cyan))] hover:bg-transparent transition-all duration-300"
              >
                Cards
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/decks')}
                className="text-[hsl(0_0%_98%)] hover:text-[hsl(var(--neon-pink))] hover:bg-transparent transition-all duration-300"
              >
                Decks
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/draft')}
                className="text-[hsl(0_0%_98%)] hover:text-[hsl(var(--neon-yellow))] hover:bg-transparent transition-all duration-300"
              >
                Draft
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/random')}
                className="text-[hsl(0_0%_98%)] hover:text-[hsl(var(--neon-purple))] hover:bg-transparent transition-all duration-300"
              >
                Random Deck
              </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-transparent animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-[hsl(var(--neon-pink))] to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-[hsl(var(--neon-yellow))] to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                  <span className="block neon-cyan-text">Join</span>
                  <span className="block neon-pink-text" style={{ fontSize: '1.2em' }}>EARLY</span>
                  <span className="block text-[hsl(0_0%_98%)]">Access</span>
                  <span className="block neon-yellow-text">Now!</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-[hsl(0_0%_80%)] max-w-2xl leading-relaxed">
                  Join the Zone. Explore Cards. Build Decks. Draft Legends.
                </p>
              </div>

              <Button 
                onClick={() => navigate('/draft')}
                className="group bg-gradient-to-r from-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-teal))] hover:from-[hsl(var(--neon-cyan))] hover:to-[hsl(var(--neon-cyan))] text-[hsl(260_25%_5%)] px-8 py-6 text-xl font-bold rounded-none transition-all duration-300 shadow-[0_0_20px_hsl(var(--neon-cyan)_/_0.5)] hover:shadow-[0_0_40px_hsl(var(--neon-cyan)_/_0.8)]"
              >
                <Play className="mr-2 h-6 w-6" />
                Start Drafting
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Right side - Hero card showcase */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Holographic effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan)_/_0.2)] to-[hsl(var(--neon-pink)_/_0.2)] rounded-3xl blur-xl"></div>
                
                {/* Card container */}
                <div className={`relative bg-gradient-to-br from-[hsl(260_30%_12%)] to-[hsl(280_35%_15%)] p-8 rounded-3xl border border-[hsl(var(--neon-cyan)_/_0.3)] transition-all duration-200 ${glitchEffect ? 'animate-pulse' : ''}`}>
                  <img 
                    src={heroCards[currentCardIndex]}
                    alt="Featured Card"
                    className="w-full h-auto rounded-2xl"
                    style={{ 
                      filter: glitchEffect ? 'hue-rotate(180deg) saturate(2)' : 'none',
                      transform: glitchEffect ? 'scale(1.02)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Card glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-[hsl(var(--neon-cyan)_/_0.1)] pointer-events-none"></div>
                </div>

                {/* Floating particles */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[hsl(var(--neon-cyan))] rounded-full animate-bounce opacity-60"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[hsl(var(--neon-pink))] rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text">
              Explore the Zone
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group relative"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative bg-gradient-to-br from-[hsl(260_30%_12%)] to-[hsl(280_35%_15%)] p-8 rounded-3xl border border-[hsl(var(--neon-cyan)_/_0.2)] hover:border-[hsl(var(--neon-cyan)_/_0.5)] transition-all duration-300 cursor-pointer hover:scale-105"
                         onClick={() => navigate(feature.path)}>
                      
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(var(--${feature.color})_/_0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--${feature.color})_/_0.2)] to-[hsl(var(--${feature.color})_/_0.1)] border border-[hsl(var(--${feature.color})_/_0.3)]`}>
                          <Icon className={`h-8 w-8 text-[hsl(var(--${feature.color}))]`} />
                        </div>
                        
                        <h3 className={`text-2xl font-bold text-[hsl(var(--${feature.color}))]`}>
                          {feature.title}
                        </h3>
                        
                        <p className="text-[hsl(0_0%_70%)] leading-relaxed">
                          {feature.description}
                        </p>
                        
                        <div className="flex items-center text-[hsl(var(--neon-cyan))] group-hover:translate-x-2 transition-transform duration-300">
                          <span className="text-sm font-medium">Explore</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[hsl(260_30%_8%)] to-[hsl(280_35%_12%)]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold neon-pink-text">
                Featured News
              </h2>
              <Button 
                variant="ghost"
                className="text-[hsl(var(--neon-cyan))] hover:text-[hsl(var(--neon-cyan))] hover:bg-transparent group"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(260_30%_12%)] to-[hsl(280_35%_15%)] border border-[hsl(var(--neon-purple)_/_0.3)] hover:border-[hsl(var(--neon-purple)_/_0.6)] transition-all duration-300 cursor-pointer">
                <div className="p-8">
                  <div className="text-[hsl(var(--neon-cyan))] text-sm font-medium mb-2">April 30th, 2025</div>
                  <h3 className="text-2xl font-bold text-[hsl(0_0%_98%)] mb-4 group-hover:text-[hsl(var(--neon-purple))] transition-colors">
                    Project O Zone Alpha Launch
                  </h3>
                  <p className="text-[hsl(0_0%_70%)] leading-relaxed">
                    Experience the next evolution of digital card games with revolutionary 3D cards and true ownership mechanics.
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neon-purple)_/_0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(260_30%_12%)] to-[hsl(280_35%_15%)] border border-[hsl(var(--neon-yellow)_/_0.3)] hover:border-[hsl(var(--neon-yellow)_/_0.6)] transition-all duration-300 cursor-pointer">
                <div className="p-8">
                  <div className="text-[hsl(var(--neon-cyan))] text-sm font-medium mb-2">March 18th, 2025</div>
                  <h3 className="text-2xl font-bold text-[hsl(0_0%_98%)] mb-4 group-hover:text-[hsl(var(--neon-yellow))] transition-colors">
                    Draft Mode Beta Testing
                  </h3>
                  <p className="text-[hsl(0_0%_70%)] leading-relaxed">
                    Join thousands of players in testing our revolutionary draft system with holographic pack openings.
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--neon-yellow)_/_0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-[hsl(var(--neon-cyan)_/_0.2)]">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-2xl font-bold neon-text mb-4">
              Project O Zone
            </div>
            <p className="text-[hsl(0_0%_60%)] mb-6">
              The ultimate fantasy card game experience
            </p>
            <div className="flex justify-center space-x-6 text-[hsl(0_0%_70%)]">
              <a href="#" className="hover:text-[hsl(var(--neon-cyan))] transition-colors">Discord</a>
              <a href="#" className="hover:text-[hsl(var(--neon-pink))] transition-colors">Twitter</a>
              <a href="#" className="hover:text-[hsl(var(--neon-yellow))] transition-colors">Community</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Index