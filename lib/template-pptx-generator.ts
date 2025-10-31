import PptxGenJS from "pptxgenjs"
import * as fs from 'fs'

// Template file paths - these files should exist in public/templates/
const TEMPLATE_PATHS = {
    "aura":                         "public/templates/aura.pptx",
    "bevel-design":                 "public/templates/bevel-design.pptx",
    "big-bold":                     "public/templates/big-bold.pptx",
    "blue-spheres":                 "public/templates/blue-spheres.pptx",
    "bold-underlines":              "public/templates/bold-underlines.pptx",
    "color-block":                  "public/templates/color-block.pptx",
    "corporate-blue":               "public/templates/corporate-blue.pptx",
    "fission":                      "public/templates/fission.pptx",
    "futuristic-pitch":             "public/templates/futuristic-pitch.pptx",
    "gradient-aura":                "public/templates/gradient-aura.pptx",
    "luminous-design":              "public/templates/luminous-design.pptx",
    "modern-minimal":               "public/templates/modern-minimal.pptx",
    "modern-sales-strategy":        "public/templates/modern-sales-strategy.pptx",
    "oasis-design":                 "public/templates/oasis-design.pptx",
    "pantone-2022":                 "public/templates/pantone-2022.pptx",
    "simple-budget-planning":       "public/templates/simple-budget-planning.pptx",
    "sleek-corporate-finance":      "public/templates/sleek-corporate-finance.pptx",
    "vibrant-creative":             "public/templates/vibrant-creative.pptx",
}

interface EnhancedSlide {
  slideNumber: number
  title: string
  content: string[]
  imageKeywords?: string
  notes?: string
}

async function checkTemplateExists(templatePath: string): Promise<boolean> {
  try {
    await fs.promises.access(templatePath, fs.constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function fetchImageFromKeywords(): Promise<string | null> {
  try {
    // Example using Unsplash (you need to add your API key)
    // const response = await fetch(
    //   `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords)}&client_id=YOUR_UNSPLASH_KEY`
    // )
    // if (response.ok) {
    //   const data = await response.json()
    //   return data.urls?.regular || null
    // }
    return null
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

export async function generatePresentationFromTemplate(
  slides: EnhancedSlide[],
  templateId: string,
  title: string
): Promise<Buffer> {
  const templatePath = TEMPLATE_PATHS[templateId as keyof typeof TEMPLATE_PATHS]
  
  if (!templatePath) {
    throw new Error(`Template not found: ${templateId}`)
  }

  // Check if template file exists
  const templateExists = await checkTemplateExists(templatePath)
  
  if (!templateExists) {
    console.warn(`Template file not found: ${templatePath}, falling back to programmatic generation`)
    // Fall back to programmatic generation if template file doesn't exist
    return generateProgrammaticPresentation(slides, templateId, title)
  }

  try {
    // Try to use Python-based generation if available
    const { generatePresentationFromTemplateWithPython, checkPythonAvailability } = await import('./python-pptx-generator')
    
    const pythonAvailable = await checkPythonAvailability()
    if (pythonAvailable) {
      console.log('Using Python-based template generation')
      const result = await generatePresentationFromTemplateWithPython(slides, templateId)
      if (result) {
        return result
      }
    }
    
    console.warn(`Python not available or failed, using programmatic generation`)
    return generateProgrammaticPresentation(slides, templateId, title)
    
  } catch (error) {
    console.error('Error loading template:', error)
    // Fall back to programmatic generation
    return generateProgrammaticPresentation(slides, templateId, title)
  }
}

// Fallback programmatic generation (existing implementation)
async function generateProgrammaticPresentation(
  slides: EnhancedSlide[],
  templateId: string,
  title: string
): Promise<Buffer> {
  const pptx = new PptxGenJS()
  
  // Template styles (same as before)
  const templateStyles = {
    "modern-minimal": {
      masterBackground: "#FFFFFF",
      titleColor: "#2D3748",
      textColor: "#4A5568",
      accentColor: "#3182CE",
      font: "Arial",
      titleSize: 32,
      textSize: 18
    },
    "vibrant-creative": {
      masterBackground: "#8B5CF6",
      titleColor: "#FFFFFF", 
      textColor: "#F3E8FF",
      accentColor: "#FDE047",
      font: "Arial",
      titleSize: 36,
      textSize: 20
    },
    "corporate-blue": {
      masterBackground: "#1E40AF",
      titleColor: "#FFFFFF",
      textColor: "#DBEAFE", 
      accentColor: "#FFFFFF",
      font: "Arial",
      titleSize: 28,
      textSize: 16
    },
    "nature-green": {
      masterBackground: "#059669",
      titleColor: "#FFFFFF",
      textColor: "#DCFCE7",
      accentColor: "#FFFFFF", 
      font: "Arial",
      titleSize: 30,
      textSize: 18
    },
    "tech-dark": {
      masterBackground: "#111827",
      titleColor: "#FFFFFF",
      textColor: "#E5E7EB",
      accentColor: "#06B6D4",
      font: "Arial",
      titleSize: 32,
      textSize: 18
    },
    "warm-orange": {
      masterBackground: "#EA580C",
      titleColor: "#FFFFFF",
      textColor: "#FED7AA",
      accentColor: "#FFFFFF",
      font: "Arial", 
      titleSize: 30,
      textSize: 18
    },
    "elegant-purple": {
      masterBackground: "#7C3AED",
      titleColor: "#FFFFFF",
      textColor: "#DDD6FE",
      accentColor: "#FFFFFF",
      font: "Arial",
      titleSize: 32,
      textSize: 18
    },
    "fresh-mint": {
      masterBackground: "#10B981",
      titleColor: "#FFFFFF",
      textColor: "#D1FAE5",
      accentColor: "#FFFFFF",
      font: "Arial",
      titleSize: 30,
      textSize: 18
    },
    "sunset-gradient": {
      masterBackground: "#F59E0B",
      titleColor: "#FFFFFF",
      textColor: "#FEF3C7",
      accentColor: "#FFFFFF",
      font: "Arial",
      titleSize: 32,
      textSize: 18
    },
    "ocean-blue": {
      masterBackground: "#0EA5E9",
      titleColor: "#FFFFFF", 
      textColor: "#E0F2FE",
      accentColor: "#FFFFFF",
      font: "Arial",
      titleSize: 30,
      textSize: 18
    },
    "monochrome": {
      masterBackground: "#6B7280",
      titleColor: "#FFFFFF",
      textColor: "#F9FAFB",
      accentColor: "#000000",
      font: "Arial",
      titleSize: 28,
      textSize: 16
    },
    "forest-theme": {
      masterBackground: "#166534",
      titleColor: "#FFFFFF",
      textColor: "#DCFCE7",
      accentColor: "#FDE047",
      font: "Arial",
      titleSize: 30,
      textSize: 18
    }
  }

  const style = templateStyles[templateId as keyof typeof templateStyles] || templateStyles["modern-minimal"]
  
  // Set presentation properties
  pptx.author = "Slidex AI"
  pptx.company = "Slidex"
  pptx.title = title
  pptx.subject = "AI Generated Presentation"
  
  // Create slides
  for (const slideData of slides) {
    const slide = pptx.addSlide()
    
    // Set slide background
    slide.background = { color: style.masterBackground }
    
    // Add title
    slide.addText(slideData.title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: style.titleSize,
      color: style.titleColor,
      bold: true,
      fontFace: style.font,
      align: "center"
    })
    
    // Add content bullets
    if (slideData.content && slideData.content.length > 0) {
      const bulletPoints = slideData.content.map(item => ({
        text: item,
        options: {
          fontSize: style.textSize,
          color: style.textColor,
          fontFace: style.font,
          bullet: true
        }
      }))
      
      slide.addText(bulletPoints, {
        x: 1,
        y: 2,
        w: 8,
        h: 4
      })
    }
    
    // Add image if keywords provided (placeholder)
    if (slideData.imageKeywords) {
      try {
        const imageUrl = await fetchImageFromKeywords()
        if (imageUrl) {
          slide.addImage({
            path: imageUrl,
            x: 6,
            y: 2,
            w: 3,
            h: 2
          })
        }
      } catch (error) {
        console.error('Error adding image:', error)
      }
    }
    
    // Add speaker notes
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }
  
  // Generate and return buffer
  return await pptx.write({ outputType: "nodebuffer" }) as Buffer
}

export function getTemplateName(templateId: string): string {
  const templateNames = {
  "aura": "Aura",
  "bevel-design": "Bevel Design",
  "big-bold": "Big Bold",
  "blue-spheres": "Blue Spheres",
  "bold-underlines": "Bold Underlines",
  "color-block": "Color Block",
  "corporate-blue": "Corporate Blue",
  "fission": "Fission",
  "futuristic-pitch": "Futuristic Pitch",
  "gradient-aura": "Gradient Aura",
  "luminous-design": "Luminous Design",
  "modern-minimal": "Modern Minimal",
  "modern-sales-strategy": "Modern Sales Strategy",
  "oasis-design": "Oasis Design",
  "pantone-2022": "Pantone 2022",
  "simple-budget-planning": "Simple Budget Planning",
  "sleek-corporate-finance": "Sleek Corporate Finance",
  "vibrant-creative": "Vibrant Creative",
}
  
  return templateNames[templateId as keyof typeof templateNames] || "Default Template"
}

export function getAvailableTemplates(): string[] {
  return Object.keys(TEMPLATE_PATHS)
}

export async function validateTemplate(templateId: string): Promise<boolean> {
  const templatePath = TEMPLATE_PATHS[templateId as keyof typeof TEMPLATE_PATHS]
  if (!templatePath) return false
  return await checkTemplateExists(templatePath)
}
