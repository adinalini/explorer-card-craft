-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cards table
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost INTEGER NOT NULL DEFAULT 0,
  attack INTEGER,
  defense INTEGER,
  rarity TEXT NOT NULL DEFAULT 'common',
  card_type TEXT NOT NULL DEFAULT 'creature',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create decks table
CREATE TABLE public.decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deck_cards junction table
CREATE TABLE public.deck_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(deck_id, card_id)
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER DEFAULT 32,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournament_participants table
CREATE TABLE public.tournament_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cards (public read access)
CREATE POLICY "Cards are viewable by everyone" ON public.cards FOR SELECT USING (true);

-- RLS Policies for decks
CREATE POLICY "Users can view public decks and their own decks" ON public.decks 
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their own decks" ON public.decks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own decks" ON public.decks 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own decks" ON public.decks 
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for deck_cards
CREATE POLICY "Deck cards viewable based on deck access" ON public.deck_cards 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.decks 
      WHERE decks.id = deck_cards.deck_id 
      AND (decks.is_public = true OR decks.user_id = auth.uid())
    )
  );
CREATE POLICY "Users can manage their own deck cards" ON public.deck_cards 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.decks 
      WHERE decks.id = deck_cards.deck_id 
      AND decks.user_id = auth.uid()
    )
  );

-- RLS Policies for tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments 
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Tournament creators can update their tournaments" ON public.tournaments 
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for tournament_participants
CREATE POLICY "Tournament participants are viewable by everyone" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users can join tournaments" ON public.tournament_participants 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave tournaments" ON public.tournament_participants 
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_decks_updated_at
  BEFORE UPDATE ON public.decks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample cards
INSERT INTO public.cards (name, description, cost, attack, defense, rarity, card_type) VALUES
('Lightning Bolt', 'Deal 3 damage to any target', 1, NULL, NULL, 'common', 'spell'),
('Fire Drake', 'A fierce dragon that breathes fire', 4, 4, 3, 'rare', 'creature'),
('Forest Guardian', 'Protects the ancient woods', 3, 2, 5, 'uncommon', 'creature'),
('Healing Potion', 'Restore 5 health', 2, NULL, NULL, 'common', 'spell'),
('Shadow Assassin', 'Strikes from the darkness', 2, 3, 1, 'uncommon', 'creature'),
('Ancient Golem', 'An unstoppable force', 7, 8, 8, 'legendary', 'creature'),
('Mind Control', 'Take control of target creature', 5, NULL, NULL, 'rare', 'spell'),
('Swift Scout', 'Quick and nimble', 1, 1, 1, 'common', 'creature'),
('Frost Giant', 'Freezes enemies in place', 6, 6, 6, 'rare', 'creature'),
('Magic Shield', 'Prevent the next 4 damage', 3, NULL, NULL, 'uncommon', 'spell');