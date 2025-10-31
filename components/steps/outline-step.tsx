"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit2, Check, X, Plus, Trash2, FileText } from "lucide-react"

interface SlideOutline {
  id: string
  title: string
  content: string[]
}

interface OutlineStepProps {
  outlines: SlideOutline[]
  onChange: (outlines: SlideOutline[]) => void
}

export default function OutlineStep({ outlines, onChange }: OutlineStepProps) {
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")

  const startEditing = (slide: SlideOutline) => {
    setEditingSlide(slide.id)
    setEditTitle(slide.title)
    setEditContent(slide.content.join("\n"))
  }

  const saveEdit = () => {
    if (!editingSlide) return

    const updatedOutlines = outlines.map((slide) =>
      slide.id === editingSlide
        ? {
            ...slide,
            title: editTitle,
            content: editContent.split("\n").filter((line) => line.trim() !== ""),
          }
        : slide,
    )
    onChange(updatedOutlines)
    setEditingSlide(null)
  }

  const cancelEdit = () => {
    setEditingSlide(null)
    setEditTitle("")
    setEditContent("")
  }

  const addSlide = () => {
    const newSlide: SlideOutline = {
      id: `slide-${Date.now()}`,
      title: "New Slide",
      content: ["Main point", "Supporting details"],
    }
    onChange([...outlines, newSlide])
  }

  const deleteSlide = (slideId: string) => {
    onChange(outlines.filter((slide) => slide.id !== slideId))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FileText className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Review Your Slides
        </h2>
      </div>

      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
          {outlines.length} slides
        </Badge>
        <Button
          onClick={addSlide}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 border-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slide</span>
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {outlines.map((slide, index) => (
          <Card
            key={slide.id}
            className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border-2">
                    {index + 1}
                  </Badge>
                  {editingSlide === slide.id ? (
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="font-semibold border-2 rounded-lg"
                      placeholder="Slide title"
                    />
                  ) : (
                    <CardTitle className="text-lg">{slide.title}</CardTitle>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {editingSlide === slide.id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={saveEdit}
                        className="h-9 w-9 p-0 bg-green-500 hover:bg-green-600 rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="h-9 w-9 p-0 border-2 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(slide)}
                        className="h-9 w-9 p-0 border-2 hover:border-blue-400 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSlide(slide.id)}
                        className="h-9 w-9 p-0 border-2 text-red-600 hover:text-red-700 hover:border-red-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingSlide === slide.id ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="One point per line"
                  className="min-h-[80px] border-2 rounded-lg"
                />
              ) : (
                <ul className="space-y-2">
                  {slide.content.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start space-x-3">
                      <span className="text-blue-500 mt-1 text-lg">•</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
