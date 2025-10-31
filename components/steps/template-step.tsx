"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Palette } from "lucide-react"
import Image from "next/image"

interface FormData {
  prompt: string
  slideCount: number
  language: string
  outlines: Array<{
    id: string
    title: string
    content: string[]
  }>
  template: string
}

interface TemplateStepProps {
  value: string
  onChange: (value: string) => void
  isGenerating: boolean
  onCreatePresentation: () => void
  formData?: FormData
}

const templates = [
  {
    id: "aura",
    name: "Aura",
    category: "Creative",
    color: "bg-gradient-to-br from-purple-100 to-purple-200",
    accent: "bg-purple-500",
    thumbnail: "/thumbnails/aura.png?height=80&width=120",
  },
  {
    id: "bevel-design",
    name: "Bevel Design",
    category: "Modern",
    color: "bg-gradient-to-br from-gray-100 to-gray-300",
    accent: "bg-gray-600",
    thumbnail: "/thumbnails/bevel-design.png?height=80&width=120",
  },
  {
    id: "big-bold",
    name: "Big Bold",
    category: "Bold",
    color: "bg-gradient-to-br from-yellow-100 to-yellow-200",
    accent: "bg-yellow-500",
    thumbnail: "/thumbnails/big-bold.png?height=80&width=120",
  },
  {
    id: "blue-spheres",
    name: "Blue Spheres",
    category: "Tech",
    color: "bg-gradient-to-br from-blue-100 to-blue-300",
    accent: "bg-blue-600",
    thumbnail: "/thumbnails/blue-spheres.png?height=80&width=120",
  },
  {
    id: "bold-underlines",
    name: "Bold Underlines",
    category: "Minimal",
    color: "bg-gradient-to-br from-red-100 to-red-200",
    accent: "bg-red-500",
    thumbnail: "/thumbnails/bold-underlines.png?height=80&width=120",
  },
  {
    id: "color-block",
    name: "Color Block",
    category: "Colorful",
    color: "bg-gradient-to-br from-pink-100 to-pink-300",
    accent: "bg-pink-500",
    thumbnail: "/thumbnails/color-block.png?height=80&width=120",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    category: "Business",
    color: "bg-gradient-to-br from-blue-50 to-blue-200",
    accent: "bg-blue-700",
    thumbnail: "/thumbnails/corporate-blue.png?height=80&width=120",
  },
  {
    id: "fission",
    name: "Fission",
    category: "Tech",
    color: "bg-gradient-to-br from-indigo-100 to-indigo-300",
    accent: "bg-indigo-500",
    thumbnail: "/thumbnails/fission.png?height=80&width=120",
  },
  {
    id: "futuristic-pitch",
    name: "Futuristic",
    category: "Tech",
    color: "bg-gradient-to-br from-gray-200 to-gray-400",
    accent: "bg-gray-700",
    thumbnail: "/thumbnails/futuristic.png?height=80&width=120",
  },
  {
    id: "gradient-aura",
    name: "Gradient Aura",
    category: "Creative",
    color: "bg-gradient-to-br from-purple-100 to-indigo-200",
    accent: "bg-purple-600",
    thumbnail: "/thumbnails/gradient-aura.png?height=80&width=120",
  },
  {
    id: "luminous-design",
    name: "Luminous Design",
    category: "Creative",
    color: "bg-gradient-to-br from-yellow-100 to-orange-200",
    accent: "bg-yellow-600",
    thumbnail: "/thumbnails/luminous-design.png?height=80&width=120",
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    category: "Minimal",
    color: "bg-gradient-to-br from-neutral-100 to-neutral-200",
    accent: "bg-neutral-500",
    thumbnail: "/thumbnails/modern-minimal.png?height=80&width=120",
  },
  {
    id: "modern-sales-strategy",
    name: "Modern Sales Strategy",
    category: "Business",
    color: "bg-gradient-to-br from-sky-100 to-sky-300",
    accent: "bg-sky-600",
    thumbnail: "/thumbnails/modern-sales-strategy.png?height=80&width=120",
  },
  {
    id: "oasis-design",
    name: "Oasis Design",
    category: "Nature",
    color: "bg-gradient-to-br from-green-100 to-emerald-200",
    accent: "bg-emerald-500",
    thumbnail: "/thumbnails/oasis-design.png?height=80&width=120",
  },
  {
    id: "pantone-2022",
    name: "Pantone",
    category: "Colorful",
    color: "bg-gradient-to-br from-orange-100 to-fuchsia-200",
    accent: "bg-fuchsia-500",
    thumbnail: "/thumbnails/pantone.png?height=80&width=120",
  },
  {
    id: "simple-budget-planning",
    name: "Simple Budget Planning",
    category: "Finance",
    color: "bg-gradient-to-br from-amber-100 to-amber-200",
    accent: "bg-amber-600",
    thumbnail: "/thumbnails/simple-budget-planning.png?height=80&width=120",
  },
  {
    id: "sleek-corporate-finance",
    name: "Sleek Corporate Finance",
    category: "Finance",
    color: "bg-gradient-to-br from-slate-100 to-slate-300",
    accent: "bg-slate-700",
    thumbnail: "/thumbnails/sleek-corporate-finance.png?height=80&width=120",
  },
];


export default function TemplateStep({ value, onChange }: TemplateStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Palette className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Choose Your Template
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 rounded-xl ${
              value === template.id
                ? "ring-2 ring-blue-500/50 shadow-lg border-blue-500 transform scale-105"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onChange(template.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  width={120}
                  height={80}
                  className="w-full h-20 object-cover rounded-t-xl"
                />
                
                {value === template.id && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-xs truncate">{template.name}</h3>
                  <Badge variant="secondary" className="text-xs px-1 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {value && (
        <div className="bg-gradient-to-r from-purple-200 to-indigo-100 border-2 border-indigo-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Check className="w-6 h-6 text-purple-600" />
              <span className="font-semibold text-purple-900 text-lg">
                {templates.find((t) => t.id === value)?.name} Selected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
