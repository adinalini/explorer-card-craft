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
    slug: "collector-ama-recap",
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
    author: "Adinalini",
    tags: ["recap", "collector", "AMA"],
  },
];

/** Returns the last N articles sorted by date */
export function getLatestArticles(count: number = 3): ArticleItem[] {
  return [...articleItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}
