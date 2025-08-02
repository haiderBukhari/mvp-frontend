import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  FileText, 
  Mail, 
  Edit, 
  Trash2, 
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Building,
  Calendar,
  DollarSign,
  FileImage,
  Loader2,
  Eye,
  Plus,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bookingsAPI, BookingDetails as BookingDetailsType, settingsAPI } from '@/lib/api';
import DashboardLayout from '@/components/DashboardLayout';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadBookingDetails();
      loadEmailSettings();
    }
  }, [id]);

  const loadBookingDetails = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const response = await bookingsAPI.getBookingDetails(id);
      if (response.success) {
        setBooking(response.data || null);
      } else {
        toast({
          title: "Error loading booking",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load booking details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.success && response.data) {
        setEmailList(response.data.email_recipients || []);
      } else {
        setEmailList(['salesrep@mediaco.test', 'team@company.com']);
      }
    } catch (error) {
      setEmailList(['salesrep@mediaco.test', 'team@company.com']);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pdf_generated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'sent': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'pdf_generated': return <FileText className="h-4 w-4" />;
      case 'sent': return <Mail className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (emailList.includes(newEmail)) {
      toast({
        title: "Email Already Exists",
        description: "This email is already in the list.",
        variant: "destructive"
      });
      return;
    }

    setEmailList([...emailList, newEmail]);
    setNewEmail('');
    toast({
      title: "Email Added",
      description: `${newEmail} has been added to the recipient list.`,
    });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter(email => email !== emailToRemove));
    toast({
      title: "Email Removed",
      description: `${emailToRemove} has been removed from the recipient list.`,
    });
  };

  const handleGeneratePDF = async () => {
    if (!id) return;
    
    try {
      const response = await bookingsAPI.generatePDF(id);
      if (response.success) {
        toast({
          title: "PDF Generated",
          description: "PDF has been generated successfully.",
        });
        loadBookingDetails(); // Reload to get updated status
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = async () => {
    if (!id || emailList.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one email recipient.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await bookingsAPI.sendBookingEmailWithRecipients(id, emailList);
      if (response.success) {
        toast({
          title: "Email Sent",
          description: `Email has been sent to ${emailList.length} recipients.`,
        });
        setIsEmailDialogOpen(false);
        loadBookingDetails();
      } else {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!booking) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Booking Not Found</h2>
              <Button onClick={() => navigate('/bookings')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bookings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{booking.campaign_name}</h1>
              <p className="text-muted-foreground">ID: {booking.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(booking.status)}>
              {getStatusIcon(booking.status)}
              <span className="ml-1">{booking.status.replace('_', ' ').toUpperCase()}</span>
            </Badge>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Booking PDF - {booking.campaign_name}</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-[70vh]">
                    <iframe 
                      src={booking.pdf_url} 
                      className="w-full h-full border rounded-md"
                      title="Booking PDF"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Configuration (PDF Sending)
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Current Recipients</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        PDFs will be sent to these email addresses when bookings are confirmed
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {emailList.map((email, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-2">
                            {email}
                            <button
                              onClick={() => handleRemoveEmail(email)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newEmail">Add New Email Recipient</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="newEmail"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter email address"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                        />
                        <Button onClick={handleAddEmail} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendEmail} className="bg-primary hover:bg-primary/90">
                        <Send className="h-4 w-4 mr-2" />
                        Send to {emailList.length} Recipients
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Progress</h3>
                <span className="text-sm text-muted-foreground">{booking.progress}% Complete</span>
              </div>
              <Progress value={booking.progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        {booking.timeline && booking.timeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {booking.timeline.map((entry, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {getStatusIcon(entry.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground capitalize">
                        {entry.status.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.changed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Financial Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Amount:</span>
                  <span className="font-semibold text-foreground">${booking.gross_amount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partner Discount:</span>
                  <span className="font-semibold text-foreground">${booking.partner_discount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Additional Charges:</span>
                  <span className="font-semibold text-foreground">${booking.additional_charges?.toLocaleString() || '0'}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-foreground font-medium">Net Amount:</span>
                  <span className="font-bold text-lg text-foreground">${booking.net_amount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="campaign-info" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="campaign-info">Campaign Information</TabsTrigger>
                <TabsTrigger value="client-details">Client Details</TabsTrigger>
                <TabsTrigger value="campaign-details">Campaign Details</TabsTrigger>
                <TabsTrigger value="financial">Financial Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="campaign-info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Campaign Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-foreground">{booking.campaign_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p className="text-foreground">{booking.campaign_description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="client-details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Client Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Client</label>
                        <p className="text-foreground">{booking.client_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contact</label>
                        <p className="text-foreground">{booking.contact_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-foreground">{booking.contact_email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-foreground">{booking.contact_phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-foreground">{booking.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Industry Segment</label>
                        <p className="text-foreground">{booking.industry_segment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tax Registration No</label>
                        <p className="text-foreground">{booking.tax_registration_no}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="campaign-details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Campaign</label>
                        <p className="text-foreground">{booking.campaign_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reference</label>
                        <p className="text-foreground">{booking.campaign_ref}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                        <p className="text-foreground">{new Date(booking.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">End Date</label>
                        <p className="text-foreground">{new Date(booking.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Creative Delivery Date</label>
                        <p className="text-foreground">{new Date(booking.creative_delivery_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Media Type</label>
                        <p className="text-foreground">{booking.media_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Placement Preferences</label>
                        <p className="text-foreground">{booking.placement_preferences}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Creative Specifications</label>
                        <p className="text-foreground">{booking.creative_specs}</p>
                      </div>
                      {booking.special_instructions && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Special Instructions</label>
                          <p className="text-foreground">{booking.special_instructions}</p>
                        </div>
                      )}
                      {booking.creative_file_link && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Creative File Link</label>
                          <p className="text-foreground">{booking.creative_file_link}</p>
                        </div>
                      )}
                      {booking.signatory_name && (
                        <>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Signatory Name</label>
                            <p className="text-foreground">{booking.signatory_name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Signatory Title</label>
                            <p className="text-foreground">{booking.signatory_title}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Signature Date</label>
                            <p className="text-foreground">{new Date(booking.signature_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gross Amount:</span>
                        <span className="font-semibold text-foreground">${booking.gross_amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Partner Discount:</span>
                        <span className="font-semibold text-foreground">${booking.partner_discount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Additional Charges:</span>
                        <span className="font-semibold text-foreground">${booking.additional_charges?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground font-medium">Net Amount:</span>
                        <span className="font-bold text-lg text-foreground">${booking.net_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingDetails;