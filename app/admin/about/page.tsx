"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"

interface AboutConfig {
  page_title: string
  philosophy_text: string
  mission_text: string
  values_descriptions: string[]
  story_image_1_url: string
  story_image_2_url: string
  accent_text: string
}

const defaultConfig: AboutConfig = {
  page_title: "",
  philosophy_text: "",
  mission_text: "",
  values_descriptions: ["", "", "", "", ""],
  story_image_1_url: "",
  story_image_2_url: "",
  accent_text: "",
}

export default function AboutContentPage() {
  const [config, setConfig] = useState<AboutConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("app_config").select("config_value").eq("config_key", "about_page").single()

      if (data?.config_value) {
        setConfig({ ...defaultConfig, ...data.config_value })
      }
      setLoading(false)
    }

    fetchConfig()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")

    const { error } = await supabase.from("app_config").upsert(
      {
        config_key: "about_page",
        config_value: config,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "config_key" },
    )

    if (error) {
      setMessage("Error saving configuration")
    } else {
      setMessage("Configuration saved successfully")
    }
    setSaving(false)
  }

  const updateValueDescription = (index: number, value: string) => {
    const newDescriptions = [...config.values_descriptions]
    newDescriptions[index] = value
    setConfig({ ...config, values_descriptions: newDescriptions })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#878D73]" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#333333]">About Page Content</h1>
            <p className="text-muted-foreground mt-1">Manage About page text and images</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={config.page_title}
                  onChange={(e) => setConfig({ ...config, page_title: e.target.value })}
                  placeholder="About Parentys"
                />
              </div>
              <div className="space-y-2">
                <Label>Accent Text (Emotional Quote)</Label>
                <Textarea
                  value={config.accent_text}
                  onChange={(e) => setConfig({ ...config, accent_text: e.target.value })}
                  placeholder="A heartfelt quote or tagline..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Story Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Story Image 1 URL</Label>
                <Input
                  value={config.story_image_1_url}
                  onChange={(e) => setConfig({ ...config, story_image_1_url: e.target.value })}
                />
                {config.story_image_1_url && (
                  <img
                    src={config.story_image_1_url || "/placeholder.svg"}
                    alt="Story 1"
                    className="mt-2 h-24 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>Story Image 2 URL</Label>
                <Input
                  value={config.story_image_2_url}
                  onChange={(e) => setConfig({ ...config, story_image_2_url: e.target.value })}
                />
                {config.story_image_2_url && (
                  <img
                    src={config.story_image_2_url || "/placeholder.svg"}
                    alt="Story 2"
                    className="mt-2 h-24 object-cover rounded-lg"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Philosophy & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Philosophy Text</Label>
              <Textarea
                value={config.philosophy_text}
                onChange={(e) => setConfig({ ...config, philosophy_text: e.target.value })}
                rows={4}
                placeholder="Our philosophy on parenting support..."
              />
            </div>
            <div className="space-y-2">
              <Label>Mission Text</Label>
              <Textarea
                value={config.mission_text}
                onChange={(e) => setConfig({ ...config, mission_text: e.target.value })}
                rows={4}
                placeholder="Our mission statement..."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Values Descriptions (5 Values)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.values_descriptions.map((desc, index) => (
              <div key={index} className="space-y-2">
                <Label>Value {index + 1} Description</Label>
                <Textarea
                  value={desc}
                  onChange={(e) => updateValueDescription(index, e.target.value)}
                  placeholder={`Description for value ${index + 1}...`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
