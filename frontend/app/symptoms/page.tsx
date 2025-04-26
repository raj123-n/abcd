"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Brain, Thermometer, Stethoscope, AlertCircle } from "lucide-react"

interface SymptomAnalysis {
  severity: 'low' | 'medium' | 'high';
  possibleConditions: string[];
  recommendations: string[];
  urgencyLevel: string;
  recommendedDoctorTypes: string[];
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("describe")

  const commonSymptoms = [
    { name: "Fever", icon: <Thermometer className="h-5 w-5" /> },
    { name: "Headache", icon: <Brain className="h-5 w-5" /> },
    { name: "Cough", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Stomach Pain", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Dizziness", icon: <Brain className="h-5 w-5" /> },
    { name: "Fatigue", icon: <Stethoscope className="h-5 w-5" /> },
  ]

  const handleSymptomClick = (symptom: string) => {
    setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom))
  }

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return

    setIsLoading(true)
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:11434/api/generate', {
        // Ensure your local server is running and accessible at this address.
        // Also, check the API endpoint and CORS configuration if needed.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3:1b',
          prompt: `
            As a medical AI assistant, analyze these symptoms and provide a structured analysis.
            Consider these available doctor types: ${commonSymptoms.map(symptom => symptom.name).join(', ')}.

            Format your response EXACTLY as JSON with this structure:
            {
              "severity": "low/medium/high",
              "possibleConditions": ["condition1", "condition2"],
              "recommendations": ["recommendation1", "recommendation2"],
              "urgencyLevel": "description of urgency",
              "recommendedDoctorTypes": ["doctor type 1", "doctor type 2"]
            }

            Symptoms: ${symptoms}

            Rules:
            1. recommendedDoctorTypes must ONLY include values from the available types listed above
            2. severity must ONLY be "low", "medium", or "high"
            3. Include at least 2 recommendations
            4. Make urgencyLevel clear and actionable
            5. If symptoms are severe, recommend immediate medical attention
          `,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.response;

      // Log the raw response for debugging
      console.log('Raw Ollama Response:', responseText);

      // Remove backticks and everything after the JSON object
      responseText = responseText.replace(/```json\s*|```|\n\n.*$/gs, '').trim();

      // Log the processed response before parsing
      console.log('Processed Ollama Response:', responseText);

      try {
        const analysis = JSON.parse(responseText);
        setAnalysis(analysis);
        setActiveTab("results");
      } catch (error) {
        setError('Failed to parse AI analysis response. Please check the console for details.');
        console.error('Error parsing Ollama response:', error);
        console.error('Invalid JSON:', responseText); // Log the invalid JSON
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze symptoms. Please try again.');
      console.error('Error analyzing symptoms:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-24 px-6">
      <div className="w-full max-w-3xl space-y-8">
        {error && (
          <div className="flex items-center rounded-md bg-red-50 p-4 text-red-700" role="alert">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-red-800 font-medium">Error</h5>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-2xl text-green-800">Check Your Symptoms</CardTitle>
            <CardDescription className="text-green-700">
              Describe your symptoms to get AI-powered analysis and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="describe">Describe Symptoms</TabsTrigger>
                <TabsTrigger value="results" disabled={!analysis}>
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="describe" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Common Symptoms</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {commonSymptoms.map((symptom, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="border-green-200 hover:bg-green-50 hover:border-green-300"
                        onClick={() => handleSymptomClick(symptom.name)}
                      >
                        {symptom.icon}
                        <span className="ml-2">{symptom.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="symptoms" className="text-lg font-medium">
                    Describe your symptoms in detail
                  </label>
                  <Textarea
                    id="symptoms"
                    placeholder="Example: I've had a headache for 2 days, along with a mild fever and sore throat..."
                    className="min-h-32 text-base"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Include when symptoms started, their severity, and any other relevant information.
                  </p>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={analyzeSymptoms}
                  disabled={!symptoms.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Symptoms...
                    </>
                  ) : (
                    "Analyze My Symptoms"
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="results" className="space-y-6">
                {analysis && (
                  <>
                    <Card className="border-green-100">
                      <CardHeader className={`border-b ${getSeverityColor(analysis.severity)}`}>
                        <CardTitle className="text-xl">Analysis Results</CardTitle>
                        <CardDescription>
                          Severity Level: <span className="font-medium">{analysis.severity.toUpperCase()}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                          <p className="text-yellow-800 font-medium">
                            This is an AI-powered analysis, not a medical diagnosis. Always consult with a healthcare professional.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">Possible Conditions:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {analysis.possibleConditions.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-medium mb-2">Recommendations:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {analysis.recommendations.map((recommendation, index) => (
                                <li key={index}>{recommendation}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-medium mb-2">Urgency Level:</h3>
                            <p className="pl-5">{analysis.urgencyLevel}</p>
                          </div>

                          <div>
                            <h3 className="font-medium mb-2">Recommended Doctor Types:</h3>
                            <div className="flex flex-wrap gap-2">
                              {analysis.recommendedDoctorTypes.map((doctorType, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
                                >
                                  {doctorType}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-4 pt-6">
                        <Button
                          variant="outline"
                          className="border-green-200"
                          onClick={() => setActiveTab("describe")}
                        >
                          Check Another Symptom
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          asChild
                        >
                          <Link href="/appointments">Book Appointment</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
  switch (severity) {
    case 'low':
      return 'border-green-100';
    case 'medium':
      return 'border-yellow-100';
    case 'high':
      return 'border-red-100';
    default:
      return 'border-gray-100';
  }
};
