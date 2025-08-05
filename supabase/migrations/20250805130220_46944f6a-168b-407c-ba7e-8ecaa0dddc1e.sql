-- Move extensions to extensions schema instead of public
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Drop extensions from public schema if they exist there
DROP EXTENSION IF EXISTS pg_cron CASCADE;
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Recreate extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate the cron job using the extensions schema
SELECT extensions.cron.schedule(
  'cleanup-rooms-daily',
  '0 0 * * *', -- Daily at midnight
  $$
  SELECT extensions.net.http_post(
    url := 'https://ophgbcyhxvwljfztlvyu.supabase.co/functions/v1/cleanup-rooms',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGdiY3loeHZ3bGpmenRsdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzU4NzYsImV4cCI6MjA2OTkxMTg3Nn0.iiiRP6WtGtwI_jJDnAJUqmEZcoNUbYT3HiBl3VuBnKs"}'::jsonb,
    body := concat('{"time": "', now(), '"}')::jsonb
  ) as request_id;
  $$
);