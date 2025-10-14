-- Create site settings table for password protection
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for password verification)
CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Insert initial password
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('site_password', 'kraken2020');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_site_settings_updated_at();