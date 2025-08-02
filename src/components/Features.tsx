
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Layers, Grid3x3, ListCheck, BookOpen, Star, LayoutDashboard } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  
  const features = [
    {
      title: "Booking Dashboard",
      description: "Track all bookings with a live status timeline and instant updates.",
      expandedDescription: "Manage all your media bookings in one centralized dashboard. Monitor booking progress with real-time status updates from submission to confirmation. Filter and search through campaigns, view PDF previews, and track all activity logs in one place.",
      icon: (
        <LayoutDashboard size={24} className="text-cosmic-accent" />
      )
    },
    {
      title: "PDF Generation & Preview",
      description: "Generate MediaCo order forms and preview them instantly without downloading.",
      expandedDescription: "Automatically generate professional insertion order PDFs with all booking details. Preview documents directly in your browser before submission. Status watermarks update automatically as bookings progress through different stages.",
      icon: (
        <BookOpen size={24} className="text-cosmic-accent" />
      )
    },
    {
      title: "Real-Time Chat",
      description: "Collaborate with a simulated sales rep directly in-app with instant messaging.",
      expandedDescription: "Communicate directly with the sales team through integrated chat functionality. Get instant responses for booking confirmations, change requests, and status updates. All chat messages are logged in the booking timeline for complete transparency.",
      icon: (
        <Grid3x3 size={24} className="text-cosmic-accent" />
      )
    },
    {
      title: "Activity Logs & Notifications",
      description: "Stay informed with every action logged and instant notifications for updates.",
      expandedDescription: "Comprehensive activity tracking for every booking event. Get real-time notifications for status changes, chat messages, and confirmations. Detailed logs show submission times, PDF generation, and all communication history.",
      icon: (
        <ListCheck size={24} className="text-cosmic-accent" />
      )
    },
    {
      title: "Creative Uploads",
      description: "Attach creative files or link them directly in the booking form.",
      expandedDescription: "Upload creative assets directly through the platform or provide external links. Support for multiple file formats with secure storage. Preview and manage all creative assets associated with each booking campaign.",
      icon: (
        <Layers size={24} className="text-cosmic-accent" />
      )
    },
    {
      title: "Search & Filters",
      description: "Find and manage bookings efficiently with powerful search and filtering tools.",
      expandedDescription: "Quickly locate specific bookings by client name, campaign reference, or status. Advanced filtering options help you organize and manage large volumes of bookings. Sort by date, amount, or any custom criteria to streamline your workflow.",
      icon: (
        <Star size={24} className="text-cosmic-accent" />
      )
    }
  ];
  
  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };
  
  return (
    <section id="features" className="w-full py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">
            Everything your booking workflow needs
          </h2>
          <p className="text-cosmic-muted text-lg">
            Comprehensive booking automation to streamline your media operations and drive efficiency
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Collapsible
              key={index}
              open={openFeature === index}
              onOpenChange={() => toggleFeature(index)}
              className={`rounded-xl border ${openFeature === index ? 'border-cosmic-light/40' : 'border-cosmic-light/20'} cosmic-gradient transition-all duration-300`}
            >
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-cosmic-light/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-cosmic-muted transition-transform duration-200 ${
                      openFeature === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3">{feature.title}</h3>
                <p className="text-cosmic-muted">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-cosmic-light/10">
                  <p className="text-cosmic-muted">{feature.expandedDescription}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-cosmic-accent hover:text-cosmic-accent/80 text-sm font-medium">
                      Learn more →
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
