"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Info, CheckCircle, Loader2, Copy, Check } from "lucide-react"
import type { AnalysisResult } from "@/app/page"

interface CodeAnalysisProps {
  result: AnalysisResult | null
  isLoading: boolean
}

export function CodeAnalysis({ result, isLoading }: CodeAnalysisProps) {
  const [copied, setCopied] = useState(false)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card rounded-lg p-8 border border-border text-center shadow-2xl">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-card-foreground">Analyzing Your Code</h3>
          <p className="text-sm text-muted-foreground">This may take a moment...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--success)"
    if (score >= 60) return "var(--warning)"
    return "var(--danger)"
  }

  const getSeverityIcon = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--danger)" }} />
      case "medium":
        return <Info className="w-5 h-5 flex-shrink-0" style={{ color: "var(--warning)" }} />
      case "low":
        return <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--primary)" }} />
      default:
        return null
    }
  }

  const handleCopyReport = async () => {
    if (!result.markdownReport) return
    await navigator.clipboard.writeText(result.markdownReport)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-card-foreground">Overall Score</h2>
        <div className="text-6xl font-bold" style={{ color: getScoreColor(result.score) }}>
          {result.score}/100
        </div>
        <p dir="rtl" className="text-muted-foreground mt-3 max-w-2xl mx-auto">{result.summary}</p>
      </Card>

      <Card className="p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-card-foreground">Improvement Suggestions</h3>
        <div className="space-y-4">
          {result.improvements.map((item, index) => (
            <div key={index} className="bg-background/50 rounded-lg p-4 border border-border transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                {getSeverityIcon(item.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span dir="rtl" className="font-semibold text-card-foreground">{item.category}</span>
                    <Badge variant="secondary" className="capitalize">{item.severity}</Badge>
                  </div>
                  <p dir="rtl" className="text-sm text-muted-foreground mb-3 break-words">{item.issue}</p>

                  {item.codeSnippet && (
                    <div className="mb-3">
                      <pre dir="ltr" className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-w-full text-card-foreground border border-border">
                        <code className="whitespace-pre">{item.codeSnippet}</code>
                      </pre>
                      {item.lineNumber && <p className="text-xs text-muted-foreground mt-1">Line: {item.lineNumber}</p>}
                    </div>
                  )}

                  <p dir="rtl" className="text-sm break-words" style={{ color: 'var(--success)' }}>
                    <span className="font-semibold" style={{ color: 'var(--success)' }}>Suggestion:</span> {item.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {result.finalVerdict && (
        <Card className="p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-card-foreground">جمع‌بندی نهایی</h3>
          <p dir="rtl" className="text-sm text-muted-foreground whitespace-pre-line">{result.finalVerdict}</p>
        </Card>
      )}

      {result.markdownReport && (
        <Card className="p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-card-foreground">گزارش جامع</h3>
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "کپی شد" : "کپی گزارش"}
            </button>
          </div>
          
          <div dir="rtl" className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              اگر به یک گزارش مرتب و کاملاً ساختاریافته نیاز دارید، می‌توانید کل متن گزارش را کپی کرده و آن را به یکی از ربات‌های تلگرامی زیر (که مخصوص رندر کردن و نمایش زیبای فرمت Markdown هستند) بفرستید:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://t.me/MarkdownRenderBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:opacity-80 transition-opacity"
              >
                ربات MarkdownRenderBot@
              </a>
              <a
                href="https://t.me/RichTextEchoBot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:opacity-80 transition-opacity"
              >
                ربات RichTextEchoBot@
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
