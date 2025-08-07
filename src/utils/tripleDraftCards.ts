import { cardDatabase, Card } from "./cardData"

// Fisher-Yates shuffle for true randomization
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Generate cards for triple draft following the specified rules
export const generateTripleDraftChoices = (usedCardIds: string[]): Card[][] => {
  const availableCards = cardDatabase.filter(card => !usedCardIds.includes(card.id) && card.cost !== undefined)
  
  const choices: Card[][] = []
  const usedInChoices: Set<string> = new Set()

  // 1. Guaranteed cost rounds - 1,2,3,4,5 (5 rounds)
  const guaranteedCosts = [1, 2, 3, 4, 5]
  for (const cost of guaranteedCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length >= 3) {
      const shuffled = shuffleArray(cardsOfCost)
      const costChoice = shuffled.slice(0, 3)
      choices.push(costChoice)
      costChoice.forEach(card => usedInChoices.add(card.id))
    }
  }

  // 2. 1 Guaranteed legendary choice round
  const legendaryCards = availableCards.filter(card => card.isLegendary && !usedInChoices.has(card.id))
  if (legendaryCards.length >= 3) {
    const shuffled = shuffleArray(legendaryCards)
    const legendaryChoice = shuffled.slice(0, 3)
    choices.push(legendaryChoice)
    legendaryChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 3. 3 rounds where cards are in cost range (1-3) - mix costs within range
  for (let i = 0; i < 3; i++) {
    const lowCostCards = availableCards.filter(card => 
      card.cost && card.cost >= 1 && card.cost <= 3 && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
    )
    
    if (lowCostCards.length >= 3) {
      // Truly random selection from all costs in range (1-3)
      const shuffled = shuffleArray(lowCostCards)
      const lowCostChoice = shuffled.slice(0, 3)
      choices.push(lowCostChoice)
      lowCostChoice.forEach(card => usedInChoices.add(card.id))
    }
  }

  // 4. 2 rounds where cards are in cost range (4-6) - mix costs within range
  for (let i = 0; i < 2; i++) {
    const midCostCards = availableCards.filter(card => 
      card.cost && card.cost >= 4 && card.cost <= 6 && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
    )
    
    if (midCostCards.length >= 3) {
      // Truly random selection from all costs in range (4-6)
      const shuffled = shuffleArray(midCostCards)
      const midCostChoice = shuffled.slice(0, 3)
      choices.push(midCostChoice)
      midCostChoice.forEach(card => usedInChoices.add(card.id))
    }
  }

  // 5. 1 round where cards are in cost range (7-10) - mix costs within range
  const highCostCards = availableCards.filter(card => 
    card.cost && card.cost >= 7 && card.cost <= 10 && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
  )
  
  if (highCostCards.length >= 3) {
    // Truly random selection from all costs in range (7-10)
    const shuffled = shuffleArray(highCostCards)
    const highCostChoice = shuffled.slice(0, 3)
    choices.push(highCostChoice)
    highCostChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 6. 1 guaranteed spell round- 3 random spells selected
  const spellCards = availableCards.filter(card => card.isSpell && !usedInChoices.has(card.id))
  if (spellCards.length >= 3) {
    const shuffled = shuffleArray(spellCards)
    const spellChoice = shuffled.slice(0, 3)
    choices.push(spellChoice)
    spellChoice.forEach(card => usedInChoices.add(card.id))
  }

  // Truly randomize the order of all choices
  return shuffleArray(choices)
}

// Generate single choice for triple draft
export const generateTripleDraftChoice = (usedCardIds: string[]): { cards: Card[], isLegendary: boolean, isSpell: boolean } | null => {
  const allChoices = generateTripleDraftChoices(usedCardIds)
  
  if (allChoices.length === 0) return null
  
  const randomChoice = allChoices[Math.floor(Math.random() * allChoices.length)]
  const isLegendary = randomChoice.some(card => card.isLegendary)
  const isSpell = randomChoice.some(card => card.isSpell)
  
  return {
    cards: randomChoice,
    isLegendary,
    isSpell
  }
}