import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  Download,
  Loader2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { bookingsAPI, reportsAPI, authAPI, Booking, ReportsData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';

const Dashboard = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(authAPI.getCurrentUser());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load bookings and reports data in parallel
      const [bookingsResponse, reportsResponse] = await Promise.all([
        bookingsAPI.getBookings(),
        reportsAPI.getReports()
      ]);

      if (bookingsResponse.success) {
        setBookings(bookingsResponse.data || []);
      } else {
        toast({
          title: "Error loading bookings",
          description: bookingsResponse.error,
          variant: "destructive"
        });
      }

      if (reportsResponse.success) {
        setReportsData(reportsResponse.data || null);
      } else {
        toast({
          title: "Error loading reports",
          description: reportsResponse.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from reports data
  const stats = reportsData ? [
    { 
      title: 'Total Bookings', 
      value: reportsData.total_bookings.toString(), 
      change: '+12%', 
      icon: DollarSign, 
      color: 'text-blue-500' 
    },
    { 
      title: 'In Progress', 
      value: Array.isArray(reportsData.status_distribution) 
        ? reportsData.status_distribution.find(s => s.status === 'submitted')?.count.toString() || '0'
        : '0', 
      change: '+3%', 
      icon: Clock, 
      color: 'text-yellow-500' 
    },
    { 
      title: 'Confirmed', 
      value: Array.isArray(reportsData.status_distribution)
        ? reportsData.status_distribution.find(s => s.status === 'confirmed')?.count.toString() || '0'
        : '0', 
      change: '+8%', 
      icon: CheckCircle, 
      color: 'text-green-500' 
    },
    { 
      title: 'Revenue', 
      value: `$${reportsData.total_revenue.toLocaleString()}`, 
      change: '+18%', 
      icon: DollarSign, 
      color: 'text-purple-500' 
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pdf_generated':
      case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'submitted': return 25;
      case 'pdf_generated': return 50;
      case 'sent': return 75;
      case 'confirmed': return 100;
      case 'rejected': return 0;
      default: return 0;
    }
  };

  const activities = [
    { id: 1, action: `${bookings.filter(b => b.status === 'confirmed').length} bookings confirmed`, time: 'Today', type: 'success' },
    { id: 2, action: `${bookings.filter(b => b.status === 'pdf_generated').length} PDFs generated`, time: 'Today', type: 'info' },
    { id: 3, action: `${bookings.filter(b => b.status === 'submitted').length} new bookings submitted`, time: 'Today', type: 'info' },
    { id: 4, action: 'Dashboard updated with latest data', time: 'Now', type: 'message' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'message': return <Send className="h-4 w-4 text-blue-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {user?.full_name || 'User'} 👋
              </h2>
              <p className="text-muted-foreground">Here's what's happening with your bookings today.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-primary/10 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Table */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Recent Bookings</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="py-8">
                    <EmptyState
                      icon={Calendar}
                      title="No bookings yet"
                      description="Start creating your first booking to see them here."
                      actionLabel="Create Booking"
                      actionPath="/create-booking"
                      className="border-none shadow-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 4).map((booking, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{booking.campaign_name}</h4>
                              <p className="text-sm text-muted-foreground">{booking.client_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">${booking.net_amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.start_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Progress value={getProgressValue(booking.status)} className="w-20" />
                            <span className="text-sm text-muted-foreground">{getProgressValue(booking.status)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
