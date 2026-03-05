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
    id: "2",
    slug: "alpha-tournament-waitlist",
    title: "Signup for Alpha Tournament Waitlist",
    summary: "The first ever Origins TCG Alpha tournament is happening next Tuesday. Sign up for the waitlist now!",
    content: `The first ever Origins TCG Alpha tournament is happening next Tuesday, 10th March. Limited spots are being raffled to waitlist players, sign up using this [form](https://forms.gle/8Mip4s8PqLGmm5uq7).\n\nDeadline to fill the form is Friday, 6th March.\n\n**Day** - Tuesday, March 10th\n**Time** - 1PM PST / 8PM UTC\n**Format** - 64 player, double-elimination bracket\n**Length** - 2 to 3 hours\n\n**Prizes:**\n**1st place** - Booster Case (a case is 6 boxes) & promo card\n**2nd place** - Booster box x2 & promo card\n**3rd place** - Booster box x1 & promo card\n**4th to 8th** - Booster pack & promo card\n**9th to 64th** - Normal free pack\n\nThe alpha packs here are only available pre-game launch and the promo cards are tournament exclusive (probably serialized).`,
    image: "/images/news/alpha-tournament.png",
    date: "2026-02-25T00:00:00.000Z",
    author: "Adinalini",
  },
  {
    id: "1",
    slug: "alpha-sale-live",
    title: "Alpha Sale Live!",
    summary: "Origins TCG has launched their alpha pack sale with a community discount active until GDC.",
    content: `Origins TCG has launched their alpha pack sale on [dcc.club](https://dcc.club/alpha-edition-pre-sale) as of 3rd March. The community discount remains active until GDC event on Monday.`,
    image: "/images/news/alpha-sale.png",
    images: ["/images/news/alpha-boxes.png", "/images/news/collector-packs.png"],
    date: "2026-03-03T00:00:00.000Z",
    author: "Adinalini",
  },
];

/** Returns news items from the last 30 days */
export function getRecentNews(): NewsItem[] {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return newsItems
    .filter((n) => new Date(n.date).getTime() >= thirtyDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
