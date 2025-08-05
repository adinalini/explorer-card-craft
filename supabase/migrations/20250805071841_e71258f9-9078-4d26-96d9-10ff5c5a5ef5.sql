-- Update game_sessions table to have 2-minute expiration for new sessions
ALTER TABLE public.game_sessions 
ALTER COLUMN expires_at SET DEFAULT (now() + '00:02:00'::interval);

-- Update existing unexpired sessions to expire in 2 minutes from now
UPDATE public.game_sessions 
SET expires_at = (now() + '00:02:00'::interval)
WHERE expires_at > now();