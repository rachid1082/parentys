"use client"

import { BOLayout } from "@/components/bo/bo-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function BOArticlesPage() {
  return (
    <BOLayout>
      <ArticlesContent />
    </BOLayout>
  )
}

function ArticlesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-[#333333]">Articles</h1>
        <p className="text-muted-foreground mt-1">Manage articles and blog posts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-[#F5F1E6] mb-4">
              <FileText className="h-8 w-8 text-[#878D73]" />
            </div>
            <h3 className="text-lg font-medium text-[#333333] mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              The articles management feature is currently under development. 
              You will be able to create, edit, and publish articles here soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
