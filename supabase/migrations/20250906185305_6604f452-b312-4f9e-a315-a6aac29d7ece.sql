-- CRITICAL SECURITY FIX: Replace overly permissive public room access with secure room validation

-- Remove the dangerous public access policy that exposes all room data
DROP POLICY IF EXISTS "Public access for room validation" ON public.rooms;

-- Create a secure function for room validation that only returns necessary info
CREATE OR REPLACE FUNCTION public.validate_room_for_joining(room_id_param text)
RETURNS TABLE(
  room_exists boolean,
  is_available boolean,
  room_full boolean
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    CASE WHEN r.id IS NOT NULL THEN true ELSE false END as room_exists,
    CASE 
      WHEN r.id IS NULL THEN false
      WHEN r.joiner_name IS NOT NULL THEN false 
      WHEN r.status NOT IN ('waiting', 'ready') THEN false
      ELSE true 
    END as is_available,
    CASE 
      WHEN r.joiner_name IS NOT NULL THEN true 
      ELSE false 
    END as room_full
  FROM public.rooms r
  WHERE r.id = room_id_param;
$$;

-- Create a secure policy that allows calling the validation function
CREATE POLICY "Public room validation function access" 
ON public.rooms 
FOR SELECT 
USING (false); -- This policy will never match directly, but allows the function to work

-- Grant execute permission on the validation function to public
GRANT EXECUTE ON FUNCTION public.validate_room_for_joining TO public;