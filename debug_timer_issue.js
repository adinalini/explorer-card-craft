const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ophgbcyhxvwljfztlvyu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGdiY3loeHZ3bGpmenRsdnl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMzNTg3NiwiZXhwIjoyMDY5OTExODc2fQ.mPzbZPrQWikLlpuxdSw2fJt3h2dlPqw3MFduppiNECo'
);

async function investigateTimerIssue() {
  try {
    console.log('🔍 Investigating timer issue...\n');

    // Get recent rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (roomsError) throw roomsError;

    console.log('📋 Recent rooms:');
    rooms.forEach((room, index) => {
      console.log(`${index + 1}. Room ${room.id}:`);
      console.log(`   - Status: ${room.status}`);
      console.log(`   - Draft Type: ${room.draft_type}`);
      console.log(`   - Current Round: ${room.current_round}`);
      console.log(`   - Round Start Time: ${room.round_start_time}`);
      console.log(`   - Triple Draft Phase: ${room.triple_draft_phase}`);
      console.log(`   - Created: ${room.created_at}`);
      console.log('');
    });

    // Get active triple draft rooms
    const { data: activeTripleRooms, error: activeError } = await supabase
      .from('rooms')
      .select('*')
      .eq('draft_type', 'triple')
      .eq('status', 'drafting');

    if (activeError) throw activeError;

    console.log('🔷 Active Triple Draft Rooms:');
    activeTripleRooms.forEach((room, index) => {
      console.log(`${index + 1}. Room ${room.id}:`);
      console.log(`   - Round: ${room.current_round}`);
      console.log(`   - Phase: ${room.triple_draft_phase}`);
      console.log(`   - Round Start Time: ${room.round_start_time}`);
      
      // Calculate time elapsed
      if (room.round_start_time) {
        const startTime = new Date(room.round_start_time);
        const now = new Date();
        const elapsed = (now.getTime() - startTime.getTime()) / 1000;
        console.log(`   - Time Elapsed: ${elapsed.toFixed(1)}s`);
        console.log(`   - Time Remaining: ${Math.max(0, 8 - elapsed).toFixed(1)}s`);
      }
      console.log('');
    });

    // Get room cards for active rooms
    if (activeTripleRooms.length > 0) {
      const roomIds = activeTripleRooms.map(r => r.id);
      const { data: roomCards, error: cardsError } = await supabase
        .from('room_cards')
        .select('*')
        .in('room_id', roomIds)
        .order('round_number', { ascending: true });

      if (cardsError) throw cardsError;

      console.log('🎴 Room Cards Analysis:');
      roomCards.forEach(card => {
        console.log(`   - Room ${card.room_id}, Round ${card.round_number}:`);
        console.log(`     Card: ${card.card_id} (${card.card_name})`);
        console.log(`     Side: ${card.side}`);
        console.log(`     Selected by: ${card.selected_by || 'none'}`);
      });
    }

    // Check for any database triggers or functions that might affect round_start_time
    console.log('\n🔧 Checking for database triggers...');
    const { data: triggers, error: triggersError } = await supabase
      .rpc('get_triggers')
      .catch(() => ({ data: null, error: 'Function not available' }));

    if (triggers) {
      console.log('Database triggers found:', triggers);
    } else {
      console.log('No custom triggers found or function not available');
    }

  } catch (error) {
    console.error('❌ Error investigating timer issue:', error);
  }
}

investigateTimerIssue();
