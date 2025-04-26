import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, ArrowRight, Heart, Shield, Droplet, Apple } from "lucide-react"

// Sample health tips data - in a real app, this would come from a database or API
const healthTips = [
  {
    id: 1,
    date: "March 12, 2025",
    title: "Staying Hydrated During Summer",
    description:
      "Drinking enough water is essential, especially during hot weather. Aim for at least 8 glasses of water daily.",
    icon: <Droplet className="h-8 w-8 text-blue-500" />,
    category: "Nutrition",
  },
  {
    id: 2,
    date: "March 11, 2025",
    title: "Preventing Common Infections",
    description:
      "Wash your hands regularly with soap and water for at least 20 seconds to prevent the spread of infections.",
    icon: <Shield className="h-8 w-8 text-green-500" />,
    category: "Prevention",
  },
  {
    id: 3,
    date: "March 10, 2025",
    title: "Benefits of Seasonal Fruits",
    description: "Eating seasonal fruits provides essential vitamins and minerals that help boost your immune system.",
    icon: <Apple className="h-8 w-8 text-red-500" />,
    category: "Nutrition",
  },
  {
    id: 4,
    date: "March 9, 2025",
    title: "Simple Exercises for Heart Health",
    description:
      "Just 30 minutes of walking daily can significantly improve your heart health and reduce the risk of heart disease.",
    icon: <Heart className="h-8 w-8 text-red-500" />,
    category: "Exercise",
  },
]

export default function AwarenessPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-green-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Back to Home</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold text-green-800">Health Awareness</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Daily Health Tips</h2>
          <p className="text-green-700">
            Stay informed with the latest health information and tips for you and your family.
          </p>
        </div>

        {/* Filter/Category Section */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant="outline" className="bg-green-50 border-green-200">
            All Tips
          </Button>
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            Nutrition
          </Button>
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            Prevention
          </Button>
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            Exercise
          </Button>
          <Button variant="outline" className="border-green-200 hover:bg-green-50">
            Mental Health
          </Button>
        </div>

        {/* Health Tips Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {healthTips.map((tip) => (
            <Card key={tip.id} className="border-green-100 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {tip.icon}
                    <div>
                      <CardTitle className="text-xl text-green-800">{tip.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" /> {tip.date}
                      </CardDescription>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {tip.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{tip.description}</p>
              </CardContent>
              <CardFooter className="bg-green-50 border-t border-green-100">
                <Button variant="ghost" className="text-green-700 p-0 hover:text-green-800 hover:bg-transparent">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Health Campaign Section */}
        <Card className="border-green-100 bg-green-50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-green-800 mb-2">Upcoming Health Campaign: Diabetes Awareness</h3>
                <p className="text-green-700 mb-4">
                  Join our free diabetes screening and awareness camp in your village on March 20, 2025. Learn about
                  prevention, early detection, and management of diabetes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-green-600 hover:bg-green-700">Register for Camp</Button>
                  <Button variant="outline" className="border-green-600 text-green-700">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-green-200 flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-green-700" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" className="border-green-200" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-green-50 border-green-200">
              1
            </Button>
            <Button variant="outline" className="border-green-200 hover:bg-green-50">
              2
            </Button>
            <Button variant="outline" className="border-green-200 hover:bg-green-50">
              3
            </Button>
            <Button variant="outline" className="border-green-200">
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

