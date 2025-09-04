import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-session-token',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { roomId } = await req.json()
    const sessionToken = req.headers.get('x-session-token')

    if (!roomId || !sessionToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Room ID and session token are required',
          success: false 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Managing timer for room ${roomId} with session ${sessionToken}`)

    // Use the database function to update timer atomically
    const { data, error } = await supabase
      .rpc('update_round_timer', {
        room_id_param: roomId,
        session_token_param: sessionToken
      })

    if (error) {
      console.error('Timer update error:', error)
      return new Response(
        JSON.stringify({ 
          error: error.message,
          success: false 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const result = data?.[0]
    if (!result?.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized or invalid room access',
          success: false 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Timer updated successfully for room ${roomId}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        roundStartTime: result.round_start_time,
        serverTime: result.server_time
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})