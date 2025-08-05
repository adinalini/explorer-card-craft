-- Simple approach: Create cron job using standard syntax
SELECT cron.schedule(
  'cleanup-rooms-daily',
  '0 0 * * *', -- Daily at midnight
  $$
  SELECT net.http_post(
    url := 'https://ophgbcyhxvwljfztlvyu.supabase.co/functions/v1/cleanup-rooms',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9waGdiY3loeHZ3bGpmenRsdnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzU4NzYsImV4cCI6MjA2OTkxMTg3Nn0.iiiRP6WtGtwI_jJDnAJUqmEZcoNUbYT3HiBl3VuBnKs"}'::jsonb,
    body := concat('{"time": "', now(), '"}')::jsonb
  ) as request_id;
  $$
);