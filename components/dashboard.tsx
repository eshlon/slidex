"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Presentation, Plus, CreditCard, Search, MoreHorizontal, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PaymentModal from "./payment-modal"
import { Input } from "@/components/ui/input"
import Navbar from "./navbar"

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    credits: number;
    avatar_url?: string;
  };
}

interface PresentationData {
  id: number;
  title: string;
  created_at: string;
  slide_count: number;
  template: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [presentations, setPresentations] = useState<PresentationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const response = await fetch("/api/presentations/history");
        if (!response.ok) {
          throw new Error("Failed to fetch presentation history");
        }
        const data = await response.json();
        setPresentations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  const handleOpenPresentation = (id: number) => {
    router.push(`/results?id=${id}`);
  };

  const filteredPresentations = presentations.filter((presentation) =>
    presentation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Hello {user.name.split(" ")[0]}</h1>
              <p className="text-gray-600 mt-1">Manage your presentations and create new ones</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Credits</span>
              </Button>

              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-sm"
              >
                <Link href="/create" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Presentation</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
              />
            </div>
          </div>

          {/* Presentations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Presentations</h2>
              <span className="text-sm text-gray-500">
                {filteredPresentations.length} presentation{filteredPresentations.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredPresentations.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Presentation className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? "No presentations found" : "No presentations yet"}
                  </h3>
                  <p className="text-gray-500 text-center mb-6 max-w-sm">
                    {searchQuery
                      ? "Try adjusting your search terms or create a new presentation."
                      : "Get started by creating your first presentation with AI assistance."}
                  </p>
                  {!searchQuery && (
                    <Button
                      asChild
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      <Link href="/create" className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Create Your First Presentation</span>
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredPresentations.map((presentation) => (
                  <Card
                    key={presentation.id}
                    className="hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Presentation className="w-6 h-6 text-purple-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{presentation.title}</h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <span>{presentation.slide_count} slides</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  Created{" "}
                                  {new Date(
                                    presentation.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                <span>{presentation.template}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => handleOpenPresentation(presentation.id)}
                          >
                            Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Section */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Need more credits?</h3>
                  <p className="text-sm text-gray-600">
                    Each presentation costs 1 credit. Purchase more to keep creating.
                  </p>
                </div>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-shrink-0"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase Credits
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        currentCredits={user.credits}
        userId={user.id}
      />
    </div>
  )
}
