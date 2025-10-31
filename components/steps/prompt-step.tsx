"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Lightbulb, FileText } from "lucide-react"

interface PromptStepProps {
  value: string
  onChange: (value: string) => void
}

export default function PromptStep({ value, onChange }: PromptStepProps) {
  const suggestions = [
    "Create a presentation about sustainable energy solutions",
    "Develop slides for a marketing strategy overview",
    "Build a presentation on artificial intelligence trends",
    "Design slides for a quarterly business review",
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What&apos;s your presentation about?</h2>
        <p className="text-gray-600">
          Describe the topic or theme for your slides. Be as specific as possible to get the best results.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-base font-medium">
          Presentation Topic
        </Label>
        <Textarea
          id="prompt"
          placeholder="Enter your presentation topic or description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] text-base"
        />
        <p className="text-sm text-gray-500">{value.length}/500 characters</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Suggestions:</span>
        </div>
        <div className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onChange(suggestion)}
              className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-gray-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
