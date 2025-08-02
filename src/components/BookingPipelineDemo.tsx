import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Upload, FileText, Target, ArrowRight } from 'lucide-react';

const BookingPipelineDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Campaign Creation",
      subtitle: "AI generates campaign name",
      description: "Summer Electronics Boost 2024",
      icon: Target,
      color: "bg-blue-500",
      status: "generating"
    },
    {
      id: 2,
      title: "Description Writing",
      subtitle: "Crafting campaign description",
      description: "Targeting tech-savvy millennials with premium electronics during summer season...",
      icon: FileText,
      color: "bg-purple-500",
      status: "writing"
    },
    {
      id: 3,
      title: "Asset Upload",
      subtitle: "Processing media files",
      description: "banner_v2.jpg, video_intro.mp4, product_shots.zip",
      icon: Upload,
      color: "bg-green-500",
      status: "uploading"
    },
    {
      id: 4,
      title: "Data Review",
      subtitle: "Analyzing campaign data",
      description: "Budget: $25k | Duration: 30 days | Platforms: Google, Meta, LinkedIn",
      icon: Clock,
      color: "bg-orange-500",
      status: "reviewing"
    },
    {
      id: 5,
      title: "Finalization",
      subtitle: "Booking completed successfully",
      description: "Multi-step booking form completed: Client Details → Campaign Details → Financials → Review & Confirm",
      icon: CheckCircle,
      color: "bg-emerald-500",
      status: "completed"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        if (prev < steps.length - 1) {
          setCompletedSteps(curr => [...curr, prev]);
        } else {
          // Reset after completing all steps
          setCompletedSteps([]);
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">Live Booking Pipeline</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Auto-generating
        </Badge>
      </div>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = completedSteps.includes(index);
          const IconComponent = step.icon;

          return (
            <div key={step.id} className="relative">
              <Card className={`transition-all duration-500 ${
                isActive 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : isCompleted 
                    ? 'bg-muted/50 opacity-70' 
                    : 'opacity-50'
              }`}>
                <CardContent className="p-4 space-y-3">
                  {/* Step Icon */}
                  <div className={`h-10 w-10 rounded-lg ${step.color} flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'animate-pulse' : ''
                  }`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>

                  {/* Step Content */}
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-foreground">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                  </div>

                  {/* Step Description */}
                  <div className="min-h-[40px]">
                    <p className={`text-xs transition-all duration-300 ${
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isActive ? (
                      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted"></div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isCompleted ? 'Done' : isActive ? 'Processing...' : 'Pending'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <ArrowRight className={`h-4 w-4 transition-all duration-300 ${
                    isCompleted ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary */}
      <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Campaign: Christmas Promo 2025</p>
              <p className="text-xs text-muted-foreground">Automated pipeline processing in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {completedSteps.length}/{steps.length} Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Booking Details - Show when finalization is complete */}
      {completedSteps.includes(4) && (
        <div className="mt-6 p-6 rounded-lg bg-card border border-border">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-foreground">Booking Completed Successfully</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Client Details */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Client Details</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><span className="font-medium">Company:</span> Example Corp</p>
                <p><span className="font-medium">Contact:</span> Jane Doe</p>
                <p><span className="font-medium">Email:</span> jane@example.com</p>
                <p><span className="font-medium">Phone:</span> +65 1234 5678</p>
                <p><span className="font-medium">Industry:</span> Retail</p>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Campaign Details</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><span className="font-medium">Name:</span> Christmas Promo 2025</p>
                <p><span className="font-medium">Ref:</span> {(() => {
                  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
                  let result = 'CP-';
                  for (let i = 0; i < 5; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  return result;
                })()}</p>
                <p><span className="font-medium">Start:</span> 2025-12-01</p>
                <p><span className="font-medium">End:</span> 2025-12-31</p>
                <p><span className="font-medium">Media:</span> Newspaper Ad</p>
              </div>
            </div>

            {/* Financials */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Financials</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><span className="font-medium">Gross:</span> $50,000</p>
                <p><span className="font-medium">Discount:</span> 10%</p>
                <p><span className="font-medium">Additional:</span> $2,000</p>
                <p><span className="font-medium text-green-600">Net Amount:</span> $47,000</p>
              </div>
            </div>

            {/* Review & Confirm */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Review & Confirm</h4>
              <div className="space-y-1 text-muted-foreground">
                <p><span className="font-medium">Signatory:</span> John Smith</p>
                <p><span className="font-medium">Title:</span> Marketing Director</p>
                <p><span className="font-medium">Signed:</span> 2025-10-01</p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600">Confirmed</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPipelineDemo;