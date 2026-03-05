import { useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { articleItems } from "@/data/articlesData";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Articles = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="World of Origins"
        description="Browse guides, strategy breakdowns, and more."
        url="/articles"
      />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <h1 className="text-lg font-bold text-white">Articles</h1>
          </div>
        </div>

        <div className="w-[90%] xl:w-[80%] mx-auto py-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articleItems
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigate(`/article/${article.slug}`)}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-black/30 hover:border-white/20 transition-all duration-300 group"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {article.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-base font-bold text-white mb-1 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-300 line-clamp-2">{article.summary}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      {new Date(article.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Articles;
