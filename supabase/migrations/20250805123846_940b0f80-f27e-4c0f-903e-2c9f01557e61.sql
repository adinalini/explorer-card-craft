-- Add round timing fields to rooms table
ALTER TABLE public.rooms 
ADD COLUMN round_start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN round_duration_seconds INTEGER DEFAULT 15;