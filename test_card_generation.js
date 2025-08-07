// Test card generation script - run this to check generation process
const testCardGeneration = () => {
  console.log("=== TEST CARD GENERATION ===\n");
  
  // Generate 3 full test drafts
  for (let testRun = 1; testRun <= 3; testRun++) {
    console.log(`📋 GENERATION TEST ${testRun}`);
    console.log("═".repeat(50));
    
    const usedCards = [];
    
    for (let round = 1; round <= 13; round++) {
      // Simulate the generation process
      const availableCards = allCards.filter(card => !usedCards.includes(card.id));
      
      if (availableCards.length < 4) {
        console.log(`❌ ROUND ${round}: Not enough cards available (${availableCards.length})`);
        break;
      }
      
      // Get 4 random cards
      const roundCards = [];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const selectedCard = availableCards.splice(randomIndex, 1)[0];
        roundCards.push(selectedCard);
        usedCards.push(selectedCard.id);
      }
      
      // Split into creator and joiner
      const creatorCards = roundCards.slice(0, 2);
      const joinerCards = roundCards.slice(2, 4);
      
      console.log(`Round ${round.toString().padStart(2, '0')}: Creator: [${creatorCards.map(c => c.name).join(', ')}] | Joiner: [${joinerCards.map(c => c.name).join(', ')}]`);
    }
    
    console.log(`Total cards used: ${usedCards.length}/104\n`);
  }
};

// Mock card data for testing (simplified)
const allCards = [
  { id: 'ali_baba', name: 'Ali Baba' },
  { id: 'alice', name: 'Alice' },
  { id: 'baloo', name: 'Baloo' },
  { id: 'bandersnatch', name: 'Bandersnatch' },
  { id: 'banshee', name: 'Banshee' },
  { id: 'beast', name: 'Beast' },
  { id: 'big_bad_wolf', name: 'Big Bad Wolf' },
  { id: 'billy', name: 'Billy' },
  { id: 'black_knight', name: 'Black Knight' },
  { id: 'bridge_troll', name: 'Bridge Troll' },
  // Add more cards as needed for complete testing
  // ... (would continue with all 104 cards)
];

// For actual testing, you'd want to import the real card data
// testCardGeneration();

console.log("Test script ready - call testCardGeneration() to run");