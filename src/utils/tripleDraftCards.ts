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
  const availableCards = cardDatabase.filter(card => 
    !usedCardIds.includes(card.id) && 
    card.cost !== undefined && 
    card.inDraftPool !== false
  )
  
  const choices: Card[][] = []
  const usedInChoices: Set<string> = new Set()

  // 1. Guaranteed cost rounds - 1,2,3,4,5 (5 rounds)
  const guaranteedCosts = [1, 2, 3, 4, 5]
  for (const cost of guaranteedCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
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

  // 3. 3 rounds where cards are in cost range (1-3) - randomly select costs first
  for (let i = 0; i < 3; i++) {
    const rangeChoice: Card[] = []
    
    // Randomly select 3 costs from range 1-3 (with repeats allowed)
    const selectedCosts = [
      Math.floor(Math.random() * 3) + 1, // Random 1-3
      Math.floor(Math.random() * 3) + 1, // Random 1-3
      Math.floor(Math.random() * 3) + 1  // Random 1-3
    ]
    
    // For each selected cost, pick one random card
    for (const cost of selectedCosts) {
      const cardsOfCost = availableCards.filter(card => 
        card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
      )
      
      if (cardsOfCost.length > 0) {
        const shuffled = shuffleArray(cardsOfCost)
        const selectedCard = shuffled[0]
        rangeChoice.push(selectedCard)
        usedInChoices.add(selectedCard.id)
      }
    }
    
    if (rangeChoice.length === 3) {
      choices.push(rangeChoice)
    }
  }

  // 4. 2 rounds where cards are in cost range (4-6) - randomly select costs first
  for (let i = 0; i < 2; i++) {
    const rangeChoice: Card[] = []
    
    // Randomly select 3 costs from range 4-6 (with repeats allowed)
    const selectedCosts = [
      Math.floor(Math.random() * 3) + 4, // Random 4-6
      Math.floor(Math.random() * 3) + 4, // Random 4-6
      Math.floor(Math.random() * 3) + 4  // Random 4-6
    ]
    
    // For each selected cost, pick one random card
    for (const cost of selectedCosts) {
      const cardsOfCost = availableCards.filter(card => 
        card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
      )
      
      if (cardsOfCost.length > 0) {
        const shuffled = shuffleArray(cardsOfCost)
        const selectedCard = shuffled[0]
        rangeChoice.push(selectedCard)
        usedInChoices.add(selectedCard.id)
      }
    }
    
    if (rangeChoice.length === 3) {
      choices.push(rangeChoice)
    }
  }

  // 5. 1 round where cards are in cost range (7-10) - randomly select costs first
  const highRangeChoice: Card[] = []
  
  // Randomly select 3 costs from range 7-10 (with repeats allowed)
  const selectedHighCosts = [
    Math.floor(Math.random() * 4) + 7, // Random 7-10
    Math.floor(Math.random() * 4) + 7, // Random 7-10
    Math.floor(Math.random() * 4) + 7  // Random 7-10
  ]
  
  // For each selected cost, pick one random card
  for (const cost of selectedHighCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length > 0) {
      const shuffled = shuffleArray(cardsOfCost)
      const selectedCard = shuffled[0]
      highRangeChoice.push(selectedCard)
      usedInChoices.add(selectedCard.id)
    }
  }
  
  if (highRangeChoice.length === 3) {
    choices.push(highRangeChoice)
  }

  // 6. 1 guaranteed spell round- 3 random spells selected (excluding legendaries)
  const spellCards = availableCards.filter(card => card.isSpell && !card.isLegendary && !usedInChoices.has(card.id))
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