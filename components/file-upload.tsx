"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FileUploadProps {
  onFileAnalysis: (file: File, content: string) => void
  isAnalyzing: boolean
}

export function FileUpload({ onFileAnalysis, isAnalyzing }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/*": [
        ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".c", ".cpp", ".cc", ".cxx",
        ".cs", ".rb", ".go", ".php", ".swift", ".kt", ".rs", ".r", ".scala", ".sh",
        ".bash", ".ps1", ".lua", ".dart", ".elm", ".ex", ".exs", ".erl", ".hrl",
        ".fs", ".fsx", ".clj", ".cljs", ".hs", ".jl", ".ml", ".nim", ".pas", ".pl",
        ".pm", ".v", ".vb", ".zig", ".h", ".hpp"
      ],
    },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!selectedFile) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onFileAnalysis(selectedFile, content)
    }
    reader.readAsText(selectedFile)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-card-foreground">
              {isDragActive ? "فایل کد خود را اینجا رها کنید" : "فایل کد خود را آپلود کنید"}
            </p>
            <p className="text-sm text-muted-foreground">
              پشتیبانی از پایتون، جاوااسکریپت، تایپ‌اسکریپت، جاوا، C++، C#، PHP، روبی، گو، راست، سوئیفت و موارد دیگر
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-card-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} کیلوبایت</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemoveFile} disabled={isAnalyzing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button onClick={handleAnalyze} disabled={!selectedFile || isAnalyzing} className="w-full" size="lg">
          {isAnalyzing ? "در حال تحلیل کد..." : "تحلیل کد"}
        </Button>
      </div>
    </Card>
  )
}
