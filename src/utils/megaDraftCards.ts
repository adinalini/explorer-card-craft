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

// Generate 36 cards for mega draft following the specified rules
export const generateMegaDraftCards = (usedCardIds: string[]): Card[] => {
  const availableCards = cardDatabase.filter(card => !usedCardIds.includes(card.id) && card.cost !== undefined)
  
  const selectedCards: Card[] = []
  const usedInSelection: Set<string> = new Set()

  // 1. Include 2 from the following costs: 1,2,3,4,5,6 (12 cards total)
  const guaranteedCosts = [1, 2, 3, 4, 5, 6]
  for (const cost of guaranteedCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !usedInSelection.has(card.id)
    )
    
    if (cardsOfCost.length >= 2) {
      const shuffled = shuffleArray(cardsOfCost)
      const selected = shuffled.slice(0, 2)
      selectedCards.push(...selected)
      selected.forEach(card => usedInSelection.add(card.id))
    }
  }

  // 2. Include 2 from the range (7-10) (2 cards total)
  const highCostCards = availableCards.filter(card => 
    card.cost && card.cost >= 7 && card.cost <= 10 && !card.isLegendary && !usedInSelection.has(card.id)
  )
  
  if (highCostCards.length >= 2) {
    const shuffled = shuffleArray(highCostCards)
    const selected = shuffled.slice(0, 2)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 3. Include 3 random legendaries (3 cards total)
  const legendaryCards = availableCards.filter(card => card.isLegendary && !usedInSelection.has(card.id))
  
  if (legendaryCards.length >= 3) {
    const shuffled = shuffleArray(legendaryCards)
    const selected = shuffled.slice(0, 3)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 4. Add 2 random spells (2 cards total)
  const spellCards = availableCards.filter(card => card.isSpell && !usedInSelection.has(card.id))
  
  if (spellCards.length >= 2) {
    const shuffled = shuffleArray(spellCards)
    const selected = shuffled.slice(0, 2)
    selectedCards.push(...selected)
    selected.forEach(card => usedInSelection.add(card.id))
  }

  // 5. Fill the remaining 17 choices with random cards from the entire pool left barring legendary
  const remainingCards = availableCards.filter(card => 
    !card.isLegendary && !usedInSelection.has(card.id)
  )
  
  const needed = 36 - selectedCards.length
  if (remainingCards.length >= needed) {
    const shuffled = shuffleArray(remainingCards)
    const selected = shuffled.slice(0, needed)
    selectedCards.push(...selected)
  }

  // CRITICAL FIX: Ensure exactly 36 cards
  if (selectedCards.length > 36) {
    selectedCards.splice(36)
  }

  // Sort cards by cost then name, but keep legendaries at the end
  const nonLegendaryCards = selectedCards.filter(card => !card.isLegendary)
  const legendaries = selectedCards.filter(card => card.isLegendary)
  
  // Sort non-legendary cards by cost then name
  nonLegendaryCards.sort((a, b) => {
    if (a.cost !== b.cost) {
      return (a.cost || 0) - (b.cost || 0)
    }
    return a.name.localeCompare(b.name)
  })
  
  // Sort legendary cards by cost then name
  legendaries.sort((a, b) => {
    if (a.cost !== b.cost) {
      return (a.cost || 0) - (b.cost || 0)
    }
    return a.name.localeCompare(b.name)
  })
  
  // Return array with non-legendaries first (33 cards) then legendaries (3 cards) at the end
  return [...nonLegendaryCards, ...legendaries]
}
