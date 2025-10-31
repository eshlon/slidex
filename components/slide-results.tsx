"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  ArrowLeft,
  Download,
  FileText,
  Presentation,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sliders
} from "lucide-react"
import PaymentModal from "./payment-modal"
import Navbar from "./navbar";

interface SlideData {
  id: string
  title: string
  content: string[]
  template: string
}

interface Outline {
  id: string;
  title: string;
  content: string[];
}

interface PresentationData {
  prompt: string;
  slideCount: number;
  language: string;
  template: string;
  outlines: Outline[];
  presentationId?: string;
  slides?: SlideData[];
  fileName?: string;
  remainingCredits?: number;
  pythonApi?: boolean;
  downloaded?: boolean;
  file_url?: string;
  pdf_file_url?: string;
}

interface SlideResultsProps {
  user: {
    id: string
    name: string
    email: string
    credits: number
    avatar_url?: string
  }
}

const templateStyles = {
  "modern-minimal": {
    bg: "bg-gradient-to-br from-gray-50 to-white",
    accent: "text-purple-600",
    border: "border-gray-200",
    bullet: "bg-purple-500",
  },
  "vibrant-creative": {
    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
    accent: "text-purple-600",
    border: "border-purple-200",
    bullet: "bg-purple-500",
  },
  "corporate-blue": {
    bg: "bg-gradient-to-br from-purple-900 to-indigo-800 text-white",
    accent: "text-purple-300",
    border: "border-purple-700",
    bullet: "bg-purple-300",
  },
  "nature-green": {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    accent: "text-green-600",
    border: "border-green-200",
    bullet: "bg-green-500",
  },
  "tech-dark": {
    bg: "bg-gradient-to-br from-gray-900 to-black text-white",
    accent: "text-cyan-400",
    border: "border-gray-700",
    bullet: "bg-cyan-400",
  },
  "warm-orange": {
    bg: "bg-gradient-to-br from-orange-50 to-red-50",
    accent: "text-orange-600",
    border: "border-orange-200",
    bullet: "bg-orange-500",
  },
}

export default function SlideResults({ user }: SlideResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [presentationData, setPresentationData] =
    useState<PresentationData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([])
  const [selectedSlide, setSelectedSlide] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null)

  useEffect(() => {
    const presentationId = searchParams.get("id");

    const pollPresentationStatus = async (id: string) => {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/presentations/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch presentation data");
          }
          const data = await response.json();
          if (data.status === "completed" || data.status === "failed") {
            clearInterval(interval);
            const parsedData = {
              ...data,
              presentationId: data.id,
              outlines: JSON.parse(data.content),
              pythonApi: data.python_api,
            };
            setPresentationData(parsedData);
            setSlides(
              parsedData.outlines.map((outline: Outline) => ({
                id: outline.id,
                title: outline.title,
                content: outline.content,
                template: parsedData.template,
              }))
            );
          }
        } catch (error) {
          console.error(error);
          clearInterval(interval);
          router.push("/dashboard");
        }
      }, 3000);
    };

    if (presentationId) {
      pollPresentationStatus(presentationId);
    } else {
      const data = sessionStorage.getItem("presentationData");
      if (data) {
        const parsed = JSON.parse(data);
        setPresentationData(parsed);
        const slideData = parsed.outlines.map((outline: Outline) => ({
          id: outline.id,
          title: outline.title,
          content: outline.content,
          template: parsed.template,
        }));
        setSlides(slideData);
      } else {
        router.push("/");
      }
    }
  }, [router, searchParams]);

  const exportOptions = [
    {
      id: "pptx",
      name: "PowerPoint",
      icon: Presentation,
      description: "Editable PowerPoint file",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "pdf",
      name: "PDF",
      icon: FileText,
      description: "High-quality PDF document",
      color: "from-red-500 to-red-600",
    },
    {
      id: "googleslides",
      name: "Google Slides",
      icon: Sliders,
      description: "Slides document",
      color: "from-orange-500 to-yellow-600",
    },
  ]

  const handleExport = async (format: string) => {
    if (!presentationData) {
      alert("Presentation data not available.");
      return;
    }

    if (downloadingFormat) {
      return;
    }

    if (format === "googleslides") {
      alert("Google Slides export is coming soon!");
      return;
    }

    setDownloadingFormat(format);

    try {
      let url;
      if (format === "pdf") {
        if (presentationData.pdf_file_url) {
          url = presentationData.pdf_file_url;
        } else {
          const response = await fetch(
            `/api/presentations/${presentationData.presentationId}/generate-pdf`,
            {
              method: "POST",
            }
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to generate PDF");
          }
          url = data.pdf_url;
        }
      } else {
        url = presentationData.file_url;
      }

      if (!url) {
        throw new Error("File URL not found.");
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = `${presentationData.prompt || "presentation"}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const updatedData = { ...presentationData, downloaded: true };
      setPresentationData(updatedData);
      sessionStorage.setItem("presentationData", JSON.stringify(updatedData));
    } catch (error) {
      console.error(`Error downloading ${format.toUpperCase()}:`, error);
      alert(`Failed to download ${format.toUpperCase()}. Please try again.`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const nextSlide = () => {
    if (selectedSlide < slides.length - 1) {
      setSelectedSlide(selectedSlide + 1)
    }
  }

  const prevSlide = () => {
    if (selectedSlide > 0) {
      setSelectedSlide(selectedSlide - 1)
    }
  }

  const getTemplateStyle = (template: string) => {
    return templateStyles[template as keyof typeof templateStyles] || templateStyles["modern-minimal"]
  }

  if (!presentationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading your presentation...</h2>
          <p className="text-gray-600">This will just take a moment</p>
        </div>
      </div>
    )
  }

  const currentTemplateStyle = getTemplateStyle(presentationData.template)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      {/* Secondary Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-3">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900" size="sm">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Link>
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 hidden md:block">Your Presentation</h1>
            </div>

            <div className="flex items-center space-x-3">
              {/*<Button
                variant="outline"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center space-x-2 text-sm"
                size="sm"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Fullscreen</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 text-sm" size="sm">
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Present</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 text-sm" size="sm">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button variant="outline" asChild className="text-sm" size="sm">
                <Link href="/create" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New</span>
                </Link>
              </Button>*/}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Slides Preview (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Slide Preview */}
            <div className="relative">
              <div
                className={`${currentTemplateStyle.bg} rounded-2xl shadow-xl border-2 ${currentTemplateStyle.border} min-h-[500px] p-12 relative overflow-hidden`}
              >
                {/* Slide Content Preview */}
                <div className="space-y-8">
                  <h2 className={`text-4xl font-bold mb-8 ${currentTemplateStyle.accent}`}>
                    {slides[selectedSlide]?.title}
                  </h2>
                  <div className="space-y-6">
                    {slides[selectedSlide]?.content.map((point, index) => (
                      <div key={index} className="flex items-start space-x-4 group">
                        <div
                          className={`w-3 h-3 ${currentTemplateStyle.bullet} rounded-full mt-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200`}
                        />
                        <p className="text-xl leading-relaxed group-hover:text-gray-900 transition-colors duration-200">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slide Number */}
                <div className="absolute bottom-4 right-4 bg-black/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {selectedSlide + 1} / {slides.length}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  disabled={selectedSlide === 0}
                  className="rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm border-2 shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  disabled={selectedSlide === slides.length - 1}
                  className="rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm border-2 shadow-lg hover:bg-white transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Slide Thumbnails */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Slides</h3>
                <p className="text-sm text-gray-600">{slides.length} slides in your presentation</p>
              </div>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4">
                  {slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      onClick={() => setSelectedSlide(index)}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                        selectedSlide === index ? "transform scale-105" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div
                        className={`w-40 h-24 ${getTemplateStyle(slide.template).bg} rounded-lg shadow-md border-2 ${
                          selectedSlide === index ? "border-purple-500" : "border-gray-200"
                        } p-3 flex flex-col justify-between overflow-hidden`}
                      >
                        <div className="text-xs font-semibold truncate">{slide.title}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">{index + 1}</div>
                          <div className="flex space-x-1">
                            {[...Array(Math.min(3, slide.content.length))].map((_, i) => (
                              <div
                                key={i}
                                className={`w-6 h-0.5 ${getTemplateStyle(slide.template).bullet} opacity-${70 - i * 20}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Export Options (1/3 width) */}
          <div className="lg:col-span-1 ">
            <div className="sticky top-6">
              <Card className="shadow-lg border border-gray-200 rounded-2xl overflow-hidden p-0 ">
                <div className=" bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white rounded-t-2xl">
                  <div className="flex items-center space-x-3 mb-2 ">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Download className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Export</h2>
                      <p className="text-purple-100 text-sm">Download your presentation</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Success message if presentation was downloaded */}
                  {presentationData.downloaded && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Download className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Presentation Downloaded!</p>
                          <p className="text-xs text-green-600">Your PPTX file has been downloaded successfully.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {exportOptions.map((option) => {
                      const isDownloading = downloadingFormat === option.id
                      const isDisabled = option.id === 'googleslides' || downloadingFormat !== null
                      const isGoogleSlides = option.id === 'googleslides'
                      
                      return (
                        <div
                          key={option.id}
                          className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                            isDisabled 
                              ? 'border-gray-100 bg-gray-50' 
                              : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                          }`}
                        >
                          <button
                            onClick={() => handleExport(option.id)}
                            disabled={isDisabled}
                            className={`w-full p-4 text-left transition-all duration-300 ${
                              isDisabled 
                                ? 'cursor-not-allowed' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`p-3 rounded-xl text-white shadow-lg transition-transform duration-300 ${
                                  isDisabled
                                    ? 'bg-gray-400'
                                    : `bg-gradient-to-r ${option.color} ${!isDownloading ? 'group-hover:scale-110' : ''}`
                                }`}
                              >
                                {isDownloading ? (
                                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <option.icon className="w-6 h-6" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold text-base ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                                  {option.name}
                                  {option.id === 'pptx' && presentationData.downloaded && !isDisabled && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                      Downloaded
                                    </span>
                                  )}
                                  {isGoogleSlides && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                      Coming Soon
                                    </span>
                                  )}
                                  {isDownloading && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                      Generating...
                                    </span>
                                  )}
                                </div>
                                <div className={`text-sm mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {isDownloading 
                                    ? `Preparing your ${option.name} file...`
                                    : isGoogleSlides
                                    ? "Google Slides export will be available soon"
                                    : option.id === 'pptx' && presentationData.downloaded 
                                    ? "Download again or access your previous download"
                                    : option.description
                                  }
                                </div>
                              </div>
                              <div className={`transition-opacity duration-300 ${
                                isDisabled 
                                  ? 'opacity-30' 
                                  : 'opacity-0 group-hover:opacity-100'
                              }`}>
                                <ExternalLink className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">💡 Pro Tip</p>
                      <p className="text-xs text-gray-500">
                        {presentationData.downloaded 
                          ? "Your presentation was created using actual template files for the best quality!"
                          : "PowerPoint files are editable, while PDFs are perfect for sharing and printing."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        currentCredits={user.credits}
        userId={user.id}
      />
    </div>
  )
}
