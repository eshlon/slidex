"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus, Presentation } from "lucide-react"

interface QuantityStepProps {
  value: number
  onChange: (value: number) => void
}

export default function QuantityStep({ value, onChange }: QuantityStepProps) {
  const presetOptions = [3, 5, 8, 10, 15, 20]

  const increment = () => {
    if (value < 50) onChange(value + 1)
  }

  const decrement = () => {
    if (value > 1) onChange(value - 1)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Presentation className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How many slides do you need?</h2>
        <p className="text-gray-600">
          Choose the number of slides for your presentation. You can always adjust this later.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="space-y-4">
          <Label htmlFor="slide-count" className="text-base font-medium block text-center">
            Number of Slides
          </Label>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={decrement} disabled={value <= 1}>
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              id="slide-count"
              type="number"
              min="1"
              max="50"
              value={value}
              onChange={(e) => onChange(Math.max(1, Math.min(50, Number.parseInt(e.target.value) || 1)))}
              className="w-20 text-center text-xl font-semibold"
            />
            <Button variant="outline" size="icon" onClick={increment} disabled={value >= 50}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center text-gray-900">Quick Select</h3>
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {presetOptions.map((option) => (
            <Button
              key={option}
              variant={value === option ? "default" : "outline"}
              onClick={() => onChange(option)}
              className="h-12"
            >
              {option} slides
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-medium text-blue-900 mb-2">Recommendations:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 3-5 slides: Quick overview or pitch</li>
          <li>• 8-10 slides: Standard presentation</li>
          <li>• 15+ slides: Detailed workshop or training</li>
        </ul>
      </div>
    </div>
  )
}
