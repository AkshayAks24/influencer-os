import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FiLoader, FiUploadCloud, FiCreditCard, FiDollarSign } from "react-icons/fi"

const SaveButton = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setShowSuccess(false)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 800)
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving && <FiLoader className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
      {showSuccess && <span className="text-sm text-green-500 font-medium">Settings saved successfully!</span>}
    </div>
  )
}

export function Settings() {
  const { currentUser } = useAuth()
  
  if (!currentUser) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:inline-grid sm:grid-cols-4 h-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update how you appear on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Avatar</Label>
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full border-2 bg-muted overflow-hidden">
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                  </div>
                  <Button variant="outline" type="button">
                    <FiUploadCloud className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name / Brand Name</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>
                {currentUser.role === "influencer" && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Primary Niche</Label>
                    <Input id="category" defaultValue="Fashion & Lifestyle" />
                  </div>
                )}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Passionate about creating authentic content."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SaveButton />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACCOUNT TAB */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Manage your sign-in credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={currentUser.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SaveButton />
            </CardFooter>
          </Card>

          <Card className="border-destructive/50 border">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Permanently delete your account and all data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive daily digests and critical alerts via email.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive real-time push alerts in your browser.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Campaign Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a campaign changes status.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Direct Messages</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone sends you a message.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SaveButton />
            </CardFooter>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentUser.role === "brand" ? "Plan & Billing" : "Earnings & Payouts"}</CardTitle>
              <CardDescription>
                {currentUser.role === "brand" 
                  ? "Manage your subscription and payment methods." 
                  : "Manage how you get paid for your campaigns."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {currentUser.role === "brand" ? (
                <>
                  <div className="p-4 border rounded-lg bg-primary/5 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-lg">Pro Plan</h4>
                      <p className="text-sm text-muted-foreground">$299/month • Renews Oct 1, 2024</p>
                    </div>
                    <Button asChild>
                      <Link to="/pricing">Upgrade Plan</Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base">Payment Method</Label>
                    <div className="flex items-center gap-4 p-4 border rounded-lg max-w-sm">
                      <FiCreditCard className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update Payment Method</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <FiDollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">Pending Payout</span>
                      </div>
                      <p className="text-3xl font-bold">$1,850.00</p>
                      <p className="text-xs text-muted-foreground mt-1">Scheduled for next Friday</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <FiDollarSign className="h-4 w-4" />
                        <span className="text-sm font-medium">Lifetime Earnings</span>
                      </div>
                      <p className="text-3xl font-bold">$14,200.00</p>
                      <p className="text-xs text-muted-foreground mt-1">Across 8 campaigns</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-base">Payout Method</Label>
                    <div className="flex items-center justify-between p-4 border rounded-lg max-w-sm">
                      <div>
                        <p className="font-medium">Chase Bank •••• 9012</p>
                        <p className="text-xs text-muted-foreground">Checking account</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                    </div>
                    <Button variant="outline" size="sm">Change Bank Account</Button>
                  </div>
                </>
              )}

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <SaveButton />
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
