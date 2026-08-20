import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiSearch, FiFilter, FiCheckCircle, FiX, FiMapPin, FiInstagram, FiYoutube, FiVideo, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/common/Skeleton"
import apiClient from "@/lib/apiClient"

export function Discovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [minFollowers, setMinFollowers] = useState<number>(0)
  const [minEngagement, setMinEngagement] = useState<number>(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null)
  
  const [influencers, setInfluencers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 12

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const categories = ["All", "Fashion", "Tech", "Fitness", "Beauty", "Food", "Travel", "Lifestyle", "Gaming"]

  useEffect(() => {
    setPage(1)
  }, [searchQuery, selectedCategory, minFollowers, minEngagement, verifiedOnly])

  useEffect(() => {
    const fetchInfluencers = async () => {
      setIsLoading(true)
      try {
        const params: any = { page, limit }
        if (searchQuery) params.search = searchQuery
        if (selectedCategory !== "All") params.category = selectedCategory
        if (minFollowers > 0) params.min_followers = minFollowers
        if (minEngagement > 0) params.min_engagement = minEngagement
        if (verifiedOnly) params.verified_only = true

        const response = await apiClient.get('/influencers', { params })
        setInfluencers(response.data.items || [])
        setTotal(response.data.total || 0)
      } catch (error) {
        console.error("Failed to fetch influencers", error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchInfluencers()
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedCategory, minFollowers, minEngagement, verifiedOnly, page])

  const formatNumber = (num: number) => {
    if (!num) return "0"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
  }

  const totalPages = Math.ceil(total / limit) || 1

  const fetchProfileDetails = async (id: number) => {
    try {
      const response = await apiClient.get(`/influencers/${id}`)
      setSelectedInfluencer(response.data)
    } catch (error) {
      console.error("Failed to fetch profile details", error)
    }
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 flex justify-between">
          <span>Min. Followers</span>
          <span className="text-muted-foreground text-sm font-normal">{formatNumber(minFollowers)}</span>
        </h3>
        <input
          type="range"
          min="0"
          max="5000000"
          step="100000"
          value={minFollowers}
          onChange={(e) => setMinFollowers(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>5M+</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 flex justify-between">
          <span>Min. Engagement Rate</span>
          <span className="text-muted-foreground text-sm font-normal">{minEngagement}%</span>
        </h3>
        <input
          type="range"
          min="0"
          max="15"
          step="0.5"
          value={minEngagement}
          onChange={(e) => setMinEngagement(Number(e.target.value))}
          className="w-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>15%</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Verification</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="verified"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary focus:ring-offset-2 accent-primary cursor-pointer"
          />
          <Label htmlFor="verified" className="cursor-pointer">Verified Influencers Only</Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSearchQuery("")
          setSelectedCategory("All")
          setMinFollowers(0)
          setMinEngagement(0)
          setVerifiedOnly(false)
        }}
      >
        Reset Filters
      </Button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover Influencers</h1>
        <p className="text-muted-foreground mt-1">
          Find the perfect creator for your next campaign.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, handle, or niche..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="lg:hidden h-11 px-3"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FiFilter className="h-5 w-5" />
            </Button>
          </div>

          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <Card className="p-4 bg-card border-dashed">
                  <FilterSidebar />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              {isLoading ? "Searching..." : `${total} Creators Found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex p-4 rounded-xl border bg-card gap-4">
                  <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2 pt-2 border-t">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : influencers.length === 0 ? (
            <EmptyState
              icon={<FiSearch className="h-8 w-8" />}
              title="No creators found"
              description="Try adjusting your filters or search query to find more results."
              actionText="Reset Filters"
              onAction={() => {
                setSearchQuery("")
                setSelectedCategory("All")
                setMinFollowers(0)
                setMinEngagement(0)
                setVerifiedOnly(false)
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {influencers.map((inf, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={inf.id}
                  >
                    <Card className="h-full flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <img src={inf.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${inf.username}`} alt={inf.username} className="w-12 h-12 rounded-full border bg-background" />
                            <div>
                              <h3 className="font-semibold flex items-center gap-1">
                                {inf.username}
                                {inf.verification_status === "verified" && <FiCheckCircle className="h-4 w-4 text-blue-500" />}
                              </h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <FiMapPin className="h-3 w-3" /> {inf.location || "Global"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 pb-4">
                        <Badge variant="secondary" className="mb-3">{inf.category}</Badge>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-background p-2 rounded-lg text-center shadow-inner">
                            <p className="text-xs text-muted-foreground mb-0.5">Followers</p>
                            <p className="font-semibold">{formatNumber(inf.follower_count)}</p>
                          </div>
                          <div className="bg-background p-2 rounded-lg text-center shadow-inner">
                            <p className="text-xs text-muted-foreground mb-0.5">Engagement</p>
                            <p className="font-semibold">{inf.engagement_rate}%</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between px-1">
                          <span className="text-xs font-medium text-muted-foreground">Trust Score</span>
                          <Badge variant="outline" className={inf.trust_score >= 90 ? "text-green-600 border-green-200 bg-green-50" : "text-yellow-600 border-yellow-200 bg-yellow-50"}>
                            {inf.trust_score}/100
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant="default"
                          onClick={() => {
                            setSelectedInfluencer("loading")
                            fetchProfileDetails(inf.id)
                          }}
                        >
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedInfluencer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedInfluencer(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl z-50 border-l overflow-y-auto flex flex-col"
            >
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
                <h2 className="text-xl font-bold">Profile Preview</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedInfluencer(null)}>
                  <FiX className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 flex-1 space-y-8">
                {selectedInfluencer === "loading" ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="w-24 h-24 rounded-full" />
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-20 w-full rounded-xl" />
                      <Skeleton className="h-20 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <img src={selectedInfluencer.user?.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedInfluencer.username}`} alt={selectedInfluencer.username} className="w-24 h-24 rounded-full border-4 border-muted object-cover" />
                      <div>
                        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                          {selectedInfluencer.username}
                          {selectedInfluencer.verification_status === "verified" && <FiCheckCircle className="h-5 w-5 text-blue-500" />}
                        </h3>
                        <Badge variant="secondary" className="mt-2">{selectedInfluencer.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        {selectedInfluencer.bio || "No bio provided."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border p-4 rounded-xl text-center shadow-sm">
                        <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Followers</p>
                        <p className="text-xl font-bold">{formatNumber(selectedInfluencer.follower_count)}</p>
                      </div>
                      <div className="border p-4 rounded-xl text-center shadow-sm">
                        <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Engagement</p>
                        <p className="text-xl font-bold text-primary">{selectedInfluencer.engagement_rate}%</p>
                      </div>
                    </div>

                    {selectedInfluencer.platforms && Object.keys(selectedInfluencer.platforms).length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Platforms</h4>
                        <div className="space-y-2">
                          {Object.entries(selectedInfluencer.platforms).map(([platform, data]: [string, any]) => {
                            if (!data) return null;
                            return (
                              <div key={platform} className="flex items-center justify-between p-3 border rounded-lg bg-background shadow-sm">
                                <div className="flex items-center gap-3">
                                  {platform.toLowerCase() === 'instagram' ? <FiInstagram className="h-5 w-5 text-pink-500" /> :
                                    platform.toLowerCase() === 'youtube' ? <FiYoutube className="h-5 w-5 text-red-500" /> :
                                      <FiVideo className="h-5 w-5 text-purple-500" />}
                                  <div>
                                    <p className="font-medium capitalize text-sm">{platform}</p>
                                    <p className="text-xs text-muted-foreground">{data.handle || data.username || platform}</p>
                                  </div>
                                </div>
                                <span className="font-semibold text-sm">{formatNumber(data.followers || data.subscriberCount || 0)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="p-6 border-t mt-auto bg-background sticky bottom-0">
                <Button 
                  className="w-full h-12 text-base font-semibold" 
                  disabled={selectedInfluencer === "loading"}
                  asChild={selectedInfluencer !== "loading"}
                >
                  {selectedInfluencer === "loading" ? (
                    "Loading..."
                  ) : (
                    <Link to={`/profile/${selectedInfluencer.id}`}>
                      View Full Profile
                    </Link>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
