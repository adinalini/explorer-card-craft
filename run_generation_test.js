// Quick test script to run card generation
async function testCardGeneration() {
  console.log("🧪 TESTING CARD GENERATION - 3 RUNS");
  console.log("=" * 60);
  
  for (let run = 1; run <= 3; run++) {
    console.log(`\n🎲 GENERATION TEST ${run}`);
    console.log("Total rounds: 13 | Cards per round: 4 | Expected total: 52 cards");
    
    // Call the edge function
    try {
      const response = await fetch('https://ophgbcyhxvwljfztlvyu.supabase.co/functions/v1/generate-round-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGdiY3loeHZ3bGpmenRsdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzU4NzYsImV4cCI6MjA2OTkxMTg3Nn0.iiiRP6WtGtwI_jJDnAJUqmEZcoNUbYT3HiBl3VuBnKs'
        },
        body: JSON.stringify({
          roomId: `TEST${run}`,
          round: 'all',
          usedCardIds: []
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.rounds) {
        let cardCount = 0;
        data.rounds.forEach((round, index) => {
          const roundNum = index + 1;
          const creatorCards = round.filter(c => c.player_role === 'creator').map(c => c.card_name);
          const joinerCards = round.filter(c => c.player_role === 'joiner').map(c => c.card_name);
          cardCount += creatorCards.length + joinerCards.length;
          
          console.log(`Round ${roundNum.toString().padStart(2, '0')}: Creator: [${creatorCards.join(', ')}] | Joiner: [${joinerCards.join(', ')}]`);
        });
        console.log(`✅ Generation complete: ${cardCount} cards used`);
        
        if (cardCount < 52) {
          console.log(`⚠️ Generation incomplete: Only ${cardCount} cards - Missing ${52 - cardCount} cards!`);
        }
      } else {
        console.log(`❌ Generation failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Generation failed: ${error.message}`);
    }
  }
}

// Run the test
testCardGeneration();