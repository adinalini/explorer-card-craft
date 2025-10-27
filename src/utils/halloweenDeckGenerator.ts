import { cardDatabase, Card } from './cardData';

// Halloween card list
const halloweenCardNames = [
  'Mummy', 'searing light', 'Twister toss', 'Banshee', 'dr. frank', 
  'mad hatter', 'mothman', 'scarecrow', 'Soul surge', 'underworld Flare', 
  'yuki onna', 'beast', 'big bad wolf', 'butcher', 'dark omen', 
  "it's alive", 'scorpion', 'sea witch', 'baba yaga', 'Dracula', 
  'imhotep', 'Moby', 'wicked stepmother', 'wicked witch of the west', 
  'Bigfoot', 'Bridge troll', 'death', 'headless horseman', 'the flying dutchman', 
  'chimera', 'impundulu', 'koschei', 'legion of the dead', 'bandersnatch', 
  'the kraken', 'Phantom coachman', 'Jacks giant', 'guy of gisborne', 
  'billy', 'siren', 'king shahryar', 'grendel', 'flying Monkey', 
  'morgan le fay', 'baker', 'Sheriff of nottingham', 'rumple', 
  'Moriarty', 'drop bear', 'jack in the box'
];

// Get Halloween cards from the main database
const halloweenCards = cardDatabase.filter(card => 
  halloweenCardNames.some(name => 
    card.name.toLowerCase() === name.toLowerCase()
  )
);

// Categorize by cost
const cost0to2 = halloweenCards.filter(c => c.cost >= 0 && c.cost <= 2 && !c.isLegendary);
const cost3 = halloweenCards.filter(c => c.cost === 3 && !c.isLegendary);
const cost4 = halloweenCards.filter(c => c.cost === 4 && !c.isLegendary);
const cost5 = halloweenCards.filter(c => c.cost === 5 && !c.isLegendary);
const cost6 = halloweenCards.filter(c => c.cost === 6 && !c.isLegendary);
const cost7to10 = halloweenCards.filter(c => c.cost >= 7 && c.cost <= 10 && !c.isLegendary);
const legendaries = halloweenCards.filter(c => c.isLegendary);

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
  const usedCards = new Set<string>();
  const deck: Card[] = [];

  // 1. Random legendary out of the 3
  const legendary = getRandomCards(legendaries, 1, usedCards);
  deck.push(...legendary);

  // 2. 3 cards from cost 0-2
  const lowCost = getRandomCards(cost0to2, 3, usedCards);
  deck.push(...lowCost);

  // 3. 2 cards from cost 3
  const threes = getRandomCards(cost3, 2, usedCards);
  deck.push(...threes);

  // 4. 2 cards from cost 4
  const fours = getRandomCards(cost4, 2, usedCards);
  deck.push(...fours);

  // 5. 1 card from cost 5
  const fives = getRandomCards(cost5, 1, usedCards);
  deck.push(...fives);

  // 6. 1 card from cost 6
  const sixes = getRandomCards(cost6, 1, usedCards);
  deck.push(...sixes);

  // 7. 2 cards from cost 7-10
  const highCost = getRandomCards(cost7to10, 2, usedCards);
  deck.push(...highCost);

  // 8. One random card not already picked from cost 0-10 (non-legendary)
  const allAvailable = halloweenCards.filter(c => !usedCards.has(c.id) && !c.isLegendary);
  if (allAvailable.length > 0) {
    const random = getRandomCards(allAvailable, 1, usedCards);
    deck.push(...random);
  } else {
    console.error('No cards available for final random pick. UsedCards:', usedCards.size, 'Total Halloween cards:', halloweenCards.length);
  }

  // Sort by cost
  return deck.sort((a, b) => a.cost - b.cost);
}
