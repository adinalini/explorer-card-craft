import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";

const Cards = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead 
        title="Card Explorer - Project O Zone"
        description="Explore all cards in Project O Zone. Browse, search, and filter through our extensive card collection with detailed stats and artwork."
        image="/og-images/cards.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background-start))] to-[hsl(var(--background-end))] flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Card Explorer
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            This page is down until further notice.
          </p>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default Cards;
