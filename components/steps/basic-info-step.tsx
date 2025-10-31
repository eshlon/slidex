"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"

const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    border: 2px solid white;
    transition: all 0.2s ease;
  }

  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    border: 2px solid white;
    transition: all 0.2s ease;
  }
`

interface BasicInfoStepProps {
  formData: {
    prompt: string
    slideCount: number
    language: string
  }
  updateFormData: (field: string, value: string | number) => void
}

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
]

const suggestions = [
  "Sustainable energy solutions for climate change",
  "Digital marketing strategy for small businesses",
  "AI trends in healthcare applications",
  "Quarterly business review and goals",
]

export default function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sliderStyles }} />
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">What&apos;s your presentation about?</h2>
          <p className="text-gray-600">Describe your topic and we&apos;ll help you create amazing slides</p>
        </div>

        <div className="grid gap-8">
          {/* Prompt Section */}
          <div className="space-y-4">
            <Label htmlFor="prompt" className="text-base font-medium text-gray-900">
              Presentation Topic
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe your presentation topic..."
              value={formData.prompt}
              onChange={(e) => updateFormData("prompt", e.target.value)}
              className="min-h-[120px] text-base border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none"
            />

            <div className="grid gap-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => updateFormData("prompt", suggestion)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-sm text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Slide Count and Language Row */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Slide Count */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">Number of Slides</Label>

              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-3">{formData.slideCount}</div>
              </div>

              <div className="px-2">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={formData.slideCount}
                  onChange={(e) => updateFormData("slideCount", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((formData.slideCount - 1) / 29) * 100}%, #e5e7eb ${((formData.slideCount - 1) / 29) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>1</span>
                  <span>15</span>
                  <span>30</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="inline-flex bg-gray-50 rounded-lg p-1 space-x-1">
                  {[3, 5, 8, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateFormData("slideCount", count)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                        formData.slideCount === count
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium text-gray-900">Language</Label>
              <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
                <SelectTrigger className="w-full h-12 border-gray-200 focus:border-purple-300 focus:ring-purple-200">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="border-gray-200">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
