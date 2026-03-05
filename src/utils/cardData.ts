/**
 * Card Database - Generated from cardStats at runtime
 * Draft logic and card utilities
 */
import { patchCardStats } from './cardStats'
import { cardKeyMapping } from './cardKeyMapping'
import { CURRENT_PATCH, getAllPatchesOrdered } from './patches'

export interface Card {
  id: string;
  name: string;
  image: string;
  isLegendary: boolean;
  cost?: number;
  isSpell?: boolean;
  isItem?: boolean;
  cardKey?: string;
  inDraftPool?: boolean;
  alignment?: 'good' | 'evil' | 'neutral';
}

/**
 * Build card database from patch stats.
 * Current patch cards are active; cards from previous patches that no longer exist are kept with inDraftPool: false.
 */
function buildCardDatabase(): Card[] {
  const cards: Card[] = []
  const seenIds = new Set<string>()

  // Current patch active cards
  const currentStats = patchCardStats[CURRENT_PATCH.id] || {}
  for (const [id, stats] of Object.entries(currentStats)) {
    if (stats.status !== 'active') continue
    seenIds.add(id)
    cards.push({
      id,
      name: stats.name,
      image: `/src/assets/cards/${id}.png`,
      isLegendary: stats.isLegendary,
      cost: stats.cost,
      isSpell: stats.cardType === 'spell',
      isItem: stats.cardType === 'item',
      cardKey: cardKeyMapping[id],
      inDraftPool: true,
      alignment: stats.alignment,
    })
  }

  // Include cards from previous patches that are no longer active (backward compat for old decks)
  const patches = getAllPatchesOrdered()
  for (const patch of patches) {
    if (patch.id === CURRENT_PATCH.id) continue
    const patchStats = patchCardStats[patch.id] || {}
    for (const [id, stats] of Object.entries(patchStats)) {
      if (seenIds.has(id) || stats.status !== 'active') continue
      seenIds.add(id)
      cards.push({
        id,
        name: stats.name,
        image: `/src/assets/cards/${id}.png`,
        isLegendary: stats.isLegendary,
        cost: stats.cost,
        isSpell: stats.cardType === 'spell',
        isItem: stats.cardType === 'item',
        cardKey: cardKeyMapping[id],
        inDraftPool: false,
        alignment: stats.alignment,
      })
    }
  }

  return cards
}

// Card database with cost, spell status, and legendary information
export const cardDatabase: Card[] = buildCardDatabase()

// Generate all 13 draft choices with the specified logic
export const generateAllDraftChoices = (usedCardIds: string[]): Card[][] => {
  const availableCards = cardDatabase.filter(
    (card) => !usedCardIds.includes(card.id) && card.cost !== undefined && card.inDraftPool !== false,
  );

  const choices: Card[][] = [];
  const usedInChoices: Set<string> = new Set();

  // 1. One legendary choice
  const legendaryCards = availableCards.filter((card) => card.isLegendary && !usedInChoices.has(card.id));
  if (legendaryCards.length >= 4) {
    const legendaryChoice = legendaryCards.slice(0, 4);
    choices.push(legendaryChoice);
    legendaryChoice.forEach((card) => usedInChoices.add(card.id));
  }

  // 2. One spell choice (sum within range of 2)
  const spellCards = availableCards.filter((card) => card.isSpell && !usedInChoices.has(card.id));
  if (spellCards.length >= 4) {
    const spellChoice = spellCards.slice(0, 4);
    choices.push(spellChoice);
    spellChoice.forEach((card) => usedInChoices.add(card.id));
  }

  // 3. Required cost choices: 1, 2, 3, 4, 5 (5 choices)
  const requiredCosts = [1, 2, 3, 4, 5];
  for (const cost of requiredCosts) {
    const cardsOfCost = availableCards.filter(
      (card) => card.cost === cost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id),
    );

    if (cardsOfCost.length >= 4) {
      const costChoice = cardsOfCost.slice(0, 4);
      choices.push(costChoice);
      costChoice.forEach((card) => usedInChoices.add(card.id));
    } else if (cardsOfCost.length >= 2) {
      const neighboringCosts = [cost - 1, cost + 1].filter((c) => c >= 0);
      for (const neighborCost of neighboringCosts) {
        const neighborCards = availableCards.filter(
          (card) => card.cost === neighborCost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id),
        );
        if (cardsOfCost.length + neighborCards.length >= 4) {
          const mixedChoice = [...cardsOfCost, ...neighborCards].slice(0, 4);
          choices.push(mixedChoice);
          mixedChoice.forEach((card) => usedInChoices.add(card.id));
          break;
        }
      }
    }
  }

  // 4. Random choices from specific cost distribution: 2,2,2,3,3,3,4,4 (4 choices)
  const randomCostPool = [2, 2, 2, 3, 3, 3, 4, 4];
  const shuffledCostPool = [...randomCostPool].sort(() => Math.random() - 0.5);

  let addedRandomChoices = 0;
  for (const cost of shuffledCostPool) {
    if (addedRandomChoices >= 4) break;

    const cardsOfCost = availableCards.filter(
      (card) => card.cost === cost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id),
    );

    if (cardsOfCost.length >= 4) {
      const costChoice = cardsOfCost.slice(0, 4);
      choices.push(costChoice);
      costChoice.forEach((card) => usedInChoices.add(card.id));
      addedRandomChoices++;
    } else if (cardsOfCost.length >= 2) {
      const neighboringCosts = [cost - 1, cost + 1].filter((c) => c >= 0);
      for (const neighborCost of neighboringCosts) {
        const neighborCards = availableCards.filter(
          (card) => card.cost === neighborCost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id),
        );
        if (cardsOfCost.length + neighborCards.length >= 4) {
          const mixedChoice = [...cardsOfCost, ...neighborCards].slice(0, 4);
          choices.push(mixedChoice);
          mixedChoice.forEach((card) => usedInChoices.add(card.id));
          addedRandomChoices++;
          break;
        }
      }
    }
  }

  // 5. One choice from cost 5-6 range
  const midRangeCards = availableCards.filter(
    (card) =>
      card.cost &&
      card.cost >= 5 &&
      card.cost <= 6 &&
      !card.isLegendary &&
      !card.isSpell &&
      !usedInChoices.has(card.id),
  );
  if (midRangeCards.length >= 4) {
    const midRangeChoice = midRangeCards.slice(0, 4);
    choices.push(midRangeChoice);
    midRangeChoice.forEach((card) => usedInChoices.add(card.id));
  }

  // 6. One choice from cost 7-10 range
  const highRangeCards = availableCards.filter(
    (card) =>
      card.cost &&
      card.cost >= 7 &&
      card.cost <= 10 &&
      !card.isLegendary &&
      !card.isSpell &&
      !usedInChoices.has(card.id),
  );
  if (highRangeCards.length >= 4) {
    const highRangeChoice = highRangeCards.slice(0, 4);
    choices.push(highRangeChoice);
    highRangeChoice.forEach((card) => usedInChoices.add(card.id));
  }

  // Shuffle all choices to randomize order
  return choices.sort(() => Math.random() - 0.5);
};

// Generate draft choices with cost-based logic
export const generateDraftChoices = (
  usedCardIds: string[],
): { cards: Card[]; isLegendary: boolean; isSpell: boolean } | null => {
  const allChoices = generateAllDraftChoices(usedCardIds);

  if (allChoices.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * allChoices.length);
  const cards = allChoices[randomIndex];
  const isLegendary = cards.some((card) => card.isLegendary);
  const isSpell = cards.some((card) => card.isSpell);

  return { cards, isLegendary, isSpell };
};

export const getRandomCards = (count: number, excludeIds: string[] = []): Card[] => {
  const availableCards = cardDatabase.filter((card) => !excludeIds.includes(card.id) && card.inDraftPool !== false);
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getCardById = (id: string): Card | undefined => {
  return cardDatabase.find((card) => card.id === id);
};
