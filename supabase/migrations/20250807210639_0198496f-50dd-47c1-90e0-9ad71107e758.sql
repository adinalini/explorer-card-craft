-- Delete all rooms and related data to start fresh
DELETE FROM public.player_decks;
DELETE FROM public.room_cards;
DELETE FROM public.game_sessions;
DELETE FROM public.rooms;