export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  images?: string[];
  date: string; // ISO date string
  author?: string;
}

export const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "alpha-sale-live",
    title: "Alpha Sale Live!",
    summary: "Origins TCG has launched their alpha pack sale with a community discount active until GDC.",
    content: `Origins TCG has launched their alpha pack sale on [dcc.club](https://dcc.club/alpha-edition-pre-sale) as of 3rd March. The community discount remains active until GDC event on Monday.`,
    image: "/images/news/alpha-sale.png",
    images: ["/images/news/alpha-boxes.png", "/images/news/collector-packs.png"],
    date: "2026-03-03T00:00:00.000Z",
    author: "Origins Team",
  },
];

/** Returns news items from the last 30 days */
export function getRecentNews(): NewsItem[] {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return newsItems
    .filter((n) => new Date(n.date).getTime() >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
