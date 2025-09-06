-- Add public read access for room validation (joining flow)
-- This allows potential joiners to check if a room exists and its status before creating their session
CREATE POLICY "Public access for room validation" 
ON public.rooms 
FOR SELECT 
USING (true);