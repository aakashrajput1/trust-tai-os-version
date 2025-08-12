-- Add name column to existing users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

-- Update the handle_new_user function to include name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 