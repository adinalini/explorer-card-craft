-- Enable realtime for all game tables to fix room update issues
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_cards REPLICA IDENTITY FULL;
ALTER TABLE public.player_decks REPLICA IDENTITY FULL;
ALTER TABLE public.game_sessions REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication
ALTER publication supabase_realtime ADD TABLE public.rooms;
ALTER publication supabase_realtime ADD TABLE public.room_cards;
ALTER publication supabase_realtime ADD TABLE public.player_decks;
ALTER publication supabase_realtime ADD TABLE public.game_sessions;