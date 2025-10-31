"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import BasicInfoStep from "./steps/basic-info-step"
import OutlineStep from "./steps/outline-step"
import TemplateStep from "./steps/template-step"

interface SlideOutline {
  id: string
  title: string
  content: string[]
}

interface FormData {
  prompt: string
  slideCount: number
  language: string
  outlines: SlideOutline[]
  template: string
}

const steps = [
  { id: 1, title: "Basic Info", description: "Topic & settings" },
  { id: 2, title: "Outlines", description: "Review content" },
  { id: 3, title: "Template", description: "Choose & create" },
]

export default function SlideCreationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    slideCount: 5,
    language: "english",
    outlines: [],
    template: "",
  })

  const updateFormData = (field: string, value: string | number | SlideOutline[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateOutlines = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/presentations/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formData.prompt,
          slideCount: formData.slideCount,
          language: formData.language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate outline')
      }

      if (data.success && data.outlines) {
        updateFormData("outlines", data.outlines)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating outline:', error)
      // Fallback to dummy outlines in case of error
      const outlines: SlideOutline[] = []
      for (let i = 1; i <= formData.slideCount; i++) {
        outlines.push({
          id: `slide-${i}`,
          title: i === 1 ? "Introduction" : i === formData.slideCount ? "Conclusion" : `Topic ${i - 1}`,
          content: ["Main point or concept", "Supporting details", "Key takeaways"],
        })
      }
      updateFormData("outlines", outlines)
    } finally {
      setIsGenerating(false)
    }
  }

  const nextStep = async () => {
    if (currentStep === 1) {
      await generateOutlines()
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.prompt.trim().length > 0 && formData.slideCount > 0 && formData.language !== ""
      case 2:
        return formData.outlines.length > 0
      case 3:
        return formData.template !== ""
      default:
        return false
    }
  }

  const handleCreatePresentation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/presentations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.prompt.substring(0, 50) + "...",
          prompt: formData.prompt,
          slideCount: formData.slideCount,
          template: formData.template,
          content: formData.outlines,
          pythonApi: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create presentation record");
      }

      sessionStorage.setItem(
        "presentationData",
        JSON.stringify({
          ...formData,
          presentationId: data.presentation.id,
          remainingCredits: data.remainingCredits,
          pythonApi: true,
        })
      );
      router.push(`/results?id=${data.presentation.id}`);
    } catch (error) {
      console.error("Error creating presentation:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Failed to create presentation: ${errorMessage}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200 bg-white">
      <CardHeader className="pb-6 pt-8 px-8">
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep > step.id
                        ? "bg-purple-500 border-purple-500 text-white"
                        : currentStep === step.id
                          ? "bg-purple-500 border-purple-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-500"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-6 transition-all duration-300 ${
                      currentStep > step.id ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <div className="min-h-[500px] mb-8">
          {currentStep === 1 && <BasicInfoStep formData={formData} updateFormData={updateFormData} />}
          {currentStep === 2 && (
            <OutlineStep outlines={formData.outlines} onChange={(outlines) => updateFormData("outlines", outlines)} />
          )}
          {currentStep === 3 && (
            <TemplateStep
              value={formData.template}
              onChange={(value) => updateFormData("template", value)}
              isGenerating={isGenerating}
              onCreatePresentation={handleCreatePresentation}
            />
          )}
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed() || isGenerating}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-700"
            >
              {isGenerating && currentStep === 1 ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCreatePresentation}
              disabled={!canProceed() || isGenerating}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Presentation</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
