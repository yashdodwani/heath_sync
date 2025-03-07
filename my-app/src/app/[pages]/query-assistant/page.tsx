"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Brain, Send, User, Paperclip, Loader2, Bot, Clock, ArrowDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function QueryAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello, I'm your AI health assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]) //Corrected dependency

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      generateResponse(userMessage.content)
    }, 1500)
  }

  const generateResponse = (query: string) => {
    // Simulate AI response based on user query
    let response = ""

    if (query.toLowerCase().includes("medication") || query.toLowerCase().includes("medicine")) {
      response =
        "Based on the information in your health record, your current medications include Lisinopril (10mg daily) for blood pressure and Metformin (500mg twice daily) for type 2 diabetes. Always take these medications as prescribed. If you're experiencing any side effects, please consult with your healthcare provider before making any changes to your regimen."
    } else if (query.toLowerCase().includes("appointment") || query.toLowerCase().includes("schedule")) {
      response =
        "Your next scheduled appointment is on Tuesday, June 15th at 2:30 PM with Dr. Sarah Chen. Would you like me to help you reschedule or set up a new appointment?"
    } else if (query.toLowerCase().includes("result") || query.toLowerCase().includes("test")) {
      response =
        "Your recent lab results from May 5th show normal kidney and liver function. Your HbA1c is 6.8%, which is slightly improved from your previous test but still above the target range. Dr. Chen recommends continuing with your current treatment plan and will discuss potential adjustments at your next appointment."
    } else if (query.toLowerCase().includes("symptom") || query.toLowerCase().includes("pain")) {
      response =
        "Based on the symptoms you've described, this could be related to several conditions. While I can provide general information, I recommend scheduling a consultation with your healthcare provider for a proper evaluation. Would you like me to help you schedule an appointment?"
    } else {
      response =
        "Thank you for your question. I'm here to help with any health-related inquiries you might have. Could you provide more specific details about your question so I can give you the most accurate information?"
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Patient Query Assistant</h2>
        <p className="text-muted-foreground">Ask health-related questions and receive AI-powered responses.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span>AI Health Assistant</span>
            </CardTitle>
            <CardDescription>Ask questions about your health, medications, or appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] px-4">
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[80%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar>
                        {message.role === "user" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div
                          className={`mt-1 flex items-center gap-1 text-xs text-muted-foreground ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="rounded-lg bg-muted p-3">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating response...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 pt-0">
            <div className="flex w-full items-end gap-2">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  toast({
                    title: "Feature not available",
                    description: "File attachment is not available in this demo.",
                  })
                }}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea
                placeholder="Type your health question here..."
                className="min-h-[60px] flex-1 resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button className="shrink-0" onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Suggested Questions</CardTitle>
            <CardDescription>Common health-related questions you can ask</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  setInput("What medications am I currently taking?")
                }}
              >
                What medications am I currently taking?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  setInput("When is my next appointment scheduled?")
                }}
              >
                When is my next appointment scheduled?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  setInput("Can you explain my recent test results?")
                }}
              >
                Can you explain my recent test results?
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => {
                  setInput("I've been experiencing headaches and dizziness. What could this mean?")
                }}
              >
                I've been experiencing headaches and dizziness. What could this mean?
              </Button>
            </div>
          </CardContent>
          <CardHeader className="border-t">
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="font-medium">Medication Side Effects</div>
                <div className="text-sm text-muted-foreground">Yesterday</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="font-medium">Diet Recommendations</div>
                <div className="text-sm text-muted-foreground">3 days ago</div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <ArrowDown className="mr-2 h-4 w-4" />
                View More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

