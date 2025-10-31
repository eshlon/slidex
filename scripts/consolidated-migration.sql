-- Update presentations table to match API requirements
ALTER TABLE presentations 
ADD COLUMN IF NOT EXISTS prompt TEXT,
ADD COLUMN IF NOT EXISTS slide_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS template VARCHAR(100),
ADD COLUMN IF NOT EXISTS content JSONB,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);

-- Update existing records to have default values
UPDATE presentations 
SET 
  prompt = COALESCE(prompt, title),
  slide_count = COALESCE(slide_count, 0),
  template = COALESCE(template, 'modern-minimal'),
  content = COALESCE(content, '{}'),
  status = COALESCE(status, 'completed'),
  file_name = COALESCE(file_name, CONCAT('presentation-', id, '.pptx'))
WHERE prompt IS NULL OR slide_count IS NULL OR template IS NULL OR content IS NULL OR status IS NULL OR file_name IS NULL;

-- Drop the old data column (optional, keep for backward compatibility)
-- ALTER TABLE presentations DROP COLUMN IF EXISTS data;

-- Add avatar_url to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add python_api flag to presentations
ALTER TABLE public.presentations
ADD COLUMN IF NOT EXISTS python_api BOOLEAN DEFAULT FALSE;

-- Create decrement_user_credits function
CREATE OR REPLACE FUNCTION decrement_user_credits(user_id_input uuid, decrement_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  current_credits integer;
  new_credits integer;
BEGIN
  -- First, get the current credits and lock the row for update
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id_input FOR UPDATE;

  -- Check if the user has enough credits
  IF current_credits < decrement_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Proceed with decrementing credits
  UPDATE public.profiles
  SET credits = credits - decrement_amount
  WHERE id = user_id_input
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$;

-- Create increment_user_credits function
CREATE OR REPLACE FUNCTION increment_user_credits(user_id_input uuid, increment_amount integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  new_credits integer;
BEGIN
  UPDATE profiles
  SET credits = credits + increment_amount
  WHERE id = user_id_input
  RETURNING credits INTO new_credits;

  RETURN new_credits;
END;
$$;

-- Add columns for file storage and status tracking
ALTER TABLE presentations
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS storage_path TEXT,
ADD COLUMN IF NOT EXISTS python_api BOOLEAN DEFAULT FALSE;

-- Update existing records with default values
UPDATE presentations
SET
  status = COALESCE(status, 'completed'),
  python_api = COALESCE(python_api, FALSE)
WHERE status IS NULL OR python_api IS NULL;

-- Add a new column for PDF file storage
ALTER TABLE presentations
ADD COLUMN IF NOT EXISTS pdf_file_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_storage_path TEXT;
