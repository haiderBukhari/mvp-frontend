import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import {
  HelpCircle,
  FileText,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  Upload,
  DollarSign,
  Eye,
  Users,
  Settings,
  Book,
  Video,
  Download,
  ExternalLink
} from 'lucide-react';

const HelpSupport = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is MediaCo BookFlow?",
          answer: "MediaCo BookFlow is a comprehensive booking management platform designed for media companies. It digitizes the traditional manual booking workflow by allowing advertisers to create bookings online, generate PDFs automatically, interact with sales reps through real-time chat, and track booking status through a rich dashboard."
        },
        {
          question: "How do I create my first booking?",
          answer: "To create your first booking: 1) Navigate to 'Create Booking' from the sidebar, 2) Enter campaign name and description, 3) Upload your booking PDF for automatic parsing, 4) Fill in the multi-step form (Client Details, Campaign Details, Financials), 5) Review all information, and 6) Submit your booking. The system will automatically generate a PDF and send it to our sales rep inbox."
        },
        {
          question: "What file formats are supported for upload?",
          answer: "Currently, we support PDF files for automatic parsing. You can upload PDFs containing booking information, and our system will extract and pre-fill the form fields automatically."
        }
      ]
    },
    {
      category: "Booking Process",
      questions: [
        {
          question: "How does the PDF parsing work?",
          answer: "Our PDF parsing feature automatically extracts booking information from uploaded PDFs. Simply upload your PDF, click 'Parse PDF', and wait for the system to analyze and pre-fill the form fields. This saves time and reduces manual data entry errors."
        },
        {
          question: "Can I edit information after PDF parsing?",
          answer: "Yes! After PDF parsing, all extracted information is pre-filled but fully editable. You can review and modify any field in the multi-step form before final submission."
        },
        {
          question: "How are net amounts calculated?",
          answer: "Net amounts are calculated automatically using the formula: Net Amount = Gross Amount - (Gross Amount × Partner Discount %) + Additional Charges. The calculation updates in real-time as you modify any financial fields."
        },
        {
          question: "What happens after I submit a booking?",
          answer: "After submission: 1) A PDF is automatically generated with your booking details, 2) The booking is sent to our sales rep inbox, 3) You receive a confirmation notification, 4) The booking appears in your dashboard with a status timeline, and 5) You can track progress and chat with sales reps in real-time."
        }
      ]
    },
    {
      category: "Dashboard & Tracking",
      questions: [
        {
          question: "How do I track my booking status?",
          answer: "Use the Dashboard to view all your bookings with real-time status updates. Each booking shows a progress timeline: Submitted → PDF Generated → Sent to Sales Rep → In Progress → Confirmed. You can also view detailed activity logs for each booking."
        },
        {
          question: "What is the Sales Rep Inbox?",
          answer: "The Sales Rep Inbox is a simulation view that shows how sales representatives receive and process your bookings. You can switch to this view to see your submitted bookings from the sales rep perspective and understand the confirmation process."
        },
        {
          question: "How does real-time chat work?",
          answer: "Each booking has an integrated chat feature allowing direct communication with sales reps. Chat messages are logged in the booking timeline, and you'll receive notifications for new messages. This enables quick clarifications and faster booking processing."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          question: "Why can't I upload my PDF?",
          answer: "Ensure your file is in PDF format and under the size limit. If you continue experiencing issues, try using a different browser or contact our support team."
        },
        {
          question: "How do I switch between light and dark mode?",
          answer: "Use the theme toggle switch in the bottom of the sidebar. The setting will be remembered across your sessions and applied to all pages including login, signup, and dashboard."
        },
        {
          question: "What browsers are supported?",
          answer: "MediaCo BookFlow works best on modern browsers including Chrome, Firefox, Safari, and Edge. For optimal experience, ensure your browser is updated to the latest version."
        }
      ]
    }
  ];

  const features = [
    {
      title: "Multi-Step Booking Form",
      description: "Guided form with PDF upload, client details, campaign setup, and financial configuration",
      icon: FileText,
      steps: ["Upload PDF & Parse", "Client Details", "Campaign Details", "Financials", "Review & Confirm"]
    },
    {
      title: "Real-Time Dashboard",
      description: "Track all bookings with live status updates and comprehensive analytics",
      icon: Eye,
      features: ["Status Timeline", "PDF Preview", "Activity Logs", "Search & Filter"]
    },
    {
      title: "PDF Automation",
      description: "Automatically generate MediaCo order forms with booking data",
      icon: Upload,
      capabilities: ["Auto-generation", "In-browser preview", "Status watermarks", "Instant delivery"]
    },
    {
      title: "Live Chat Integration",
      description: "Real-time communication with sales representatives",
      icon: MessageCircle,
      benefits: ["Instant messaging", "Booking-specific chats", "Timeline integration", "Notifications"]
    }
  ];

  const tutorials = [
    {
      title: "Creating Your First Booking",
      duration: "5 min read",
      description: "Step-by-step guide to creating and submitting your first booking",
      type: "guide"
    },
    {
      title: "Understanding the Dashboard",
      duration: "3 min read",
      description: "Navigate and utilize all dashboard features effectively",
      type: "guide"
    },
    {
      title: "PDF Upload & Parsing Demo",
      duration: "2 min video",
      description: "Watch how PDF parsing automatically fills your booking forms",
      type: "video"
    },
    {
      title: "Using Real-Time Chat",
      duration: "4 min read",
      description: "Communicate effectively with sales reps through integrated chat",
      type: "guide"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about MediaCo BookFlow</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  What is MediaCo BookFlow?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  MediaCo BookFlow is a revolutionary booking management platform that transforms traditional media booking workflows. 
                  It digitizes the entire process from manual PDF-based bookings to a streamlined, automated workflow.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Automated PDF generation and parsing</li>
                      <li>• Real-time booking status tracking</li>
                      <li>• Integrated chat with sales representatives</li>
                      <li>• Comprehensive dashboard and analytics</li>
                      <li>• Streamlined multi-step booking process</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Perfect For:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Media companies and advertisers</li>
                      <li>• Marketing agencies</li>
                      <li>• Campaign managers</li>
                      <li>• Sales teams</li>
                      <li>• Anyone managing media bookings</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Save Time</h3>
                  <p className="text-sm text-muted-foreground">Automate manual processes and reduce booking time by up to 80%</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Increase Accuracy</h3>
                  <p className="text-sm text-muted-foreground">Eliminate manual errors with automated data extraction and validation</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Better Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Real-time chat and status updates keep everyone aligned</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Sign Up & Log In</h4>
                      <p className="text-muted-foreground">Create your account with company details and log in to access the dashboard.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Explore the Dashboard</h4>
                      <p className="text-muted-foreground">Familiarize yourself with the layout, navigation, and key features.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Create Your First Booking</h4>
                      <p className="text-muted-foreground">Use the "Create Booking" feature to submit your first media booking request.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Track & Communicate</h4>
                      <p className="text-muted-foreground">Monitor your booking status and use the chat feature for real-time communication.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        {tutorial.type === 'video' ? (
                          <Video className="h-5 w-5 text-primary" />
                        ) : (
                          <Book className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{tutorial.title}</h3>
                          <Badge variant="secondary" className="text-xs">{tutorial.duration}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{tutorial.description}</p>
                        <Button variant="outline" size="sm">
                          {tutorial.type === 'video' ? 'Watch Video' : 'Read Guide'}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    
                    {feature.steps && (
                      <div>
                        <h4 className="font-semibold mb-2">Process Steps:</h4>
                        <ul className="space-y-1">
                          {feature.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feature.features && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                          {feature.features.map((feat, featIndex) => (
                            <li key={featIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feature.capabilities && (
                      <div>
                        <h4 className="font-semibold mb-2">Capabilities:</h4>
                        <ul className="space-y-1">
                          {feature.capabilities.map((capability, capIndex) => (
                            <li key={capIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {feature.benefits && (
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, benIndex) => (
                            <li key={benIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle>{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us more about your question or issue..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@mediaco.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-muted-foreground">+65 6123 4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Business Hours</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9:00 AM - 6:00 PM SGT</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download User Manual
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Video Tutorials
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      System Status
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupport;
