"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface Step {
  id: string
  question: string | null
  question_en: string | null
  question_fr: string | null
}

interface Answer {
  id: string
  step_id: string
  label: string | null
  label_en: string | null
  label_fr: string | null
  next_step_id: string | null
}

interface Rule {
  id: string
  age_answer_id: string | null
  issue_answer_id: string | null
  recommendation: string | null
  recommendation_en: string | null
}

export default function QuickPathPage() {
  const [steps, setSteps] = useState<Step[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const [stepsRes, answersRes, rulesRes] = await Promise.all([
        supabase.from("quickpath_steps").select("id, question, question_en, question_fr"),
        supabase.from("quickpath_answers").select("id, step_id, label, label_en, label_fr, next_step_id"),
        supabase
          .from("quickpath_recommendation_rules")
          .select("id, age_answer_id, issue_answer_id, recommendation, recommendation_en"),
      ])

      if (stepsRes.data) setSteps(stepsRes.data)
      if (answersRes.data) setAnswers(answersRes.data)
      if (rulesRes.data) setRules(rulesRes.data)

      setLoading(false)
    }

    fetchData()
  }, [supabase])

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
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#333333]">QuickPath</h1>
          <p className="text-muted-foreground mt-1">
            View decision tree steps, answers, and recommendation rules (read-only)
          </p>
        </div>

        <Tabs defaultValue="steps" className="space-y-6">
          <TabsList>
            <TabsTrigger value="steps">Steps ({steps.length})</TabsTrigger>
            <TabsTrigger value="answers">Answers ({answers.length})</TabsTrigger>
            <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="steps">
            <Card>
              <CardHeader>
                <CardTitle>QuickPath Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Question (Default)</TableHead>
                      <TableHead>Question (EN)</TableHead>
                      <TableHead>Question (FR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {steps.map((step) => (
                      <TableRow key={step.id}>
                        <TableCell className="font-mono text-xs">{step.id.slice(0, 8)}...</TableCell>
                        <TableCell>{step.question || "—"}</TableCell>
                        <TableCell>{step.question_en || "—"}</TableCell>
                        <TableCell>{step.question_fr || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="answers">
            <Card>
              <CardHeader>
                <CardTitle>QuickPath Answers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Step ID</TableHead>
                      <TableHead>Label (Default)</TableHead>
                      <TableHead>Next Step</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers.map((answer) => (
                      <TableRow key={answer.id}>
                        <TableCell className="font-mono text-xs">{answer.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{answer.step_id?.slice(0, 8) || "—"}...</TableCell>
                        <TableCell>{answer.label || answer.label_en || "—"}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {answer.next_step_id ? `${answer.next_step_id.slice(0, 8)}...` : "End"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Recommendation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Age Answer</TableHead>
                      <TableHead>Issue Answer</TableHead>
                      <TableHead>Recommendation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-mono text-xs">{rule.id.slice(0, 8)}...</TableCell>
                        <TableCell className="font-mono text-xs">{rule.age_answer_id?.slice(0, 8) || "—"}...</TableCell>
                        <TableCell className="font-mono text-xs">
                          {rule.issue_answer_id?.slice(0, 8) || "—"}...
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {rule.recommendation || rule.recommendation_en || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
