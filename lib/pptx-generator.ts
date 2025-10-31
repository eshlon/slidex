import PptxGenJS from "pptxgenjs"

// Template style configurations
const TEMPLATE_STYLES = {
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

interface EnhancedSlide {
  slideNumber: number
  title: string
  content: string[]
  imageKeywords?: string
  notes?: string
}

async function fetchImageFromKeywords(keywords: string): Promise<string | null> {
  try {
    // Use a free image API service like Unsplash or Pexels
    // For demo purposes, we'll use Unsplash
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords)}&client_id=demo`,
      { method: 'GET' }
    )
    
    if (response.ok) {
      const data = await response.json()
      return data.urls?.regular || null
    }
  } catch (error) {
    console.error('Error fetching image:', error)
  }
  return null
}

export async function generatePresentationFile(
  slides: EnhancedSlide[],
  templateId: string,
  title: string
): Promise<Buffer> {
  const pptx = new PptxGenJS()
  
  // Get template style
  const style = TEMPLATE_STYLES[templateId as keyof typeof TEMPLATE_STYLES] || TEMPLATE_STYLES["modern-minimal"]
  
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
      const bulletText = slideData.content.map(item => ({
        text: item,
        options: {
          fontSize: style.textSize,
          color: style.textColor,
          fontFace: style.font,
          bullet: true
        }
      }))
      
      slide.addText(bulletText, {
        x: 1,
        y: 2,
        w: 8,
        h: 4,
        fontSize: style.textSize,
        color: style.textColor,
        fontFace: style.font,
        bullet: true
      })
    }
    
    // Add image if keywords are provided
    if (slideData.imageKeywords) {
      try {
        const imageUrl = await fetchImageFromKeywords(slideData.imageKeywords)
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
        console.error('Error adding image to slide:', error)
      }
    }
    
    // Add speaker notes if provided
    if (slideData.notes) {
      slide.addNotes(slideData.notes)
    }
  }
  
  // Generate the file and return as buffer
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
