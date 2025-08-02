import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import DashboardLayout from '@/components/DashboardLayout';
import { BookingPDFView } from '@/components/BookingPDFView';
import html2pdf from 'html2pdf.js';
import {
  Upload,
  FileText,
  User,
  Building,
  Calendar as CalendarIcon,
  DollarSign,
  Eye,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  X,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bookingsAPI, aiAPI } from '@/lib/api';

const CreateBooking = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsed, setIsParsed] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [fromChat, setFromChat] = useState(false);
  const [formData, setFormData] = useState({
    // Client Details
    clientName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    industrySegment: '',
    taxRegistrationNo: '',
    
    // Campaign Details
    campaignName: '',
    campaignRef: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    creativeDeliveryDate: null as Date | null,
    mediaType: '',
    placementPreferences: '',
    
    // Financials
    grossAmount: 0,
    partnerDiscount: 0,
    additionalCharges: 0,
    netAmount: 0,
    
    // Creative & Instructions
    creativeFileLink: '',
    creativeSpecs: '',
    specialInstructions: '',
    
    // Authorization
    signatoryName: '',
    signatoryTitle: '',
    signatureDate: new Date()
  });

  const steps = [
    { id: 0, title: 'Campaign Info', icon: Building, description: 'Enter campaign details' },
    { id: 1, title: 'PDF Upload & Parsing', icon: Upload, description: 'Upload and parse your booking PDF' },
    { id: 2, title: 'Client Details', icon: User, description: 'Verify client information' },
    { id: 3, title: 'Campaign Details', icon: Building, description: 'Set campaign parameters' },
    { id: 4, title: 'Financials', icon: DollarSign, description: 'Configure pricing and costs' },
    { id: 5, title: 'Review & Confirm', icon: CheckCircle, description: 'Final review and submission' }
  ];

  useEffect(() => {
    // Check if data is coming from chat
    const chatData = sessionStorage.getItem('chatBookingData');
    if (chatData) {
      const parsedData = JSON.parse(chatData);
      setFromChat(true);
      
      // Convert string dates to Date objects
      const processedData = {
        ...parsedData,
        startDate: parsedData.startDate ? new Date(parsedData.startDate) : null,
        endDate: parsedData.endDate ? new Date(parsedData.endDate) : null,
        creativeDeliveryDate: parsedData.creativeDeliveryDate ? new Date(parsedData.creativeDeliveryDate) : null,
        signatureDate: parsedData.signatureDate ? new Date(parsedData.signatureDate) : new Date(),
      };
      
      setCampaignName(parsedData.campaignName || '');
      setCampaignDescription(parsedData.campaignDescription || '');
      setFormData(prev => ({ ...prev, ...processedData }));
      
      // Skip to final review step since all data is already collected
      setCurrentStep(5);
      
      // Clear session storage
      sessionStorage.removeItem('chatBookingData');
    }
  }, []);

  const sampleData = {
    clientName: "Example Corp",
    contactName: "Jane Doe",
    contactEmail: "jane@example.com",
    contactPhone: "+65 1234 5678",
    address: "123 Orchard Road, Singapore",
    industrySegment: "Retail",
    taxRegistrationNo: "12345678X",
    campaignRef: (() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
      let result = 'CP-';
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    })(),
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-31'),
    creativeDeliveryDate: new Date('2025-11-15'),
    mediaType: "Newspaper Ad",
    placementPreferences: "Front page",
    grossAmount: 50000,
    partnerDiscount: 10,
    additionalCharges: 2000,
    netAmount: 47000,
    creativeFileLink: "https://example.com/ad.pdf",
    creativeSpecs: "Full-page colour, 300 DPI",
    specialInstructions: "Run on weekends only",
    signatoryName: "John Smith",
    signatoryTitle: "Marketing Director",
    signatureDate: new Date()
  };

  const industryOptions = [
    'Retail', 'Technology', 'Healthcare', 'Finance', 'Education', 
    'Automotive', 'Real Estate', 'Food & Beverage', 'Travel', 'Entertainment'
  ];

  const mediaTypeOptions = [
    'Newspaper Ad', 'Digital Banner', 'Radio Spot', 'TV Commercial', 
    'Magazine Ad', 'Social Media', 'Outdoor Billboard', 'Email Campaign'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} is ready for parsing.`,
        });
      }, 1500);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
    }
  };

  const handleParsePDF = async () => {
    if (!uploadedFile) return;
    
    setIsParsing(true);
    
    try {
      // Upload PDF to Cloudinary first
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('upload_preset', 'products');
      
      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/djunaxxv0/image/upload', {
        method: 'POST',
        body: formData
      });
      
      const cloudinaryData = await cloudinaryResponse.json();
      
      if (!cloudinaryData.secure_url) {
        throw new Error('Failed to upload PDF to Cloudinary');
      }
      
      // Send PDF URL to API for extraction
      const response = await aiAPI.extractBookingDataFromPdf(cloudinaryData.secure_url);
      
      if (response.success && response.data) {
        // Map AI response to form data
        const aiData = response.data;
        const mappedData = {
          clientName: aiData.clientName || '',
          contactName: aiData.contactName || '',
          contactEmail: aiData.contactEmail || '',
          contactPhone: aiData.contactPhone || '',
          address: aiData.address || '',
          industrySegment: aiData.industrySegment || '',
          taxRegistrationNo: aiData.taxRegistrationNo || '',
          campaignName: aiData.campaignName || campaignName,
          campaignRef: aiData.campaignRef || '',
          startDate: aiData.startDate ? new Date(aiData.startDate) : null,
          endDate: aiData.endDate ? new Date(aiData.endDate) : null,
          creativeDeliveryDate: aiData.creativeDeliveryDate ? new Date(aiData.creativeDeliveryDate) : null,
          mediaType: aiData.mediaType || '',
          placementPreferences: aiData.placementPreferences || '',
          grossAmount: aiData.grossAmount || 0,
          partnerDiscount: aiData.partnerDiscount || 0,
          additionalCharges: aiData.additionalCharges || 0,
          netAmount: aiData.netAmount || 0,
          creativeFileLink: aiData.creativeFileLink || '',
          creativeSpecs: aiData.creativeSpecs || aiData.creativeSpecifications || '',
          specialInstructions: aiData.specialInstructions || '',
          signatoryName: aiData.signatoryName || '',
          signatoryTitle: aiData.signatoryTitle || '',
          signatureDate: aiData.signatureDate ? new Date(aiData.signatureDate) : new Date()
        };
        
        setFormData(prev => ({ ...prev, ...mappedData }));
        setIsParsed(true);
        
        toast({
          title: "PDF parsed successfully",
          description: "Booking details have been extracted and pre-filled using AI.",
        });
      } else {
        // Fallback to sample data if AI extraction fails
        setFormData(prev => ({ 
          ...prev, 
          ...sampleData,
          campaignName: campaignName
        }));
        setIsParsed(true);
        
        toast({
          title: "PDF parsed with sample data",
          description: response.error || "Used sample data as fallback. Please verify all fields.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      
      // Fallback to sample data on error
      setFormData(prev => ({ 
        ...prev, 
        ...sampleData,
        campaignName: campaignName
      }));
      setIsParsed(true);
      
      toast({
        title: "PDF parsing failed",
        description: "Used sample data as fallback. Please verify all fields.",
        variant: "destructive"
      });
    } finally {
      setIsParsing(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate net amount when financial fields change
      if (['grossAmount', 'partnerDiscount', 'additionalCharges'].includes(field)) {
        const gross = field === 'grossAmount' ? value : newData.grossAmount;
        const discount = field === 'partnerDiscount' ? value : newData.partnerDiscount;
        const charges = field === 'additionalCharges' ? value : newData.additionalCharges;
        
        newData.netAmount = gross - (gross * discount / 100) + charges;
      }
      
      return newData;
    });
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return campaignName.trim() !== '' && campaignDescription.trim() !== '';
      case 1:
        return uploadedFile !== null && isParsed;
      case 2:
        return formData.clientName && formData.contactName && formData.contactEmail && 
               formData.contactPhone && formData.address && formData.industrySegment && 
               formData.taxRegistrationNo;
      case 3:
        return formData.campaignName && formData.campaignRef && formData.startDate && 
               formData.endDate && formData.creativeDeliveryDate && formData.mediaType;
      case 4:
        return formData.grossAmount > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !isParsed) {
      toast({
        title: "Parse the PDF first",
        description: "Please parse the uploaded PDF before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    // If coming from chat, don't allow going back to PDF upload step
    if (fromChat && currentStep === 5) {
      setCurrentStep(4); // Go to financials step instead
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'products');
    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/djunaxxv0/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      return result.secure_url;
    } catch (err) {
      console.error('PDF upload failed:', err);
      return '';
    }
  };

  const handleSubmit = async () => {
    try {
      // Show first toast - submitted to sales rep team
      toast({
        title: "Submitted to sales rep team",
        description: "Your booking has been submitted for review.",
      });

      // Wait a moment, then show second toast - PDF generating
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "PDF is generating...",
        description: "Creating professional booking document.",
      });

      // Generate modern campaign reference with CP- format (5 random chars/numbers)
      const generateCampaignRef = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let result = 'CP-';
        for (let i = 0; i < 5; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const campaignRef = formData.campaignRef || generateCampaignRef();
      
      // Update form data with generated campaign reference
      if (!formData.campaignRef) {
        setFormData(prev => ({ ...prev, campaignRef }));
      }

      // Create ultra-modern invoice-style PDF template
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = `
        <div style="font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; padding: 32px; background: #ffffff; width: 760px; line-height: 1.5; color: #1a1a1a;">
          
          <!-- Modern Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 3px solid #2563eb;">
            <div>
              <h1 style="color: #2563eb; font-size: 36px; font-weight: 800; margin: 0; letter-spacing: -1px;">MediaCo</h1>
            </div>
            <div style="background: linear-gradient(135deg, #f8fafc, #e2e8f0); padding: 20px 24px; border-radius: 16px; border: 1px solid #cbd5e1; text-align: center; min-width: 180px;">
              <div style="color: #2563eb; font-size: 20px; font-weight: 700; margin-bottom: 4px;">
                ${campaignRef}
              </div>
              <div style="color: #64748b; font-size: 13px; font-weight: 500;">
                ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                ✓ SUBMITTED
              </div>
            </div>
          </div>

          <!-- Client Information Table -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #1E293B; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center;">
              <span style="background: #1E40AF; color: white; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px;">👤</span>
              Client Information
            </h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; width: 200px;">Client Name</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.clientName || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">Contact Person</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.contactName || 'Not specified'}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0;">Email Address</td>
                <td style="padding: 16px 20px; color: #1E40AF; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.contactEmail || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">Phone Number</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.contactPhone || 'Not specified'}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0;">Company Address</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.address || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; background: #F8FAFC;">Industry Segment</td>
                <td style="padding: 16px 20px; color: #1E293B; font-weight: 500;">${formData.industrySegment || 'Not specified'}</td>
              </tr>
            </table>
          </div>

          <!-- Campaign Details Table -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #1E293B; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center;">
              <span style="background: #059669; color: white; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px;">📋</span>
              Campaign Details
            </h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; width: 200px;">Campaign Name</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 600; font-size: 16px;">${campaignName || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">Reference ID</td>
                <td style="padding: 16px 20px; color: #1E40AF; border-bottom: 1px solid #E2E8F0; font-weight: 600;">${campaignRef}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0;">📅 Start Date</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">📅 End Date</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0;">Media Type</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.mediaType || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; background: #F8FAFC;">📅 Creative Delivery</td>
                <td style="padding: 16px 20px; color: #1E293B; font-weight: 500;">${formData.creativeDeliveryDate ? new Date(formData.creativeDeliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</td>
              </tr>
            </table>
          </div>

          <!-- Financial Summary -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #1E293B; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center;">
              <span style="background: #DC2626; color: white; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px;">💰</span>
              Financial Summary
            </h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
              <tr style="background: #F8FAFC;">
                <td style="padding: 18px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; width: 300px;">Gross Amount</td>
                <td style="padding: 18px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 600; text-align: right; font-size: 16px;">$${(formData.grossAmount || 0).toLocaleString('en-US')}</td>
              </tr>
              <tr>
                <td style="padding: 18px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">Partner Discount (${formData.partnerDiscount || 0}%)</td>
                <td style="padding: 18px 20px; color: #DC2626; border-bottom: 1px solid #E2E8F0; font-weight: 600; text-align: right; font-size: 16px;">-$${((formData.grossAmount || 0) * (formData.partnerDiscount || 0) / 100).toLocaleString('en-US')}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 18px 20px; font-weight: 600; color: #475569; border-bottom: 2px solid #E2E8F0;">Additional Charges</td>
                <td style="padding: 18px 20px; color: #1E293B; border-bottom: 2px solid #E2E8F0; font-weight: 600; text-align: right; font-size: 16px;">$${(formData.additionalCharges || 0).toLocaleString('en-US')}</td>
              </tr>
              <tr style="background: linear-gradient(135deg, #FEF3C7, #FDE047); border: 2px solid #F59E0B;">
                <td style="padding: 20px; font-weight: 700; color: #92400E; font-size: 18px;">💎 Net Amount</td>
                <td style="padding: 20px; color: #92400E; font-weight: 700; text-align: right; font-size: 22px;">$${(formData.netAmount || 0).toLocaleString('en-US')}</td>
              </tr>
            </table>
          </div>

          <!-- Authorization Section -->
          <div style="margin-bottom: 40px;">
            <h3 style="color: #1E293B; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: flex; align-items: center;">
              <span style="background: #7C3AED; color: white; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px;">✍️</span>
              Authorization
            </h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; width: 200px;">Signatory Name</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.signatoryName || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; font-weight: 600; color: #475569; border-bottom: 1px solid #E2E8F0; background: #F8FAFC;">Title/Position</td>
                <td style="padding: 16px 20px; color: #1E293B; border-bottom: 1px solid #E2E8F0; font-weight: 500;">${formData.signatoryTitle || 'Not specified'}</td>
              </tr>
              <tr style="background: #F8FAFC;">
                <td style="padding: 16px 20px; font-weight: 600; color: #475569;">Digital Signature</td>
                <td style="padding: 16px 20px; color: #059669; font-weight: 600;">✓ Digitally Signed & Submitted</td>
              </tr>
            </table>
          </div>

          <!-- Status Timeline -->
          <div style="margin-bottom: 40px; background: linear-gradient(135deg, #F0F9FF, #E0F2FE); padding: 24px; border-radius: 12px; border: 1px solid #7DD3FC;">
            <h3 style="color: #0369A1; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">📈 Booking Status</h3>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="text-align: center; flex: 1;">
                <div style="width: 32px; height: 32px; background: #0EA5E9; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);">✓</div>
                <div style="font-size: 13px; font-weight: 600; color: #0369A1;">Submitted</div>
                <div style="font-size: 11px; color: #0284C7;">${new Date().toLocaleDateString()}</div>
              </div>
              <div style="flex: 1; height: 2px; background: #BAE6FD; margin: 0 8px;"></div>
              <div style="text-align: center; flex: 1;">
                <div style="width: 32px; height: 32px; background: #0EA5E9; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 8px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);">📄</div>
                <div style="font-size: 13px; font-weight: 600; color: #0369A1;">PDF Generated</div>
                <div style="font-size: 11px; color: #0284C7;">Just now</div>
              </div>
              <div style="flex: 1; height: 2px; background: #BAE6FD; margin: 0 8px;"></div>
              <div style="text-align: center; flex: 1;">
                <div style="width: 32px; height: 32px; background: #94A3B8; color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; margin-bottom: 8px;">⏳</div>
                <div style="font-size: 13px; font-weight: 600; color: #64748B;">Under Review</div>
                <div style="font-size: 11px; color: #64748B;">Pending</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #F8FAFC; padding: 24px; text-align: center; font-size: 13px; color: #64748B; border-radius: 12px; border: 1px solid #E2E8F0; margin-top: 40px;">
            <div style="font-weight: 600; color: #1E293B; margin-bottom: 8px;">📍 MediaCo Digital Media Solutions</div>
            <div style="margin-bottom: 4px;">123 Fictional Road, Singapore 000000</div>
            <div>📧 salesrep@mediaco.test | 🌐 www.mediaco.test</div>
          </div>
        </div>
      `;

      // Append to body temporarily
      document.body.appendChild(tempContainer);

      // Generate PDF with optimized settings to prevent empty pages
      const opt = {
        margin: [0.3, 0.3, 0.3, 0.3],
        filename: `MediaCo-Order-${campaignRef}.pdf`,
        image: { type: 'jpeg', quality: 0.92 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: 800,
          windowHeight: 1200
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true,
          putOnlyUsedFonts: true
        }
      };

      const pdfBlob = await html2pdf().set(opt).from(tempContainer.firstElementChild).outputPdf('blob');
      
      // Clean up
      document.body.removeChild(tempContainer);
      const pdfFile = new File([pdfBlob], `MediaCo-Order-${campaignRef}.pdf`, {
        type: 'application/pdf',
      });

      // Upload PDF to Cloudinary
      const pdfUrl = await uploadToCloudinary(pdfFile);
      
      if (!pdfUrl) {
        throw new Error('Failed to upload PDF');
      }

      // Now create the booking with the PDF URL
      const bookingData = {
        campaign_name: formData.campaignName || campaignName,
        campaign_reference: campaignRef,
        client_name: formData.clientName,
        client_email: formData.contactEmail,
        client_phone: formData.contactPhone,
        client_company: formData.clientName,
        campaign_description: campaignDescription,
        media_type: formData.mediaType,
        gross_amount: formData.grossAmount,
        commission_percentage: formData.partnerDiscount,
        commission_amount: (formData.grossAmount * formData.partnerDiscount) / 100,
        vat_percentage: 0,
        vat_amount: 0,
        net_amount: formData.netAmount,
        start_date: formData.startDate?.toISOString().split('T')[0],
        end_date: formData.endDate?.toISOString().split('T')[0],
        industry_segment: formData.industrySegment,
        creative_specifications: formData.creativeSpecs,
        authorization_required: !!formData.signatoryName,
        pdf_url: pdfUrl, // Include the PDF URL
        // Missing fields added
        address: formData.address,
        tax_registration_no: formData.taxRegistrationNo,
        creative_delivery_date: formData.creativeDeliveryDate?.toISOString().split('T')[0],
        placement_preferences: formData.placementPreferences,
        creative_file_link: formData.creativeFileLink,
        special_instructions: formData.specialInstructions,
        signatory_name: formData.signatoryName,
        signatory_title: formData.signatoryTitle,
        signature_date: formData.signatureDate?.toISOString().split('T')[0]
      };

      const response = await bookingsAPI.createBooking(bookingData);
      
      if (response.success) {
        const bookingId = response.data?.booking_id;
        
        toast({
          title: "Booking created successfully!",
          description: "PDF generated and sent to sales rep inbox. You'll receive updates shortly.",
        });

        // Send email notification with booking details
        if (bookingId) {
          try {
            await bookingsAPI.sendBookingEmailWithUserId(bookingId);
            toast({
              title: "Email sent!",
              description: "Booking confirmation email has been sent to configured recipients.",
            });
          } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Don't show error toast for email failure, booking was still created successfully
          }
        }
        
        // Redirect to bookings page or clear form
        window.location.href = '/bookings';
      } else {
        toast({
          title: "Error creating booking",
          description: response.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      toast({
        title: "Error",
        description: `Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Campaign Information</h3>
              <p className="text-muted-foreground">Start by entering your campaign name and description</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignDescription">Campaign Description *</Label>
                <Textarea
                  id="campaignDescription"
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Describe your campaign objectives and target audience"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Booking PDF</h3>
              <p className="text-muted-foreground">Upload your booking PDF and we'll extract the details automatically</p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {!uploadedFile ? (
                <div>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Drag and drop your PDF here, or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button asChild variant="outline">
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      Choose PDF File
                    </label>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{uploadedFile.name}</span>
                    {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {!isUploading && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                  
                  {!isUploading && (
                    <Button 
                      onClick={handleParsePDF} 
                      disabled={isParsing}
                      className="w-full"
                    >
                      {isParsing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Parsing PDF...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Parse PDF
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Client Details</h3>
              <p className="text-muted-foreground">Verify and edit client information extracted from the PDF</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => updateFormData('clientName', e.target.value)}
                  placeholder="Enter client name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => updateFormData('contactName', e.target.value)}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => updateFormData('contactPhone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Enter complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industrySegment">Industry Segment *</Label>
                <Select value={formData.industrySegment} onValueChange={(value) => updateFormData('industrySegment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRegistrationNo">Tax Registration No *</Label>
                <Input
                  id="taxRegistrationNo"
                  value={formData.taxRegistrationNo}
                  onChange={(e) => updateFormData('taxRegistrationNo', e.target.value)}
                  placeholder="Enter tax registration number"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Campaign Details</h3>
              <p className="text-muted-foreground">Set up your campaign parameters and timeline</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignNameForm">Campaign Name *</Label>
                <Input
                  id="campaignNameForm"
                  value={formData.campaignName || campaignName}
                  onChange={(e) => updateFormData('campaignName', e.target.value)}
                  placeholder="Enter campaign name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignRef">Campaign Reference ID *</Label>
                <Input
                  id="campaignRef"
                  value={formData.campaignRef}
                  onChange={(e) => updateFormData('campaignRef', e.target.value)}
                  placeholder="Enter reference ID"
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !formData.startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate || undefined}
                      onSelect={(date) => updateFormData('startDate', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !formData.endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate || undefined}
                      onSelect={(date) => updateFormData('endDate', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Creative Delivery Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !formData.creativeDeliveryDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.creativeDeliveryDate ? format(formData.creativeDeliveryDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.creativeDeliveryDate || undefined}
                      onSelect={(date) => updateFormData('creativeDeliveryDate', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaType">Media Type *</Label>
                <Select value={formData.mediaType} onValueChange={(value) => updateFormData('mediaType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mediaTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="placementPreferences">Placement Preferences</Label>
                <Textarea
                  id="placementPreferences"
                  value={formData.placementPreferences}
                  onChange={(e) => updateFormData('placementPreferences', e.target.value)}
                  placeholder="Enter placement preferences"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Financials</h3>
              <p className="text-muted-foreground">Configure pricing and financial breakdown</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grossAmount">Gross Amount ($) *</Label>
                  <Input
                    id="grossAmount"
                    type="number"
                    value={formData.grossAmount}
                    onChange={(e) => updateFormData('grossAmount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter gross amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerDiscount">Partner Discount (%)</Label>
                  <Input
                    id="partnerDiscount"
                    type="number"
                    value={formData.partnerDiscount}
                    onChange={(e) => updateFormData('partnerDiscount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter discount percentage"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalCharges">Additional Charges ($)</Label>
                  <Input
                    id="additionalCharges"
                    type="number"
                    value={formData.additionalCharges}
                    onChange={(e) => updateFormData('additionalCharges', parseFloat(e.target.value) || 0)}
                    placeholder="Enter additional charges"
                  />
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Gross Amount:</span>
                    <span>${formData.grossAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partner Discount ({formData.partnerDiscount}%):</span>
                    <span>-${((formData.grossAmount * formData.partnerDiscount) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Charges:</span>
                    <span>+${formData.additionalCharges.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Net Amount:</span>
                    <span>${formData.netAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review & Confirm</h3>
              <p className="text-muted-foreground">Review all details before submitting your booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Campaign Information
                    <Button variant="outline" size="sm" onClick={() => setCurrentStep(0)}>Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {campaignName}</div>
                  <div><strong>Description:</strong> {campaignDescription}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Client Details
                    <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Client:</strong> {formData.clientName}</div>
                  <div><strong>Contact:</strong> {formData.contactName}</div>
                  <div><strong>Email:</strong> {formData.contactEmail}</div>
                  <div><strong>Phone:</strong> {formData.contactPhone}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Campaign Details
                    <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Campaign:</strong> {formData.campaignName || campaignName}</div>
                  <div><strong>Reference:</strong> {formData.campaignRef}</div>
                  <div><strong>Start Date:</strong> {formData.startDate ? format(formData.startDate, "PPP") : 'Not set'}</div>
                  <div><strong>End Date:</strong> {formData.endDate ? format(formData.endDate, "PPP") : 'Not set'}</div>
                  <div><strong>Media Type:</strong> {formData.mediaType}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Financial Summary
                    <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)}>Edit</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Gross Amount:</strong> ${formData.grossAmount.toLocaleString()}</div>
                  <div><strong>Partner Discount:</strong> {formData.partnerDiscount}%</div>
                  <div><strong>Additional Charges:</strong> ${formData.additionalCharges.toLocaleString()}</div>
                  <div className="pt-2 border-t"><strong>Net Amount:</strong> ${formData.netAmount.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button onClick={handleSubmit} size="lg" className="px-8">
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm & Submit Booking
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Create New Booking</h2>
              <Badge variant="secondary">Step {currentStep + 1} of {steps.length}</Badge>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    index <= currentStep 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "border-muted-foreground text-muted-foreground"
                  )}>
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 transition-colors",
                      index < currentStep ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={nextStep} 
            disabled={!validateStep(currentStep) || currentStep === steps.length - 1}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateBooking;