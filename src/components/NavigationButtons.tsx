import { useNavigate } from "react-router-dom";

interface NavigationButtonsProps {
  sizeVariant?: "default" | "small";
}

export const NavigationButtons = ({ sizeVariant = "default" }: NavigationButtonsProps) => {
  const navigate = useNavigate();
  
  const isDefault = sizeVariant === "default";
  const paddingClass = isDefault ? "p-4 sm:p-6 md:p-8" : "p-4";
  const titleClass = isDefault ? "text-lg sm:text-xl md:text-2xl" : "text-lg";
  const textClass = isDefault ? "text-xs sm:text-sm" : "text-xs";

  return (
    <div className="relative grid grid-cols-2 w-80 sm:w-96 md:w-[420px] lg:w-[480px]" style={{ height: '459px' }}>
      {/* Cross-style borders */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/30 -translate-x-0.5"></div>
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/30 -translate-y-0.5"></div>
      </div>
      
      {/* Cards Button - Greyed Out */}
      <div 
        className={`flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm cursor-not-allowed opacity-50 transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: '0.3s' }}
        title="This page is currently unavailable"
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>
          Cards
        </div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Currently unavailable
        </div>
      </div>

      {/* Decks Button */}
      <div 
        onClick={() => navigate('/decks')}
        className={`flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: '0.4s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>
          Decks
        </div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Browse through featured & community decks.
        </div>
      </div>

      {/* Draft Button */}
      <div 
        onClick={() => navigate('/draft')}
        className={`flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: '0.5s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>
          Draft
        </div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Play a Double/Triple Draft with someone.
        </div>
      </div>

      {/* Random Deck Button */}
      <div 
        onClick={() => navigate('/random')}
        className={`flex flex-col items-center justify-center ${paddingClass} bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-black/30 transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: '0.6s' }}
      >
        <div className={`${titleClass} font-bold text-white mb-2`}>
          Random Deck
        </div>
        <div className={`${textClass} text-slate-300 text-center leading-tight`}>
          Feeling adventurous? Play a random deck.
        </div>
      </div>
    </div>
  );
};
