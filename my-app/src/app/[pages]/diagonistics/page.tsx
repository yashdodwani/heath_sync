"use client"

import type React from "react"

import { useState } from "react"
import { Microscope, Upload, FileImage, FileText, Check, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function DiagnosticsPage() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "analyzing" | "complete" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const handleFileUpload = () => {
    // Simulate file upload process
    setUploadState("uploading")
    setProgress(0)

    const uploadInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setUploadState("analyzing")
          simulateAnalysis()
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const simulateAnalysis = () => {
    // Simulate AI analysis process
    setTimeout(() => {
      setUploadState("complete")
      setResults({
        diagnosis: "Potential early-stage pneumonia detected",
        confidence: 87,
        regions: [
          { x: 120, y: 150, width: 60, height: 40, probability: 0.87 },
          { x: 200, y: 180, width: 30, height: 25, probability: 0.62 },
        ],
        recommendations: ["Additional CT scan recommended", "Consult with pulmonologist", "Follow-up in 2 weeks"],
      })

      toast({
        title: "Analysis Complete",
        description: "AI diagnostic analysis has been completed successfully.",
      })
    }, 3000)
  }

  const resetUpload = () => {
    setUploadState("idle")
    setProgress(0)
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Precision Diagnostics</h2>
        <p className="text-muted-foreground">
          Upload medical images for AI-powered analysis and diagnostic assistance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span>Upload Medical Images</span>
            </CardTitle>
            <CardDescription>Supported formats: DICOM, JPEG, PNG, TIFF</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadState === "idle" ? (
              <div
                className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFileUpload()
                }}
              >
                <FileImage className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Drag and drop files</h3>
                <p className="mb-4 text-sm text-muted-foreground">or click to browse your computer</p>
                <Button onClick={handleFileUpload}>Select Files</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg border bg-muted p-2">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">chest-xray-frontal.dcm</span>
                      {uploadState === "complete" && <Check className="h-5 w-5 text-green-500" />}
                      {uploadState === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {uploadState === "uploading" && "Uploading..."}
                      {uploadState === "analyzing" && "AI analysis in progress..."}
                      {uploadState === "complete" && "Analysis complete"}
                      {uploadState === "error" && "Error during analysis"}
                    </div>
                    <Progress value={progress} className="mt-2 h-2" />
                  </div>
                </div>

                {uploadState === "analyzing" && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">AI analysis in progress...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetUpload} disabled={uploadState === "idle"}>
              Reset
            </Button>
            <Button disabled={uploadState !== "idle"} onClick={handleFileUpload}>
              Upload New Image
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5" />
              <span>Diagnostic Results</span>
            </CardTitle>
            <CardDescription>AI-powered analysis and findings</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadState === "complete" && results ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <div className="mb-2 text-sm font-medium">Primary Finding</div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${results.confidence > 80 ? "bg-red-500" : "bg-amber-500"}`}
                    ></div>
                    <span className="font-medium">{results.diagnosis}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{results.confidence}%</span>
                      <Progress value={results.confidence} className="h-2 w-20" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">Detected Regions</div>
                  <div className="relative h-64 w-full rounded-lg border bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      X-ray image preview
                    </div>
                    {results.regions.map((region: any, i: number) => (
                      <div
                        key={i}
                        className="absolute border-2 border-red-500"
                        style={{
                          left: `${region.x}px`,
                          top: `${region.y}px`,
                          width: `${region.width}px`,
                          height: `${region.height}px`,
                        }}
                      >
                        <div className="absolute -top-6 left-0 rounded bg-red-500 px-2 py-0.5 text-xs text-white">
                          {Math.round(region.probability * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm font-medium">Recommendations</div>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 text-green-500" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No results yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload a medical image to receive AI-powered diagnostic analysis
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {uploadState === "complete" && <Button className="w-full">Generate Detailed Report</Button>}
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Analyses</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Diagnostic Analyses</CardTitle>
              <CardDescription>Previously analyzed medical images and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-muted p-2">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Chest X-ray (PA view)</div>
                      <div className="text-sm text-muted-foreground">Analyzed 2 days ago</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-muted p-2">
                      <FileImage className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Brain MRI (T1 sequence)</div>
                      <div className="text-sm text-muted-foreground">Analyzed 1 week ago</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Diagnostic reports saved for future reference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">No saved reports yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Available AI Models</CardTitle>
              <CardDescription>Specialized models for different diagnostic tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">ChestNet-X</div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Specialized for chest X-ray analysis with 97% accuracy
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">NeuroScan-MRI</div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Brain MRI analysis with focus on tumor detection
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">DermaScan-AI</div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Dermatological image analysis for skin conditions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing Badge component
function Badge({
  variant = "default",
  children,
  className,
}: {
  variant?: "default" | "outline"
  children: React.ReactNode
  className?: string
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-muted-foreground/30 text-muted-foreground",
  }

  return <span className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}>{children}</span>
}

