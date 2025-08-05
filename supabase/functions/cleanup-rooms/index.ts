import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete rooms older than 5 minutes that are not completed or have no activity
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    // Get rooms to delete
    const { data: roomsToDelete, error: fetchError } = await supabase
      .from('rooms')
      .select('id')
      .or(`created_at.lt.${fiveMinutesAgo},last_activity.lt.${fiveMinutesAgo}`)
      .neq('status', 'completed')

    if (fetchError) {
      console.error('Error fetching rooms to delete:', fetchError)
      throw fetchError
    }

    if (!roomsToDelete || roomsToDelete.length === 0) {
      console.log('No rooms to cleanup')
      return new Response(
        JSON.stringify({ message: 'No rooms to cleanup', cleaned: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const roomIds = roomsToDelete.map(room => room.id)
    console.log(`Cleaning up ${roomIds.length} rooms:`, roomIds)

    // Delete related data first (to avoid foreign key constraints)
    await supabase.from('player_decks').delete().in('room_id', roomIds)
    await supabase.from('room_cards').delete().in('room_id', roomIds) 
    await supabase.from('game_sessions').delete().in('room_id', roomIds)
    
    // Delete the rooms
    const { error: deleteError } = await supabase
      .from('rooms')
      .delete()
      .in('id', roomIds)

    if (deleteError) {
      console.error('Error deleting rooms:', deleteError)
      throw deleteError
    }

    console.log(`Successfully cleaned up ${roomIds.length} rooms`)
    
    return new Response(
      JSON.stringify({ 
        message: 'Rooms cleaned up successfully', 
        cleaned: roomIds.length,
        roomIds 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cleanup function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})