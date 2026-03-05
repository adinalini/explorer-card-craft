import { cardDatabase, Card } from './cardData';

/**
 * Generate a Heroic deck using only good-aligned cards from the latest patch.
 * Follows the same cost distribution rules as Halloween.
 */

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getRandomCards(pool: Card[], count: number, usedCards: Set<string>): Card[] {
  const available = pool.filter(c => !usedCards.has(c.id));
  const shuffled = shuffleArray(available);
  const selected = shuffled.slice(0, count);
  selected.forEach(c => usedCards.add(c.id));
  return selected;
}

export function generateHeroicDeck(): Card[] {
  const TARGET_SIZE = 13; // 1 legendary + 11 cost-rule + 1 random

  const goodCards = cardDatabase.filter(c => 
    c.inDraftPool !== false && 
    c.cost !== undefined && 
    c.alignment === 'good'
  );

  const cost0to2 = goodCards.filter(c => c.cost! >= 0 && c.cost! <= 2 && !c.isLegendary);
  const cost3 = goodCards.filter(c => c.cost === 3 && !c.isLegendary);
  const cost4 = goodCards.filter(c => c.cost === 4 && !c.isLegendary);
  const cost5 = goodCards.filter(c => c.cost === 5 && !c.isLegendary);
  const cost6 = goodCards.filter(c => c.cost === 6 && !c.isLegendary);
  const cost7to10 = goodCards.filter(c => c.cost! >= 7 && c.cost! <= 10 && !c.isLegendary);
  const legendaries = goodCards.filter(c => c.isLegendary);

  const usedCards = new Set<string>();
  const deck: Card[] = [];

  deck.push(...getRandomCards(legendaries, 1, usedCards));
  deck.push(...getRandomCards(cost0to2, 3, usedCards));
  deck.push(...getRandomCards(cost3, 2, usedCards));
  deck.push(...getRandomCards(cost4, 2, usedCards));
  deck.push(...getRandomCards(cost5, 1, usedCards));
  deck.push(...getRandomCards(cost6, 1, usedCards));
  deck.push(...getRandomCards(cost7to10, 2, usedCards));

  // Random filler card
  const allAvailable = goodCards.filter(c => !usedCards.has(c.id) && !c.isLegendary);
  if (allAvailable.length > 0) {
    deck.push(...getRandomCards(allAvailable, 1, usedCards));
  }

  // Fallback: if cost rules left gaps, fill missing slots from highest-cost good cards
  const missing = TARGET_SIZE - deck.length;
  if (missing > 0) {
    const fallbackPool = goodCards
      .filter(c => !usedCards.has(c.id) && !c.isLegendary)
      .sort((a, b) => (b.cost ?? 0) - (a.cost ?? 0))
      .slice(0, missing + 4);
    deck.push(...getRandomCards(fallbackPool, missing, usedCards));
  }

  return deck.sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0));
}
