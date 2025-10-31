import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'

// Template file paths
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

// Create a Python script that mimics the original slide_api.py functionality
async function createPythonScript(slides: EnhancedSlide[], templatePath: string): Promise<string> {
  const pythonScript = `
import sys
import os
import json
import io
from pptx import Presentation
from pptx.enum.shapes import PP_PLACEHOLDER

def generate_pptx_from_slides(slides_data, template_path, output_path):
    """Generate PPTX from slides data using template"""
    try:
        # Load template
        prs = Presentation(template_path)
        
        # Clear existing slides except first one to use as template
        slide_layouts = []
        for master in prs.slide_masters:
            for layout in master.slide_layouts:
                slide_layouts.append(layout)
        
        # Remove all existing slides
        for i in range(len(prs.slides)):
            slide_id = prs.slides._sldIdLst[0].rId
            prs.part.drop_rel(slide_id)
            del prs.slides._sldIdLst[0]
        
        # Add new slides based on the data
        for slide_data in slides_data:
            # Use first layout for title slide, second for content slides
            if slide_data['slideNumber'] == 1:
                layout = slide_layouts[0] if len(slide_layouts) > 0 else slide_layouts[0]
            else:
                layout = slide_layouts[1] if len(slide_layouts) > 1 else slide_layouts[0]
            
            slide = prs.slides.add_slide(layout)
            
            # Fill placeholders
            for shape in slide.shapes:
                if shape.is_placeholder:
                    placeholder_type = shape.placeholder_format.type
                    if placeholder_type == PP_PLACEHOLDER.TITLE or placeholder_type == PP_PLACEHOLDER.CENTER_TITLE:
                        shape.text = slide_data['title']
                    elif placeholder_type == PP_PLACEHOLDER.BODY:
                        # Add bullet points
                        if slide_data['content']:
                            shape.text = '\\n'.join([f"• {item}" for item in slide_data['content']])
        
        # Save to output
        prs.save(output_path)
        return True
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    slides_json = '''${JSON.stringify(slides)}'''
    template_path = "${templatePath}"
    output_path = "${path.join(process.cwd(), 'temp_output.pptx')}"
    
    slides_data = json.loads(slides_json)
    success = generate_pptx_from_slides(slides_data, template_path, output_path)
    
    if success:
        print("SUCCESS")
    else:
        print("FAILED")
`

  const scriptPath = path.join(process.cwd(), 'temp_python_script.py')
  await fs.promises.writeFile(scriptPath, pythonScript)
  return scriptPath
}

async function runPythonScript(scriptPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const pythonProcess = spawn('python3', [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let stdout = ''
    let stderr = ''

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0 && stdout.includes('SUCCESS')) {
        resolve(true)
      } else {
        console.error('Python script error:', stderr)
        resolve(false)
      }
    })

    pythonProcess.on('error', () => {
      console.error('Failed to start Python process:')
      resolve(false)
    })
  })
}

export async function generatePresentationFromTemplateWithPython(
  slides: EnhancedSlide[],
  templateId: string
): Promise<Buffer | null> {
  const templatePath = TEMPLATE_PATHS[templateId as keyof typeof TEMPLATE_PATHS]
  
  if (!templatePath) {
    throw new Error(`Template not found: ${templateId}`)
  }

  const fullTemplatePath = path.join(process.cwd(), templatePath)
  
  // Check if template file exists
  try {
    await fs.promises.access(fullTemplatePath)
  } catch {
    console.warn(`Template file not found: ${fullTemplatePath}`)
    return null
  }

  try {
    // Create Python script
    const scriptPath = await createPythonScript(slides, fullTemplatePath)
    
    // Run Python script
    const success = await runPythonScript(scriptPath)
    
    // Clean up script
    await fs.promises.unlink(scriptPath)
    
    if (success) {
      // Read generated file
      const outputPath = path.join(process.cwd(), 'temp_output.pptx')
      const buffer = await fs.promises.readFile(outputPath)
      
      // Clean up output file
      await fs.promises.unlink(outputPath)
      
      return buffer
    }
    
    return null
    
  } catch (error) {
    console.error('Error generating presentation with Python:', error)
    return null
  }
}

export async function checkPythonAvailability(): Promise<boolean> {
  return new Promise((resolve) => {
    const pythonProcess = spawn('python3', ['--version'], {
      stdio: ['pipe', 'pipe', 'pipe']
    })

    pythonProcess.on('close', (code) => {
      resolve(code === 0)
    })

    pythonProcess.on('error', () => {
      resolve(false)
    })
  })
}
