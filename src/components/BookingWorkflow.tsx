import React from 'react';
import { FileText, MessageSquare, CheckCircle, Upload } from 'lucide-react';

const BookingWorkflow = () => {
  const steps = [
    {
      number: 1,
      title: "Fill out the booking form",
      description: "Complete our intuitive multi-step form with client details, campaign information, financials, and creative specifications.",
      icon: <FileText size={32} className="text-primary" />
    },
    {
      number: 2,
      title: "PDF auto-generated & sent",
      description: "MediaCo insertion order PDF is automatically generated with all booking details and sent to our sales rep inbox.",
      icon: <Upload size={32} className="text-primary" />
    },
    {
      number: 3,
      title: "Real-time chat & collaboration",
      description: "Communicate directly with the sales team through integrated chat. Get instant responses and confirmations.",
      icon: <MessageSquare size={32} className="text-primary" />
    },
    {
      number: 4,
      title: "Booking finalized with timeline",
      description: "Track your booking status with a clear timeline from submission to confirmation. All activities logged.",
      icon: <CheckCircle size={32} className="text-primary" />
    }
  ];

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Simple 4-Step Booking Workflow
          </h2>
          <p className="text-muted-foreground text-lg">
            From submission to confirmation, our streamlined process handles everything automatically
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/60 to-primary/20 z-0"></div>
              )}
              
              <div className="relative z-10 text-center space-y-4">
                {/* Step number and icon */}
                <div className="mx-auto w-20 h-20 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                  {step.icon}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-medium tracking-tighter text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            Human-in-the-loop automation ensures quality control
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingWorkflow;