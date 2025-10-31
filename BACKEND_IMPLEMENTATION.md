# Backend Implementation for Presentation Creation with Template Selection

## Overview
This implementation adds backend functionality for creating presentations with template selection and LLM integration using Google Gemini Flash 2.5. The system allows users to:

1. Choose from 12 different presentation templates
2. Generate enhanced content using AI
3. Create actual PowerPoint (.pptx) files
4. Download generated presentations

## Files Created/Modified

### 1. API Endpoints

#### `/app/api/presentations/generate-with-template/route.ts`
- **Purpose**: Main API endpoint for generating presentations with template selection
- **Features**:
  - Accepts outline data and template ID
  - Uses Google Gemini Flash 2.5 for content enhancement
  - Generates actual PPTX files using the selected template
  - Deducts user credits and saves presentation to database

#### `/app/api/presentations/download/route.ts`
- **Purpose**: Handles downloading generated PPTX files
- **Features**:
  - Authenticates user access
  - Retrieves presentation data from database
  - Generates PPTX on-the-fly
  - Returns file as downloadable attachment

### 2. Utilities

#### `/lib/pptx-generator.ts`
- **Purpose**: PowerPoint generation utility
- **Features**:
  - 12 predefined template styles with colors and fonts
  - Slide creation with title, content, and bullet points
  - Image integration (placeholder for external APIs)
  - Speaker notes support
  - Template-specific styling

### 3. Frontend Components

#### Updated `components/slide-creation-form.tsx`
- **Changes**: 
  - Integrated with new API endpoint
  - Stores presentation ID and enhanced data
  - Improved error handling

#### Updated `components/slide-results.tsx`
- **Changes**:
  - Added download functionality
  - Integrated with download API endpoint
  - Better presentation data handling

#### Updated `components/steps/template-step.tsx`
- **Changes**:
  - Added formData prop for better integration
  - Template selection interface remains the same

### 4. Database Schema

#### New Migration: `scripts/002-update-presentations-table.sql`
- **Purpose**: Updates presentations table to support new features
- **New Columns**:
  - `prompt`: TEXT - Original user prompt
  - `slide_count`: INTEGER - Number of slides
  - `template`: VARCHAR(100) - Template identifier
  - `content`: JSONB - Enhanced slide content
  - `status`: VARCHAR(50) - Processing status
  - `file_name`: VARCHAR(255) - Generated file name

## Template System

### Available Templates
1. **modern-minimal** - Clean, professional design
2. **vibrant-creative** - Colorful, creative layout
3. **corporate-blue** - Business-focused blue theme
4. **nature-green** - Environmental, green theme
5. **tech-dark** - Dark theme for technology presentations
6. **warm-orange** - Energetic orange theme
7. **elegant-purple** - Sophisticated purple theme
8. **fresh-mint** - Fresh, health-focused theme
9. **sunset-gradient** - Warm gradient theme
10. **ocean-blue** - Calm blue ocean theme
11. **monochrome** - Minimal black and white
12. **forest-theme** - Nature-inspired green theme

### Template Structure
Each template includes:
- Background colors/gradients
- Title and text colors
- Accent colors
- Font specifications
- Bullet point styling

## API Flow

### 1. Presentation Generation
```
POST /api/presentations/generate-with-template
{
  "title": "Presentation Title",
  "outlines": [/* slide outline data */],
  "templateId": "modern-minimal",
  "language": "english"
}
```

**Response:**
```json
{
  "success": true,
  "presentation": {
    "id": "uuid",
    "title": "Title",
    "fileName": "presentation-123.pptx",
    "slidesGenerated": 5,
    "templateUsed": "modern-minimal"
  },
  "slides": [/* enhanced slide data */],
  "remainingCredits": 9
}
```

### 2. File Download
```
GET /api/presentations/download?id=presentation-id
```

**Response:** Binary PPTX file with appropriate headers

## AI Integration

### Google Gemini Flash 2.5
- **Model**: `gemini-2.0-flash-exp`
- **Purpose**: Enhance slide content based on user outlines
- **Features**:
  - Professional content generation
  - Template-aware styling suggestions
  - Image keyword suggestions
  - Speaker notes generation

### Prompt Structure
The AI receives:
- Original slide outlines
- Template style information
- Content enhancement instructions
- Specific output format requirements

## Dependencies Added

### NPM Packages
- `pptxgenjs` - PowerPoint generation
- `node-fetch` - HTTP requests for image fetching
- `@google/generative-ai` - Already installed

## Setup Instructions

### 1. Database Migration
Since this project uses Supabase, apply the migration through:
- Supabase Dashboard → SQL Editor
- Run the contents of `scripts/002-update-presentations-table.sql`

**Note**: The migration script has been fixed to handle the case where the `data` column doesn't exist in the current schema.

### 2. Environment Variables
Ensure these are set in `.env.local`:
```
GOOGLE_AI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Install Dependencies
```bash
npm install pptxgenjs node-fetch
```

## Usage Flow

1. **User creates presentation outline** in step 1-2
2. **User selects template** in step 3
3. **System calls AI** to enhance content
4. **System generates PPTX** with selected template
5. **User downloads** the generated file

## Error Handling

- Authentication checks on all endpoints
- Credit validation before processing
- Database error handling
- AI API error handling with fallbacks
- File generation error handling

## Future Enhancements

1. **Image Integration**: Add Pexels/Unsplash API for automatic image insertion
2. **More Templates**: Add additional template styles
3. **Custom Branding**: Allow users to upload custom templates
4. **Batch Processing**: Support multiple presentations
5. **Export Formats**: Add PDF, Google Slides export
6. **Real-time Preview**: Show live template preview

## Testing

To test the implementation:
1. Apply database migration
2. Start the development server
3. Create a new presentation
4. Select a template
5. Generate and download the PPTX file

The system will create a professional PowerPoint presentation with the selected template styling and AI-enhanced content.
