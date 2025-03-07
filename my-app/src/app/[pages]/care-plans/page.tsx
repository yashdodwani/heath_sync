"use client"

import type React from "react"

import { useState } from "react"
import { ClipboardList, User, Calendar, Activity, Pill, Apple, Dumbbell, Clock, FileText } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function CarePlansPage() {
  const [formState, setFormState] = useState({
    patientName: "",
    patientAge: "",
    condition: "",
    allergies: "",
    currentMedications: "",
    notes: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [carePlan, setCarePlan] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleGeneratePlan = () => {
    // Validate form
    if (!formState.patientName || !formState.condition) {
      toast.error("Missing Information", {
        description: "Please provide at least patient name and condition.",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate a care plan based on the condition
      let generatedPlan

      if (formState.condition.toLowerCase().includes("diabetes")) {
        generatedPlan = {
          title: "Diabetes Management Plan",
          patientName: formState.patientName,
          patientAge: formState.patientAge,
          condition: "Type 2 Diabetes",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          medications: [
            { name: "Metformin", dosage: "500mg", frequency: "Twice daily with meals" },
            { name: "Glipizide", dosage: "5mg", frequency: "Once daily before breakfast" },
          ],
          activities: [
            { type: "Blood Glucose Monitoring", frequency: "3 times daily", details: "Before meals" },
            { type: "Physical Activity", frequency: "30 minutes", details: "5 days per week, moderate intensity" },
            { type: "Foot Examination", frequency: "Daily", details: "Check for cuts, blisters, or redness" },
          ],
          diet: [
            "Limit carbohydrates to 45-60g per meal",
            "Increase fiber intake with vegetables and whole grains",
            "Avoid sugary beverages and processed foods",
            "Stay hydrated with water throughout the day",
          ],
          followUp: "Schedule appointment with endocrinologist in 4 weeks",
        }
      } else if (formState.condition.toLowerCase().includes("hypertension")) {
        generatedPlan = {
          title: "Hypertension Management Plan",
          patientName: formState.patientName,
          patientAge: formState.patientAge,
          condition: "Hypertension",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          medications: [
            { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
            { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily in the morning" },
          ],
          activities: [
            { type: "Blood Pressure Monitoring", frequency: "Twice daily", details: "Morning and evening" },
            { type: "Physical Activity", frequency: "30 minutes", details: "Most days of the week" },
            { type: "Stress Management", frequency: "Daily", details: "Meditation or deep breathing exercises" },
          ],
          diet: [
            "Follow DASH diet (Dietary Approaches to Stop Hypertension)",
            "Limit sodium intake to less than 2,300mg per day",
            "Increase potassium-rich foods (bananas, potatoes, spinach)",
            "Limit alcohol consumption",
          ],
          followUp: "Schedule appointment with cardiologist in 6 weeks",
        }
      } else if (formState.condition.toLowerCase().includes("asthma")) {
        generatedPlan = {
          title: "Asthma Management Plan",
          patientName: formState.patientName,
          patientAge: formState.patientAge,
          condition: "Asthma",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          medications: [
            { name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "As needed for symptoms" },
            { name: "Fluticasone Inhaler", dosage: "2 puffs", frequency: "Twice daily" },
          ],
          activities: [
            { type: "Peak Flow Monitoring", frequency: "Daily", details: "Morning and evening" },
            { type: "Breathing Exercises", frequency: "10 minutes", details: "Twice daily" },
            { type: "Trigger Avoidance", frequency: "Ongoing", details: "Minimize exposure to known triggers" },
          ],
          diet: [
            "Maintain a healthy weight",
            "Stay hydrated throughout the day",
            "Consider foods rich in antioxidants",
            "Avoid sulfites in food if sensitive",
          ],
          followUp: "Schedule appointment with pulmonologist in 4 weeks",
        }
      } else {
        generatedPlan = {
          title: "General Health Management Plan",
          patientName: formState.patientName,
          patientAge: formState.patientAge,
          condition: formState.condition,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          medications: [{ name: "As prescribed by physician", dosage: "", frequency: "" }],
          activities: [
            { type: "Physical Activity", frequency: "30 minutes", details: "Most days of the week" },
            { type: "Sleep", frequency: "7-8 hours", details: "Maintain consistent sleep schedule" },
          ],
          diet: [
            "Balanced diet with plenty of fruits and vegetables",
            "Stay hydrated with water throughout the day",
            "Limit processed foods and added sugars",
          ],
          followUp: "Schedule follow-up appointment in 4 weeks",
        }
      }

      setCarePlan(generatedPlan)
      setIsGenerating(false)

      toast.success("Care Plan Generated", {
        description: "Personalized care plan has been created successfully.",
      })
    }, 2000)
  }

  const handleSavePlan = () => {
    toast.success("Care Plan Saved", {
      description: "The care plan has been saved successfully.",
    })
  }

  const handleFinalizePlan = () => {
    toast.success("Care Plan Finalized", {
      description: "The care plan has been finalized and sent to the patient.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Personalized Care Plans</h2>
        <p className="text-muted-foreground">Create and manage AI-generated personalized care plans for patients.</p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList>
          <TabsTrigger value="create">Create Plan</TabsTrigger>
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>Enter patient details to generate a personalized care plan</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      placeholder="Enter patient name"
                      value={formState.patientName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="patientAge">Patient Age</Label>
                    <Input
                      id="patientAge"
                      name="patientAge"
                      placeholder="Enter patient age"
                      value={formState.patientAge}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="condition">Primary Condition</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("condition", value)}
                      value={formState.condition}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Type 2 Diabetes">Type 2 Diabetes</SelectItem>
                        <SelectItem value="Hypertension">Hypertension</SelectItem>
                        <SelectItem value="Asthma">Asthma</SelectItem>
                        <SelectItem value="Arthritis">Arthritis</SelectItem>
                        <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      placeholder="Enter allergies (if any)"
                      value={formState.allergies}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      name="currentMedications"
                      placeholder="Enter current medications"
                      value={formState.currentMedications}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Enter any additional notes"
                      value={formState.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleGeneratePlan} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Generate Care Plan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  <span>Generated Care Plan</span>
                </CardTitle>
                <CardDescription>AI-generated personalized care plan based on patient information</CardDescription>
              </CardHeader>
              <CardContent>
                {carePlan ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted p-4">
                      <h3 className="text-lg font-semibold">{carePlan.title}</h3>
                      <div className="mt-2 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Patient: {carePlan.patientName}, {carePlan.patientAge} years
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span>Condition: {carePlan.condition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Duration: {carePlan.startDate} to {carePlan.endDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Medications</h4>
                      <div className="space-y-2">
                        {carePlan.medications.map((med: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 rounded-md border p-2">
                            <Pill className="mt-0.5 h-4 w-4 text-blue-500" />
                            <div>
                              <div className="font-medium">{med.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {med.dosage} {med.frequency && `- ${med.frequency}`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Activities</h4>
                      <div className="space-y-2">
                        {carePlan.activities.map((activity: any, i: number) => (
                          <div key={i} className="flex items-start gap-2 rounded-md border p-2">
                            <Dumbbell className="mt-0.5 h-4 w-4 text-green-500" />
                            <div>
                              <div className="font-medium">{activity.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {activity.frequency} - {activity.details}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Diet Recommendations</h4>
                      <div className="rounded-md border p-2">
                        <ul className="space-y-1">
                          {carePlan.diet.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <Apple className="mt-0.5 h-4 w-4 text-red-500" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-md border bg-muted p-2">
                      <div className="font-medium">Follow-up</div>
                      <div className="text-sm">{carePlan.followUp}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[400px] flex-col items-center justify-center text-center">
                    <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-medium">No care plan generated yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Fill out the patient information form and click "Generate Care Plan"
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {carePlan && (
                  <>
                    <Button variant="outline" onClick={handleSavePlan}>
                      Save as Draft
                    </Button>
                    <Button onClick={handleFinalizePlan}>Finalize Plan</Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Care Plans</CardTitle>
              <CardDescription>Currently active personalized care plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Diabetes Management Plan</div>
                      <div className="text-sm text-muted-foreground">Patient: John Smith, 58 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Hypertension Management Plan</div>
                      <div className="text-sm text-muted-foreground">Patient: Mary Johnson, 64 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Post-Surgery Recovery Plan</div>
                      <div className="text-sm text-muted-foreground">Patient: Robert Davis, 42 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Review Needed
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Asthma Management Plan</div>
                      <div className="text-sm text-muted-foreground">Patient: Emily Wilson, 29 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Arthritis Management Plan</div>
                      <div className="text-sm text-muted-foreground">Patient: Patricia Brown, 71 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Updated
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create New Care Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Care Plan Templates</CardTitle>
              <CardDescription>Reusable templates for common conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-500 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Diabetes Management Template</div>
                        <div className="text-sm text-muted-foreground">
                          Comprehensive plan for Type 1 and Type 2 diabetes
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-red-500 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Cardiovascular Disease Template</div>
                        <div className="text-sm text-muted-foreground">
                          For hypertension, heart failure, and post-MI care
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-500 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Respiratory Conditions Template</div>
                        <div className="text-sm text-muted-foreground">
                          For asthma, COPD, and other respiratory conditions
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-purple-500 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Mental Health Template</div>
                        <div className="text-sm text-muted-foreground">
                          For depression, anxiety, and stress management
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-amber-500 p-2">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">Post-Surgery Recovery Template</div>
                        <div className="text-sm text-muted-foreground">
                          General recovery guidelines adaptable to surgery type
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Import Template</Button>
              <Button>Create New Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

