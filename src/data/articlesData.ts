export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  images?: string[];
  date: string; // ISO date string
  author?: string;
  tags?: string[];
}

export const articleItems: ArticleItem[] = [
  {
    id: "4",
    slug: "collector-ama-recap-3-3-26",
    title: "Collector AMA Recap 3/3/26",
    summary: "A recap of the Origins TCG Collector AMA covering the game's vision, esports council, collector ecosystem, alpha sale, and more.",
    content: `You can watch the full recording [here](https://www.youtube.com/watch?v=TEfOL6SWpGo).

![](/images/articles/ama-players-collectors.png)

- Brand new IP with reimagined versions of already existing beloved characters from Public Domain.

![](/images/articles/ama-world-of-origins.png)

- Lore is being worked on by award winning industry experts.

![](/images/articles/ama-writers.png)

- Early reviews are great (9.1/10), won "Best Card Game" and "Best Art Direction" in the GAM3 awards.
- Game is made for esports with a big council supporting the vision.

![](/images/articles/ama-esports.png)

- The collector experience is inspired by the likes of Pokémon and Counter Strike with limited and sealed drops, chase cards, trade ups and more.

![](/images/articles/ama-collector-ecosystem.png)

- Alpha sale opened with a brief overview on the contents of the pack. Discount runs till Monday.
- Rarity distribution for the alpha pack.

![](/images/articles/ama-collector-packs.png)

- Seasonal prestige packs (tradable) that drop from various paywalls (to control supply/botting) and can be opened via purchasable keys.

![](/images/articles/ama-prestige-packs.png)

- Trade ups for various dupes just like Counter Strike with the top most rarity protected.

![](/images/articles/ama-trade-ups.png)

- Cards can be graded with visual wear and tear just like CS skins, adding another layer to collectability.

![](/images/articles/ama-graded-cards.png)

- Cards will live on the built from scratch collector hub [dcc.club](https://dcc.club) and plans for integration with 3rd party websites with easy to use API.

![](/images/articles/ama-distribution.png)

- Cards will primarily live off-chain on dcc but it can be brought onchain if need be. (To allow 3rd party websites to sell cards they don't even own, lowering entry to barrier)
- Holder rewards for [KGDS holders](https://opensea.io/collection/kgds) and blueprint owners from the first community sale. These exclusive promos will be serialized.

![](/images/articles/ama-holder-rewards.png)

- Alpha box contents visualized, each box comes with 2 bonus exclusive promos- 1 Special Edition Signature Rapunzel card and 1 Special Edition Anime Rapunzel card.

![](/images/articles/ama-alpha-boxes.png)

- Core cards that are competitively viable will always be available via free evergreen packs, removing the pay-to-win wall.

![](/images/articles/ama-ecosystem-summary.png)`,
    image: "/images/articles/ama-recap-hero.png",
    date: "2026-03-03T00:00:00.000Z",
    author: "Origins Team",
    tags: ["recap", "collector", "AMA"],
  },
  {
    id: "1",
    slug: "beginners-guide-to-origins",
    title: "Beginner's Guide to Origins TCG",
    summary: "Everything you need to know to start playing Origins TCG.",
    content: `Welcome to Origins TCG! This guide covers the fundamentals of the game, from understanding card types to building your first competitive deck.\n\n## Card Types\n\nOrigins features several card categories: Characters, Spells, and Locations. Each plays a unique role in your strategy.\n\n## Building Your First Deck\n\nA standard deck contains 30 cards. Focus on a single archetype when starting out — aggro decks are the most beginner-friendly.\n\n## Tips for New Players\n\n1. Learn the cost curve — don't overload on expensive cards\n2. Practice in draft mode to learn card interactions\n3. Watch community replays to understand advanced strategies`,
    image: "/lovable-uploads/fc4bded4-d154-4368-9ba7-fcc6d9eedc5b.png",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Origins Team",
    tags: ["guide", "beginner"],
  },
  {
    id: "2",
    slug: "top-5-control-decks",
    title: "Top 5 Control Decks in the Current Meta",
    summary: "An analysis of the strongest control strategies dominating the meta.",
    content: `Control decks have been a dominant force in the current Origins meta. Here we break down the top 5 performing control archetypes.\n\n## 1. Arthurian Control\n\nLeveraging King Arthur and the Knights of the Round Table, this deck excels at late-game board control.\n\n## 2. Oz Lockdown\n\nUsing Dorothy, Glinda, and the Wicked Witch, this deck focuses on locking down enemy plays.\n\n## 3. Sea Witch Tide\n\nA water-themed control deck that uses Sea Witch and Kraken synergies.\n\n## 4. Underworld Dominion\n\nDeath and Legion of the Dead form the backbone of this removal-heavy strategy.\n\n## 5. Fairy Tale Stall\n\nA unique approach using fairy tale characters to outlast aggressive opponents.`,
    image: "/lovable-uploads/1e21299a-3039-497b-8f8f-c31410dea36d.png",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Meta Analyst",
    tags: ["meta", "control", "decks"],
  },
  {
    id: "3",
    slug: "draft-strategy-masterclass",
    title: "Draft Strategy Masterclass",
    summary: "Advanced drafting techniques to dominate your next draft session.",
    content: `Drafting is one of the most skill-intensive formats in Origins TCG. This masterclass covers advanced pick orders, signal reading, and archetype commitment.\n\n## Reading Signals\n\nPay attention to what your opponent passes. If strong aggro cards are flowing, consider pivoting into that archetype.\n\n## Pick Order Fundamentals\n\nLegendary cards are usually first picks, but don't underestimate strong common synergy pieces.\n\n## When to Pivot\n\nIf your initial archetype is being contested, don't be afraid to switch by round 3. Flexibility wins drafts.`,
    image: "/lovable-uploads/3bc78144-de54-443f-8b86-d8f5835966a1.png",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Draft Expert",
    tags: ["draft", "strategy", "advanced"],
  },
];

/** Returns the last N articles sorted by date */
export function getLatestArticles(count: number = 3): ArticleItem[] {
  return [...articleItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
