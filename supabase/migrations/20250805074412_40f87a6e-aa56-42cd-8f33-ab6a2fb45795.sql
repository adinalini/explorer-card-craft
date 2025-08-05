-- Enable realtime for rooms table
ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;

-- Enable realtime for room_cards table  
ALTER TABLE public.room_cards REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_cards;

-- Enable realtime for player_decks table
ALTER TABLE public.player_decks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_decks;