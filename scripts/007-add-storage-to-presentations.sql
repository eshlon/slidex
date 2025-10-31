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
