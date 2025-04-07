import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

// Sample FAQ data
const faqCategories = [
  {
    category: "General Questions",
    questions: [
      {
        id: "q1",
        question: "What is PA & QMS?",
        answer:
          "PA & QMS is a comprehensive platform that provides project assessment and quality management system solutions for businesses of all sizes. Our tools help organizations streamline their processes, ensure compliance, and improve overall quality management.",
      },
      {
        id: "q2",
        question: "How do I get started with PA & QMS?",
        answer:
          "Getting started is easy! Simply sign up for an account, choose your subscription plan, and follow our step-by-step onboarding process. Our intuitive interface will guide you through setting up your first project or quality management system.",
      },
      {
        id: "q3",
        question: "Is there a free trial available?",
        answer:
          "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial. You can upgrade to a paid plan at any time during or after your trial period.",
      },
    ],
  },
  {
    category: "Account Management",
    questions: [
      {
        id: "q4",
        question: "How do I reset my password?",
        answer:
          "To reset your password, click on the 'Forgot Password' link on the login page. Enter your email address, and we'll send you instructions to create a new password. For security reasons, password reset links expire after 24 hours.",
      },
      {
        id: "q5",
        question: "Can I change my subscription plan?",
        answer:
          "Yes, you can upgrade, downgrade, or cancel your subscription at any time from your account settings. Changes to your subscription will take effect at the start of your next billing cycle.",
      },
      {
        id: "q6",
        question: "How do I add team members to my account?",
        answer:
          "To add team members, go to 'Settings' > 'Team Management' and click 'Invite Member'. Enter their email address and select their role/permissions. They'll receive an invitation to join your workspace.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        id: "q7",
        question: "What browsers are supported?",
        answer:
          "PA & QMS supports the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version.",
      },
      {
        id: "q8",
        question: "Is my data secure?",
        answer:
          "Yes, we take data security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly undergo security audits to ensure your information remains protected.",
      },
      {
        id: "q9",
        question: "Can I export my data?",
        answer:
          "Yes, you can export your data in various formats including CSV, Excel, and PDF. Go to the specific project or report you want to export and look for the export option in the top-right menu.",
      },
    ],
  },
]

export default function HelpContent() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQs based on search query
  const filteredFaqs =
    searchQuery.trim() === ""
      ? faqCategories
      : faqCategories
          .map((category) => ({
            category: category.category,
            questions: category.questions.filter(
              (q) =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((category) => category.questions.length > 0)

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search for answers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
            <p className="text-gray-600 mb-4">New to PA & QMS? Learn the basics and set up your account.</p>
            <Button variant="outline" className="w-full">
              View Guides
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
            <p className="text-gray-600 mb-4">Watch step-by-step tutorials on using our platform.</p>
            <Button variant="outline" className="w-full">
              Watch Videos
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Explore our detailed documentation and API references.</p>
            <Button variant="outline" className="w-full">
              Read Docs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Accordions */}
      {filteredFaqs.length > 0 ? (
        filteredFaqs.map(
          (category, index) =>
            category.questions.length > 0 && (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ),
        )
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No results found for "{searchQuery}"</p>
          <p className="mb-4">Try using different keywords or browse the categories below.</p>
          <Button onClick={() => setSearchQuery("")} variant="outline">
            Clear Search
          </Button>
        </div>
      )}

      {/* Contact Support Section */}
      <div className="bg-gray-50 rounded-xl p-8 text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          If you couldn't find the answer you were looking for, our support team is ready to assist you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/contact-us">
            <Button className="bg-teal-600 hover:bg-teal-700">Contact Support</Button>
          </Link>
          <Button variant="outline">Schedule a Demo</Button>
        </div>
      </div>
    </div>
  )
}

