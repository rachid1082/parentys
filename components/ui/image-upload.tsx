"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  bucket = "images",
  folder = "workshops",
  label = "Image",
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Upload via API route (uses service role to bypass RLS)
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", bucket)
      formData.append("folder", folder)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      onChange(result.url)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            uploading
              ? "bg-muted border-muted-foreground/20 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground mb-1">Click to upload an image</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
            </>
          )}
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Fallback: manual URL input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Or paste URL:</span>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 text-sm h-8"
        />
      </div>
    </div>
  )
}
