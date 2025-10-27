import { SEOHead } from "@/components/SEOHead"

const Halloween = () => {
  return (
    <>
      <SEOHead 
        title="Halloween Event - Project O Zone"
        description="Special Halloween deck generator with spooky themed cards!"
        image="/og-images/deck-default.jpg"
        url="/halloween"
      />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[hsl(25_100%_10%)] to-[hsl(0_100%_5%)]">
        {/* Halloween themed background */}
        <div className="absolute inset-0 bg-[url('/lovable-uploads/skull-arrows.png')] opacity-5 bg-repeat bg-center" />
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,119,0,0.5)]">
            🎃 Halloween Event 🎃
          </h1>
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-xl md:text-2xl text-orange-200 text-center">
              Coming soon... Stay tuned for spooky decks!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Halloween
