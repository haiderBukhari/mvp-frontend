import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Mail, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageCircle,
  Download,
  User,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { salesRepAPI, SalesRepInboxItem } from '@/lib/api';

const SalesRepInbox = () => {
  const { toast } = useToast();
  const [inboxItems, setInboxItems] = useState<SalesRepInboxItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInboxItems();
  }, []);

  const loadInboxItems = async () => {
    setIsLoading(true);
    try {
      const response = await salesRepAPI.getInboxItems();
      if (response.success) {
        setInboxItems(response.data || []);
      } else {
        toast({
          title: "Error loading inbox",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inbox items",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async (repStatusId: string) => {
    try {
      const response = await salesRepAPI.updateRepStatus(repStatusId, 'confirmed');
      if (response.success) {
        setInboxItems(prev => 
          prev.map(item => 
            item.rep_status_id === repStatusId 
              ? { ...item, rep_status: 'confirmed' }
              : item
          )
        );
        
        toast({
          title: "Booking Confirmed",
          description: `Booking has been confirmed and client has been notified.`,
        });
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
        description: "Failed to confirm booking",
        variant: "destructive"
      });
    }
  };

  const handleRejectBooking = async (repStatusId: string) => {
    try {
      const response = await salesRepAPI.updateRepStatus(repStatusId, 'rejected');
      if (response.success) {
        setInboxItems(prev => 
          prev.map(item => 
            item.rep_status_id === repStatusId 
              ? { ...item, rep_status: 'rejected' }
              : item
          )
        );
        
        toast({
          title: "Booking Rejected",
          description: `Booking has been rejected. Client will be notified.`,
          variant: "destructive"
        });
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
        description: "Failed to reject booking",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const pendingCount = inboxItems.filter(item => item.rep_status === 'pending').length;
  const reviewedCount = inboxItems.filter(item => item.rep_status === 'reviewed').length;
  const confirmedCount = inboxItems.filter(item => item.rep_status === 'confirmed').length;
  const totalValue = inboxItems.reduce((sum, item) => sum + item.net_amount, 0);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {pendingCount} Pending
            </Badge>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Reviewed</p>
                <p className="text-2xl font-bold text-foreground">{reviewedCount}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-foreground">{confirmedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Value</p>
                <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inbox Items */}
      <Card>
        <CardHeader>
          <CardTitle>Incoming Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inboxItems.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{item.campaign_name}</h4>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item.client_name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Submitted Invalid Date
                      </p>
                      <p className="text-sm text-foreground">
                        Campaign booking for {item.client_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-foreground">${item.net_amount.toLocaleString()}</p>
                    <Badge className={getStatusColor(item.rep_status)}>
                      {item.rep_status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Booking ID: {item.booking_id}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.rep_status === 'pending' && (
                      <>
                         <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRejectBooking(item.rep_status_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleConfirmBooking(item.rep_status_id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesRepInbox;