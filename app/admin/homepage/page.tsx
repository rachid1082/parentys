"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"

interface HomepageConfig {
  hero_title: string
  hero_subtitle: string
  hero_tagline: string
  hero_banner_url: string
  experts_teaser_title: string
  experts_teaser_subtitle: string
  experts_teaser_cta: string
  workshops_teaser_title: string
  workshops_teaser_subtitle: string
  workshops_teaser_cta: string
  values: Array<{ title: string; description: string; icon_url: string }>
  mission_title: string
  mission_description: string
  mission_image_url: string
  footer_text: string
}

const defaultConfig: HomepageConfig = {
  hero_title: "",
  hero_subtitle: "",
  hero_tagline: "",
  hero_banner_url: "",
  experts_teaser_title: "",
  experts_teaser_subtitle: "",
  experts_teaser_cta: "",
  workshops_teaser_title: "",
  workshops_teaser_subtitle: "",
  workshops_teaser_cta: "",
  values: [
    { title: "", description: "", icon_url: "" },
    { title: "", description: "", icon_url: "" },
    { title: "", description: "", icon_url: "" },
    { title: "", description: "", icon_url: "" },
    { title: "", description: "", icon_url: "" },
  ],
  mission_title: "",
  mission_description: "",
  mission_image_url: "",
  footer_text: "",
}

export default function HomepageContentPage() {
  const [config, setConfig] = useState<HomepageConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase.from("app_config").select("config_value").eq("config_key", "homepage").single()

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
        config_key: "homepage",
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

  const updateValue = (index: number, field: string, value: string) => {
    const newValues = [...config.values]
    newValues[index] = { ...newValues[index], [field]: value }
    setConfig({ ...config, values: newValues })
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
            <h1 className="font-display text-3xl font-semibold text-[#333333]">Homepage Content</h1>
            <p className="text-muted-foreground mt-1">Manage homepage text and images</p>
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

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList>
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="teasers">Teasers</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={config.hero_title}
                    onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                    placeholder="Welcome to Parentys"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Textarea
                    value={config.hero_subtitle}
                    onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                    placeholder="Supporting parents through expert guidance..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input
                    value={config.hero_tagline}
                    onChange={(e) => setConfig({ ...config, hero_tagline: e.target.value })}
                    placeholder="Because every parent deserves support"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Banner Image URL</Label>
                  <Input
                    value={config.hero_banner_url}
                    onChange={(e) => setConfig({ ...config, hero_banner_url: e.target.value })}
                    placeholder="https://..."
                  />
                  {config.hero_banner_url && (
                    <img
                      src={config.hero_banner_url || "/placeholder.svg"}
                      alt="Banner preview"
                      className="mt-2 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teasers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Experts Teaser</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={config.experts_teaser_title}
                      onChange={(e) => setConfig({ ...config, experts_teaser_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      value={config.experts_teaser_subtitle}
                      onChange={(e) => setConfig({ ...config, experts_teaser_subtitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={config.experts_teaser_cta}
                      onChange={(e) => setConfig({ ...config, experts_teaser_cta: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workshops Teaser</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={config.workshops_teaser_title}
                      onChange={(e) => setConfig({ ...config, workshops_teaser_title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      value={config.workshops_teaser_subtitle}
                      onChange={(e) => setConfig({ ...config, workshops_teaser_subtitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={config.workshops_teaser_cta}
                      onChange={(e) => setConfig({ ...config, workshops_teaser_cta: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="values">
            <Card>
              <CardHeader>
                <CardTitle>Brand Values (5 Values)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {config.values.map((value, index) => (
                  <div key={index} className="p-4 border border-[#C9CEC0] rounded-lg space-y-4">
                    <h4 className="font-medium">Value {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, "title", e.target.value)}
                          placeholder="e.g., Empathy"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon URL</Label>
                        <Input
                          value={value.icon_url}
                          onChange={(e) => updateValue(index, "icon_url", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, "description", e.target.value)}
                        placeholder="Description of this value..."
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mission">
            <Card>
              <CardHeader>
                <CardTitle>Mission Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={config.mission_title}
                    onChange={(e) => setConfig({ ...config, mission_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={config.mission_description}
                    onChange={(e) => setConfig({ ...config, mission_description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={config.mission_image_url}
                    onChange={(e) => setConfig({ ...config, mission_image_url: e.target.value })}
                  />
                  {config.mission_image_url && (
                    <img
                      src={config.mission_image_url || "/placeholder.svg"}
                      alt="Mission preview"
                      className="mt-2 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Footer Text</Label>
                  <Textarea
                    value={config.footer_text}
                    onChange={(e) => setConfig({ ...config, footer_text: e.target.value })}
                    placeholder="Copyright text or additional footer information..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
