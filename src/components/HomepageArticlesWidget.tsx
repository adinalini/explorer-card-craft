import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLatestArticles } from "@/data/articlesData";

export const HomepageArticlesWidget = () => {
  const navigate = useNavigate();
  const articles = getLatestArticles(3);
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    if (articles.length === 0) return;
    setIndex((i) => (i + 1) % articles.length);
  }, [articles.length]);

  const prev = useCallback(() => {
    if (articles.length === 0) return;
    setIndex((i) => (i - 1 + articles.length) % articles.length);
  }, [articles.length]);

  // Auto-rotate every 15s
  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(next, 15000);
    return () => clearInterval(timer);
  }, [next, articles.length]);

  if (articles.length === 0) return null;
  const item = articles[index];

  return (
    <div
      className="relative bg-black/20 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:bg-black/30 transition-all duration-300 group"
      style={{ width: "100%", height: "100%" }}
      onClick={() => navigate(`/article/${item.slug}`)}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-3 md:p-4">
        <div>
          <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-accent/80">
            Articles
          </span>
          <h3 className="text-sm md:text-base font-bold text-white mt-1 line-clamp-2 leading-tight">
            {item.title}
          </h3>
          <p className="text-[10px] md:text-xs text-slate-300 mt-1 line-clamp-2 leading-snug">
            {item.summary}
          </p>
        </div>

        {/* Navigation */}
        {articles.length > 1 && (
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </button>
            <div className="flex gap-1">
              {articles.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? "bg-accent" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
