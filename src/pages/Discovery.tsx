import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { FiSearch, FiFilter, FiCheckCircle, FiX, FiMapPin, FiInstagram, FiYoutube, FiVideo } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { EmptyState } from "@/components/common/EmptyState"

import influencersData from "@/data/influencers.json"
import type { Influencer } from "@/types"

export function Discovery() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [minFollowers, setMinFollowers] = useState<number>(0)
  const [minEngagement, setMinEngagement] = useState<number>(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null)

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Get unique categories
  const categories = ["All", ...Array.from(new Set(influencersData.map(inf => inf.category)))]

  // Calculate total followers for an influencer
  const getTotalFollowers = (inf: Influencer): number => {
    return Object.values(inf.platforms).reduce((acc: number, platform) => acc + (platform?.followers ?? 0), 0)
  }

  // Format numbers (e.g., 1.5M, 450k)
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
  }

  // Filter logic
  const filteredInfluencers = useMemo(() => {
    return (influencersData as unknown as Influencer[]).filter(inf => {
      const matchSearch = inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = selectedCategory === "All" || inf.category === selectedCategory

      const matchFollowers = getTotalFollowers(inf) >= minFollowers

      const matchEngagement = inf.engagementRate >= minEngagement

      const matchVerified = !verifiedOnly || inf.verified

      return matchSearch && matchCategory && matchFollowers && matchEngagement && matchVerified
    })
  }, [searchQuery, selectedCategory, minFollowers, minEngagement, verifiedOnly])

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

      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Discover Influencers</h1>
        <p className="text-muted-foreground mt-1">
          Find the perfect creator for your next campaign.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">

          {/* Search Bar & Mobile Filter Toggle */}
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

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <Card className="p-4 bg-muted/30 border-dashed">
                  <FilterSidebar />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div>
            <div className="mb-4 text-sm text-muted-foreground font-medium">
              Showing {filteredInfluencers.length} influencers
            </div>

            {filteredInfluencers.length === 0 ? (
              <EmptyState
                icon={<FiFilter className="h-8 w-8" />}
                title="No influencers found"
                description="Try adjusting your filters or search query to find more matches."
                actionText="Clear Filters"
                onAction={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setMinFollowers(0)
                  setMinEngagement(0)
                  setVerifiedOnly(false)
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredInfluencers.map((inf, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={inf.id}
                  >
                    <Card className="h-full flex flex-col hover:border-primary/40 hover:shadow-md transition-all">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3">
                            <img src={inf.avatar} alt={inf.name} className="w-12 h-12 rounded-full border bg-muted" />
                            <div>
                              <h3 className="font-semibold flex items-center gap-1">
                                {inf.name}
                                {inf.verified && <FiCheckCircle className="h-4 w-4 text-blue-500" />}
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
                          <div className="bg-muted/50 p-2 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-0.5">Followers</p>
                            <p className="font-semibold">{formatNumber(getTotalFollowers(inf))}</p>
                          </div>
                          <div className="bg-muted/50 p-2 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-0.5">Engagement</p>
                            <p className="font-semibold">{inf.engagementRate}%</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between px-1">
                          <span className="text-xs font-medium text-muted-foreground">Trust Score</span>
                          <Badge variant="outline" className={inf.trustScore >= 90 ? "text-green-600 border-green-200 bg-green-50" : "text-yellow-600 border-yellow-200 bg-yellow-50"}>
                            {inf.trustScore}/100
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant="default"
                          onClick={() => setSelectedInfluencer(inf)}
                        >
                          View Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Preview Slide-over Modal */}
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
                <div className="flex flex-col items-center text-center space-y-4">
                  <img src={selectedInfluencer.avatar} alt={selectedInfluencer.name} className="w-24 h-24 rounded-full border-4 border-muted" />
                  <div>
                    <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                      {selectedInfluencer.name}
                      {selectedInfluencer.verified && <FiCheckCircle className="h-5 w-5 text-blue-500" />}
                    </h3>
                    <Badge variant="secondary" className="mt-2">{selectedInfluencer.category}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    {selectedInfluencer.bio || "No bio provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border p-4 rounded-xl text-center">
                    <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Followers</p>
                    <p className="text-xl font-bold">{formatNumber(getTotalFollowers(selectedInfluencer))}</p>
                  </div>
                  <div className="border p-4 rounded-xl text-center">
                    <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider font-semibold">Engagement</p>
                    <p className="text-xl font-bold text-primary">{selectedInfluencer.engagementRate}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Platforms</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedInfluencer.platforms).map(([platform, data]) => {
                      if (!data) return null;
                      return (
                      <div key={platform} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          {platform === 'instagram' ? <FiInstagram className="h-5 w-5 text-pink-500" /> :
                            platform === 'youtube' ? <FiYoutube className="h-5 w-5 text-red-500" /> :
                              <FiVideo className="h-5 w-5 text-purple-500" />}
                          <div>
                            <p className="font-medium capitalize text-sm">{platform}</p>
                            <p className="text-xs text-muted-foreground">{data.handle}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">{formatNumber(data.followers)}</span>
                      </div>
                    )})}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t mt-auto bg-muted/10 sticky bottom-0">
                <Button className="w-full h-12 text-base font-semibold" asChild>
                  <Link to={`/profile/${selectedInfluencer.id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
