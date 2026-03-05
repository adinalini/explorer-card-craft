import { useParams, useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { articleItems } from "@/data/articlesData";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const article = articleItems.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Article not found.</p>
          <Button onClick={() => navigate("/articles")}>Back to Articles</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${article.title} — Articles`}
        description={article.summary}
        url={`/article/${article.slug}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/articles")}>
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <h1 className="text-lg font-bold text-white truncate">{article.title}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-56 md:h-96 object-cover"
            />
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-3 mb-3">
                {article.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
                {article.author && (
                  <span className="text-xs text-primary">{article.author}</span>
                )}
                <span className="text-xs text-slate-400">
                  {new Date(article.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{article.title}</h2>
              <div className="prose prose-invert prose-base max-w-none">
                {article.content.split("\n\n").map((paragraph, i) => {
                  // Heading
                  if (paragraph.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-lg font-bold text-white mt-6 mb-2">
                        {paragraph.replace("## ", "")}
                      </h3>
                    );
                  }
                  // Inline image
                  const imgMatch = paragraph.match(/^!\[.*?\]\((.+?)\)$/);
                  if (imgMatch) {
                    return (
                      <img key={i} src={imgMatch[1]} alt="" className="rounded-lg w-full my-4" />
                    );
                  }
                  // Bullet point
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n").filter(l => l.startsWith("- "));
                    return (
                      <ul key={i} className="list-disc list-inside space-y-1 my-3">
                        {items.map((item, j) => (
                          <li key={j} className="text-slate-300 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: item.replace(/^- /, "").replace(
                                /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
                                '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
                              )
                            }}
                          />
                        ))}
                      </ul>
                    );
                  }
                  // Regular paragraph with link support
                  return (
                    <p key={i} className="text-slate-300 mb-4 leading-relaxed text-base"
                      dangerouslySetInnerHTML={{
                        __html: paragraph.replace(
                          /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
                          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
                        )
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleView;
