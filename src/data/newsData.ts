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
    slug: "origins-patch-1-1-released",
    title: "Origins Patch 1.1 Released",
    summary: "A major balance update arrives with new card adjustments and gameplay improvements.",
    content: `The Origins TCG team has released Patch 1.1, bringing significant balance changes across multiple card categories. Key highlights include adjustments to legendary card costs, improved synergies for control archetypes, and bug fixes for card interactions.\n\nThe patch also introduces quality-of-life improvements to the deck builder and draft modes. Players can expect a more refined experience across the board.`,
    image: "/lovable-uploads/3bc78144-de54-443f-8b86-d8f5835966a1.png",
    date: new Date().toISOString(),
    author: "Origins Team",
  },
  {
    id: "2",
    slug: "community-tournament-announced",
    title: "Community Tournament Announced",
    summary: "Sign up for the first ever Origins community tournament with prizes!",
    content: `The Origins community is excited to announce its first official tournament! Players of all skill levels are welcome to participate in this double-elimination bracket.\n\nRegistration opens next week, and the tournament will feature both constructed and draft formats. Prizes include exclusive card sleeves and early access to upcoming content.`,
    image: "/lovable-uploads/508c352b-b66f-40ae-9395-893891f1215c.png",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Community Team",
  },
  {
    id: "3",
    slug: "new-cards-preview",
    title: "New Cards Preview: Mythical Beasts",
    summary: "Get a first look at the upcoming Mythical Beasts expansion cards.",
    content: `We're thrilled to reveal the first cards from the upcoming Mythical Beasts expansion. This set introduces powerful new creatures from folklore around the world.\n\nExpect new mechanics centered around transformation and evolution, giving players fresh strategic options for deck building.`,
    image: "/lovable-uploads/918d2f07-eec2-4aea-9105-f29011a86707.png",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
