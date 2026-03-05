import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NavigationButtonsProps {
  sizeVariant?: "default" | "small";
}

export const NavigationButtons = ({ sizeVariant = "default" }: NavigationButtonsProps) => {
  const navigate = useNavigate();
  const [showTools, setShowTools] = useState(false);
  
  const isDefault = sizeVariant === "default";
  const paddingClass = isDefault ? "p-5 sm:p-7 md:p-9" : "p-3";
  const titleClass = isDefault ? "text-xl sm:text-2xl md:text-[1.7rem]" : "text-base";
  const textClass = isDefault ? "text-sm sm:text-base" : "text-xs";
  const heightStyle = isDefault ? '505px' : '340px';

  const cellClass = `flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in`;

  if (showTools) {
    return (
      <div className="relative grid grid-cols-2 w-80 sm:w-96 md:w-[462px] lg:w-[528px]" style={{ height: heightStyle }}>
        {/* Cross-style borders */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30 -translate-x-0.5"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30 -translate-y-0.5"></div>
        </div>

        {/* Random Deck (was Cards) */}
        <div
          onClick={() => navigate('/random')}
          className={cellClass}
          style={{ animationDelay: '0.3s' }}
        >
          <div className={`${titleClass} font-bold text-white mb-2`}>Random Deck</div>
          <div className={`${textClass} text-slate-300 text-center leading-tight`}>
            Feeling adventurous? Play a random deck.
          </div>
        </div>

        {/* Halloween (was Decks) */}
        <div
          onClick={() => navigate('/halloween')}
          className={cellClass}
          style={{ animationDelay: '0.4s' }}
        >
          <div className={`${titleClass} font-bold text-white mb-2`}>Halloween</div>
          <div className={`${textClass} text-slate-300 text-center leading-tight`}>
            Generate Halloween special Evil deck
          </div>
        </div>

        {/* Pack Simulator (was Draft) - Disabled */}
        <div
          className={`flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm transition-all duration-300 animate-fade-in opacity-40 cursor-not-allowed`}
          style={{ animationDelay: '0.5s' }}
        >
          <div className={`${titleClass} font-bold text-white mb-2`}>Pack Simulator</div>
          <div className={`${textClass} text-slate-300 text-center leading-tight`}>
            Simulate opening Origins TCG Packs
          </div>
        </div>

        {/* Back button (was Random Deck) */}
        <div
          onClick={() => setShowTools(false)}
          className={cellClass}
          style={{ animationDelay: '0.6s' }}
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-2 w-80 sm:w-96 md:w-[462px] lg:w-[528px]" style={{ height: heightStyle }}>
      {/* Cross-style borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30 -translate-x-0.5"></div>
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30 -translate-y-0.5"></div>
      </div>
      
      {/* Cards */}
      <div
        onClick={() => navigate('/cards')}
        className={cellClass}
        style={{ animationDelay: '0.3s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>Cards</div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Browse through all the cards/variants.
        </div>
      </div>

      {/* Decks */}
      <div
        onClick={() => navigate('/decks')}
        className={cellClass}
        style={{ animationDelay: '0.4s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>Decks</div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Browse through featured & community decks.
        </div>
      </div>

      {/* Draft */}
      <div
        onClick={() => navigate('/draft')}
        className={cellClass}
        style={{ animationDelay: '0.5s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>Draft</div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Play a Double/Triple Draft with someone.
        </div>
      </div>

      {/* Tools */}
      <div
        onClick={() => setShowTools(true)}
        className={cellClass}
        style={{ animationDelay: '0.6s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>Tools</div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Explore tools for random decks & events.
        </div>
      </div>
    </div>
  );
};
