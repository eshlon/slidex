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
