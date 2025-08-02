import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Send, 
  Bot, 
  User, 
  CheckCircle,
  Edit,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface BookingData {
  campaignName?: string;
  campaignDescription?: string;
  campaignRef?: string;
  clientName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  industrySegment?: string;
  taxRegistrationNo?: string;
  startDate?: string;
  endDate?: string;
  creativeDeliveryDate?: string;
  mediaType?: string;
  placementPreferences?: string;
  grossAmount?: number;
  partnerDiscount?: number;
  additionalCharges?: number;
  netAmount?: number;
  creativeFileLink?: string;
  creativeSpecs?: string;
  specialInstructions?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  signatureDate?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyCUzUYRE5u36bg2BFa93BA4WDyg0OPXIwo');

  const chatFlow = [
    { field: 'campaignName', question: "Hi! 👋 Let's create a new booking. What's the name of the campaign you'd like to create?" },
    { field: 'campaignDescription', question: "Please provide Campaign Description." },
    { field: 'clientName', question: "What's the client's company name?" },
    { field: 'contactName', question: "Who's the contact person for this booking?" },
    { field: 'contactEmail', question: "What's their email address?" },
    { field: 'contactPhone', question: "What's their phone number?" },
    { field: 'address', question: "What's the company address?" },
    { field: 'industrySegment', question: "Select the industry segment (Retail, Tech, Healthcare, Finance, etc.)." },
    { field: 'taxRegistrationNo', question: "Provide the client's tax registration number." },
    { field: 'startDate', question: "When does the campaign start? (YYYY-MM-DD format)" },
    { field: 'endDate', question: "When does the campaign end? (YYYY-MM-DD format)" },
    { field: 'creativeDeliveryDate', question: "When will the creative be delivered? (YYYY-MM-DD format)" },
    { field: 'mediaType', question: "What's the media type? (e.g., Newspaper Ad, Digital Banner, Radio, etc.)" },
    { field: 'placementPreferences', question: "Any placement preferences? (optional)" },
    { field: 'grossAmount', question: "What's the gross amount for this booking?" },
    { field: 'partnerDiscount', question: "Any partner discount percentage? (enter 0 if none)" },
    { field: 'additionalCharges', question: "Any additional charges? (enter 0 if none)" },
    { field: 'creativeFileLink', question: "Provide the creative file link or URL." },
    { field: 'creativeSpecs', question: "Add creative specifications (e.g., Full-page colour, 300 DPI)." },
    { field: 'specialInstructions', question: "Any special instructions? (optional)" },
    { field: 'signatoryName', question: "Who's the authorized signatory?" },
    { field: 'signatoryTitle', question: "What's their job title?" },
    { field: 'signatureDate', question: "When is the signature date? (YYYY-MM-DD format)" }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      startNewChat();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setBookingData({});
    setIsCompleted(false);
    
    setTimeout(() => {
      addBotMessage(chatFlow[0].question);
    }, 500);
  };

  const addBotMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const validateWithGemini = async (field: string, userInput: string): Promise<{ isValid: boolean; extractedValue?: string; error?: string }> => {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const fieldDescriptions: { [key: string]: string } = {
        campaignName: "a campaign name (should be a meaningful title for the advertising campaign)",
        campaignDescription: "a campaign description (should explain what the campaign is about)",
        clientName: "a company name (should be the official business name of the client)",
        contactName: "a person's full name (should be first and last name of the contact person)",
        contactEmail: "a valid email address (should be in proper email format)",
        contactPhone: "a phone number (should be a valid phone number with area code)",
        address: "a complete business address (should include street, city, and relevant location details)",
        industrySegment: "an industry segment (should be one of: Retail, Tech, Healthcare, Finance, Manufacturing, Education, Entertainment, or similar)",
        taxRegistrationNo: "a tax registration number (should be a valid business tax ID)",
        startDate: "a date in YYYY-MM-DD format (should be a valid future or current date)",
        endDate: "a date in YYYY-MM-DD format (should be a valid date after the start date)",
        creativeDeliveryDate: "a date in YYYY-MM-DD format (should be a valid date)",
        mediaType: "a media type (should be something like: Newspaper Ad, Digital Banner, Radio Ad, TV Commercial, Social Media, etc.)",
        placementPreferences: "placement preferences (optional field, can be any specific requirements)",
        grossAmount: "a monetary amount (should be a positive number)",
        partnerDiscount: "a discount percentage (should be a number between 0-100)",
        additionalCharges: "additional charges amount (should be a number, can be 0)",
        creativeFileLink: "a file link or URL (should be a valid URL or file path)",
        creativeSpecs: "creative specifications (should describe technical requirements like size, format, DPI, etc.)",
        specialInstructions: "special instructions (optional field, can be any additional requirements)",
        signatoryName: "a person's full name (should be the name of the authorized signatory)",
        signatoryTitle: "a job title (should be a professional title like Manager, Director, CEO, etc.)",
        signatureDate: "a date in YYYY-MM-DD format (should be a valid date)"
      };

      const prompt = `
        You are validating user input for a booking form field.
        
        Field: ${field}
        Expected: ${fieldDescriptions[field]}
        User Input: "${userInput}"
        
        Rules:
        1. If the input contains actual information for the field, respond with: VALID: [extracted clean value]
        2. Mark as INVALID if the input indicates they don't know, are asking questions, or is meaningless
        
        ACCEPT as valid:
        - Actual names like "CCL ltd.", "Media Co", "John Doe"
        - Real descriptions like "promotional campaign", "brand awareness campaign"
        - Company names used as campaign names
        - Brief but meaningful responses that answer the question
        
        REJECT as invalid:
        - Questions like "can I check from my ebook", "where do I find this"
        - Statements of not knowing like "I forget", "I don't know", "not sure"
        - Meaningless responses like "hey hii", "??", random characters
        - Requests for help or clarification
        
        For text fields, extract the clean, essential information. For example:
        - "My company name is ABC Corp" → extract "ABC Corp"
        - "CCL ltd." → extract "CCL ltd."
        - "I forget it can I check from my ebook" → mark as invalid (asking question)
        - "I don't know the company name" → mark as invalid
        
        For dates, ensure they are in YYYY-MM-DD format.
        For emails, ensure proper email format.
        For numbers, extract just the numeric value.
        
        Only accept responses that actually provide information for the requested field.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      
      if (response.startsWith('VALID:')) {
        const extractedValue = response.replace('VALID:', '').trim();
        return { isValid: true, extractedValue };
      } else if (response.startsWith('INVALID:')) {
        const error = response.replace('INVALID:', '').trim();
        return { isValid: false, error };
      } else {
        return { isValid: false, error: "Unable to validate the input. Please try again." };
      }
    } catch (error) {
      console.error('Gemini validation error:', error);
      return { isValid: false, error: "Validation service is temporarily unavailable. Please try again." };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isValidating) return;

    addUserMessage(inputValue);
    setIsValidating(true);
    
    const currentField = chatFlow[currentStep].field;
    const userInput = inputValue.trim();

    // No validation message - just show loading state

    try {
      // Validate with Gemini AI
      const validation = await validateWithGemini(currentField, userInput);
      
      if (validation.isValid && validation.extractedValue) {
        let processedValue = validation.extractedValue;

        // Update booking data
        const updatedData = { ...bookingData, [currentField]: processedValue };
        
        // Calculate net amount if we have financial data
        if (currentField === 'additionalCharges' || (updatedData.grossAmount && updatedData.partnerDiscount !== undefined && updatedData.additionalCharges !== undefined)) {
          const gross = Number(updatedData.grossAmount) || 0;
          const discount = Number(updatedData.partnerDiscount) || 0;
          const additional = Number(updatedData.additionalCharges) || 0;
          updatedData.netAmount = gross - (gross * discount / 100) + additional;
          
          setTimeout(() => {
            addBotMessage(`✅ Got it! ${currentField.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${processedValue}`);
            if (currentField === 'additionalCharges') {
              addBotMessage(`Net amount calculated: $${updatedData.netAmount?.toFixed(2)}`);
            }
          }, 1000);
        } else {
          setTimeout(() => {
            addBotMessage(`✅ Got it! ${currentField.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${processedValue}`);
          }, 1000);
        }

        setBookingData(updatedData);
        setInputValue('');

        // Move to next step or complete
        if (currentStep < chatFlow.length - 1) {
          setTimeout(() => {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            addBotMessage(chatFlow[nextStep].question);
          }, 2000);
        } else {
          setTimeout(() => {
            redirectToBookingPage(updatedData);
          }, 2000);
        }
      } else {
        // Invalid input - show error and repeat question
        setTimeout(() => {
          addBotMessage(`❌ ${validation.error || 'Please provide valid information.'}`);
          setTimeout(() => {
            addBotMessage(chatFlow[currentStep].question);
          }, 1000);
        }, 1000);
        setInputValue('');
      }
    } catch (error) {
      setTimeout(() => {
        addBotMessage("⚠️ There was an issue validating your input. Please try again.");
        setTimeout(() => {
          addBotMessage(chatFlow[currentStep].question);
        }, 1000);
      }, 1000);
      setInputValue('');
    }

    setIsValidating(false);
  };

  const redirectToBookingPage = (data: BookingData) => {
    // Generate reference ID if not provided
    const refId = `CP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Prepare data for create booking page
    const completeData = {
      ...data,
      campaignRef: refId,
      fromChat: true
    };
    
    // Store in sessionStorage to pass to create booking page
    sessionStorage.setItem('chatBookingData', JSON.stringify(completeData));
    
    // Show completion message
    addBotMessage("🎉 Perfect! All information collected. Redirecting you to complete your booking...");
    
    // Navigate to create booking page after a short delay
    setTimeout(() => {
      navigate('/create-booking');
    }, 2000);
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={startNewChat} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Sales Rep Bot
            {!isCompleted && (
              <Badge variant="secondary">
                Step {currentStep + 1} of {chatFlow.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator while validating */}
            {isValidating && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted text-foreground">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>


          {/* Input Area */}
          {!isCompleted && (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isValidating ? "Validating..." : "Type your response..."}
                className="flex-1"
                disabled={isValidating}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isValidating}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Chat;