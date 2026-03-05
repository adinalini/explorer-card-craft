import { useSearchParams, useNavigate } from "react-router-dom";
import { SEOHead } from "@/components/SEOHead";
import { newsItems, getRecentNews } from "@/data/newsData";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const News = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedSlug = searchParams.get("id");

  const allNews = useMemo(() => getRecentNews(), []);
  const selected = useMemo(
    () =>
      newsItems.find((n) => n.slug === selectedSlug) ||
      allNews[0] ||
      newsItems[0],
    [selectedSlug, allNews]
  );

  if (!selected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        <p className="text-white">No news available.</p>
      </div>
    );
  }

  const otherNews = newsItems.filter((n) => n.id !== selected.id);

  return (
    <>
      <SEOHead title="World of Origins" description={selected.summary} url="/news" />
      <div className="min-h-screen bg-gradient-to-br from-[hsl(260_90%_10%)] to-[hsl(290_95%_5%)]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <h1 className="text-lg font-bold text-white">News</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
          {/* Sidebar — other news */}
          <aside className="md:w-64 flex-shrink-0 order-2 md:order-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/80 mb-3">
              More News
            </h2>
            <div className="space-y-3">
              {otherNews.map((n) => (
                <div
                  key={n.id}
                  onClick={() => navigate(`/news?id=${n.slug}`)}
                  className="flex gap-3 p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 hover:bg-black/30 cursor-pointer transition-colors"
                >
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white line-clamp-2">{n.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 order-1 md:order-2">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-48 md:h-72 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  {selected.author && (
                    <span className="text-xs text-primary">{selected.author}</span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(selected.date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{selected.title}</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {selected.content.split("\n\n").map((p, i) => (
                    <p key={i} className="text-slate-300 mb-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: p
                          .replace(
                            /\*\*(.+?)\*\*/g,
                            '<strong class="text-white font-semibold">$1</strong>'
                          )
                          .replace(
                            /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
                            '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
                          )
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  ))}
                </div>
                {selected.images && selected.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mt-6">
                    {selected.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="rounded-lg object-cover w-full" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default News;
