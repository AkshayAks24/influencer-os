import { useParams, useNavigate } from "react-router-dom"
import { FiCheckCircle, FiMapPin, FiInstagram, FiYoutube, FiVideo, FiStar, FiActivity, FiUsers, FiMessageCircle, FiArrowLeft, FiImage } from "react-icons/fi"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"

import influencersData from "@/data/influencers.json"
import type { Influencer } from "@/types"

// Generate some mock analytics data for the charts
const analyticsData = [
  { month: 'Jan', followers: 120, engagement: 4.2 },
  { month: 'Feb', followers: 135, engagement: 4.5 },
  { month: 'Mar', followers: 155, engagement: 4.8 },
  { month: 'Apr', followers: 180, engagement: 4.6 },
  { month: 'May', followers: 210, engagement: 5.1 },
  { month: 'Jun', followers: 250, engagement: 5.4 },
]

export function InfluencerProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const influencer = (influencersData as unknown as Influencer[]).find(inf => inf.id === id)

  if (!influencer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <EmptyState 
          icon={<FiUsers className="h-10 w-10" />}
          title="Influencer Not Found"
          description="We couldn't find the profile you were looking for."
          actionText="Back to Discovery"
          onAction={() => navigate('/discovery')}
        />
      </div>
    )
  }

  const getTotalFollowers = (inf: Influencer): number => {
    return Object.values(inf.platforms).reduce((acc: number, platform) => acc + (platform?.followers ?? 0), 0)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
  }

  // Radial chart data for trust score breakdown
  const trustScoreData = [
    { name: 'Reliability', value: 92, fill: '#8884d8' },
    { name: 'Content Quality', value: 88, fill: '#83a6ed' },
    { name: 'Communication', value: 95, fill: '#8dd1e1' },
    { name: 'Authenticity', value: influencer.trustScore, fill: '#82ca9d' }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Back Button */}
      <Button variant="ghost" className="mb-2 -ml-4" onClick={() => navigate(-1)}>
        <FiArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      {/* 1. Header Area (Cover, Avatar, Basic Info, CTAs) */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {/* Cover Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-primary/80 to-purple-500 relative">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        </div>
        
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-6">
            <img 
              src={influencer.avatar} 
              alt={influencer.name} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-card bg-muted shadow-md object-cover z-10" 
            />
            
            <div className="flex-1 space-y-1 z-10 sm:mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold">{influencer.name}</h1>
                {influencer.verified && <FiCheckCircle className="h-6 w-6 text-blue-500" />}
                <Badge variant="secondary" className="ml-2 text-sm">{influencer.category}</Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <FiMapPin className="h-4 w-4" /> {influencer.location || "Global"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 z-10">
              <div className="text-center mr-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase">Trust Score</p>
                <Badge className={influencer.trustScore >= 90 ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}>
                  <FiStar className="mr-1 h-3 w-3" /> {influencer.trustScore}/100
                </Badge>
              </div>
              <Button size="lg" className="flex-1 sm:flex-none">
                Invite to Campaign
              </Button>
            </div>
          </div>
          
          <p className="max-w-3xl text-lg text-foreground/90">{influencer.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Stats, Platforms, Analytics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FiUsers className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Total Reach</p>
                <p className="text-2xl font-bold">{formatNumber(getTotalFollowers(influencer))}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FiActivity className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Avg Engagement</p>
                <p className="text-2xl font-bold text-primary">{influencer.engagementRate}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FiMessageCircle className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Est. Impressions</p>
                <p className="text-2xl font-bold">{formatNumber(getTotalFollowers(influencer) * 0.4)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Growth & Engagement</CardTitle>
              <CardDescription>Follower growth vs engagement rate over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dx={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="followers" name="Followers (k)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="engagement" name="Engagement (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio & Recent Content</CardTitle>
              <CardDescription>A showcase of their best performing organic content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-xl flex items-center justify-center border hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden">
                    <FiImage className="h-8 w-8 text-muted-foreground/50 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-foreground font-medium">
                      View Post
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Collaborations */}
          <Card>
            <CardHeader>
              <CardTitle>Past Collaborations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencer.pastCollaborations && influencer.pastCollaborations.length > 0 ? (
                  influencer.pastCollaborations.map((collab, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-primary/10 transition-colors">
                      <div>
                        <h4 className="font-semibold text-lg">{collab.brandName}</h4>
                        <p className="text-sm text-muted-foreground">{collab.campaignName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1 bg-primary/5 text-primary border-primary/20">
                          {collab.roi}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{formatNumber(collab.impressions)} impressions</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={<FiMessageCircle className="h-6 w-6" />}
                    title="No collaborations"
                    description="No past collaborations listed."
                    className="min-h-[150px] border-none shadow-none bg-transparent"
                  />
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Socials, Trust Score, Reviews */}
        <div className="space-y-6">
          
          {/* Social Platforms */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(influencer.platforms).map(([platform, data]) => {
                if (!data) return null;
                return (
                  <div key={platform} className="flex items-center justify-between p-3 border rounded-xl hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      {platform === 'instagram' ? <div className="p-2 bg-pink-100 rounded-lg"><FiInstagram className="h-5 w-5 text-pink-600" /></div> :
                        platform === 'youtube' ? <div className="p-2 bg-red-100 rounded-lg"><FiYoutube className="h-5 w-5 text-red-600" /></div> :
                        <div className="p-2 bg-purple-100 rounded-lg"><FiVideo className="h-5 w-5 text-purple-600" /></div>}
                      <div>
                        <p className="font-semibold capitalize">{platform}</p>
                        <p className="text-xs text-muted-foreground">{data.handle}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatNumber(data.followers)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Followers</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Trust Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Trust Score Breakdown</CardTitle>
              <CardDescription>AI-generated reliability metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="h-[220px] w-full flex justify-center items-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="40%" 
                    outerRadius="100%" 
                    barSize={12} 
                    data={trustScoreData}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-primary">{influencer.trustScore}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Score</span>
                </div>
              </div>
              <div className="w-full space-y-2 mt-4">
                {trustScoreData.map(item => (
                  <div key={item.name} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                      {item.name}
                    </span>
                    <span className="font-medium">{item.value}/100</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencer.reviews && influencer.reviews.length > 0 ? (
                  influencer.reviews.map((review, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-muted/20">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-sm">{review.brandName}</h5>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, j) => (
                            <FiStar key={j} className={`h-3 w-3 ${j < review.rating ? "fill-current" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 italic">"{review.comment}"</p>
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    icon={<FiStar className="h-6 w-6" />}
                    title="No reviews"
                    description="No reviews yet."
                    className="min-h-[150px] border-none shadow-none bg-transparent"
                  />
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
