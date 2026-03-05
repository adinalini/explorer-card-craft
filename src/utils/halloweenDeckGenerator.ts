import { cardDatabase, Card } from './cardData';

/**
 * Generate a Halloween deck using only evil-aligned cards from the latest patch.
 * Follows the same cost distribution rules.
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

export function generateHalloweenDeck(): Card[] {
  // Use only evil-aligned cards from the latest patch
  const evilCards = cardDatabase.filter(c => 
    c.inDraftPool !== false && 
    c.cost !== undefined && 
    c.alignment === 'evil'
  );

  const cost0to2 = evilCards.filter(c => c.cost! >= 0 && c.cost! <= 2 && !c.isLegendary);
  const cost3 = evilCards.filter(c => c.cost === 3 && !c.isLegendary);
  const cost4 = evilCards.filter(c => c.cost === 4 && !c.isLegendary);
  const cost5 = evilCards.filter(c => c.cost === 5 && !c.isLegendary);
  const cost6 = evilCards.filter(c => c.cost === 6 && !c.isLegendary);
  const cost7to10 = evilCards.filter(c => c.cost! >= 7 && c.cost! <= 10 && !c.isLegendary);
  const legendaries = evilCards.filter(c => c.isLegendary);

  const usedCards = new Set<string>();
  const deck: Card[] = [];

  // 1. Random legendary
  const legendary = getRandomCards(legendaries, 1, usedCards);
  deck.push(...legendary);

  // 2. 3 cards from cost 0-2
  deck.push(...getRandomCards(cost0to2, 3, usedCards));

  // 3. 2 cards from cost 3
  deck.push(...getRandomCards(cost3, 2, usedCards));

  // 4. 2 cards from cost 4
  deck.push(...getRandomCards(cost4, 2, usedCards));

  // 5. 1 card from cost 5
  deck.push(...getRandomCards(cost5, 1, usedCards));

  // 6. 1 card from cost 6
  deck.push(...getRandomCards(cost6, 1, usedCards));

  // 7. 2 cards from cost 7-10
  deck.push(...getRandomCards(cost7to10, 2, usedCards));

  // 8. One random card not already picked (non-legendary)
  const allAvailable = evilCards.filter(c => !usedCards.has(c.id) && !c.isLegendary);
  if (allAvailable.length > 0) {
    deck.push(...getRandomCards(allAvailable, 1, usedCards));
  }

  // Sort by cost
  return deck.sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0));
}
