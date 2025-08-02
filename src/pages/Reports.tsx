import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  Calendar,
  Loader2,
  Plus
} from 'lucide-react';
import { reportsAPI, ReportsData } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const Reports = () => {
  const { toast } = useToast();
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    setIsLoading(true);
    try {
      const response = await reportsAPI.getReports();
      if (response.success) {
        setReportsData(response.data || null);
      } else {
        toast({
          title: "Error loading reports",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

  if (!reportsData || (reportsData.total_bookings === 0 && reportsData.total_revenue === 0)) {
    return (
      <DashboardLayout>
        <EmptyState
          icon={BarChart3}
          title="No reports data available"
          description="You don't have any booking data yet. Create your first booking to see reports and analytics here."
          actionLabel="Create New Booking"
          actionPath="/create-booking"
          className="w-full max-w-none"
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">${(reportsData.total_revenue || 0).toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+18%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">{reportsData.total_bookings || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+25%</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-foreground">{reportsData.active_clients || 0}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Avg. Booking Value</p>
                <p className="text-2xl font-bold text-foreground">${(reportsData.avg_booking_value || 0).toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">-5%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card className="border-2 border-muted/20 shadow-lg">
          <CardHeader className="border-b border-muted/20 bg-muted/5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 border border-muted/30 rounded-lg bg-gradient-to-br from-background to-muted/5 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={[
                    { month: "Start", revenue: 0, bookings: 0 },
                    ...reportsData.monthly_performance
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tickLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tickLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => value === 0 ? '0' : `$${(value / 1000).toFixed(0)}k`}
                    domain={[0, 'dataMax + 10000']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px hsl(var(--muted) / 0.15)',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Line 
                    type="basis" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    fill="url(#revenueGradient)"
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 3, r: 6, stroke: 'hsl(var(--background))' }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 3, fill: 'hsl(var(--background))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Booking Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(reportsData.status_distribution).map(([status, count]) => ({
                        name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
                        value: count,
                        status
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {Object.entries(reportsData.status_distribution).map(([status], index) => {
                        const colors = {
                          submitted: 'hsl(217, 91%, 60%)',
                          in_progress: 'hsl(48, 96%, 53%)',
                          confirmed: 'hsl(142, 76%, 36%)',
                          rejected: 'hsl(0, 84%, 60%)'
                        };
                        return <Cell key={`cell-${index}`} fill={colors[status as keyof typeof colors] || 'hsl(var(--muted))'} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px hsl(var(--muted) / 0.15)',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: any, name: string, props: any) => [
                        `${value} bookings`,
                        <span key="status" className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: props.payload.status === 'submitted' ? 'hsl(217, 91%, 60%)' : 
                                     props.payload.status === 'in_progress' ? 'hsl(48, 96%, 53%)' :
                                     props.payload.status === 'confirmed' ? 'hsl(142, 76%, 36%)' :
                                     props.payload.status === 'rejected' ? 'hsl(0, 84%, 60%)' : 'hsl(var(--muted))' }}
                          />
                          {name}
                        </span>
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(reportsData.status_distribution).map(([status, count]) => {
                  const colors = {
                    submitted: { bg: 'hsl(217, 91%, 60%)', label: 'Submitted' },
                    in_progress: { bg: 'hsl(48, 96%, 53%)', label: 'In Progress' },
                    confirmed: { bg: 'hsl(142, 76%, 36%)', label: 'Confirmed' },
                    rejected: { bg: 'hsl(0, 84%, 60%)', label: 'Rejected' }
                  };
                  const statusInfo = colors[status as keyof typeof colors];
                  
                  return (
                    <div key={status} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: statusInfo?.bg || 'hsl(var(--muted))' }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{statusInfo?.label || status}</p>
                        <p className="text-xs text-muted-foreground">{count} bookings</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Status Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {reportsData.status_distribution ? Object.entries(reportsData.status_distribution).map(([status, count]) => {
              const getStatusInfo = (statusName: string) => {
                switch (statusName) {
                  case 'confirmed': return { color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', label: 'Confirmed' };
                  case 'submitted': return { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Submitted' };
                  case 'in_progress': return { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: 'In Progress' };
                  case 'rejected': return { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Rejected' };
                  default: return { color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-900/20', label: statusName };
                }
              };
              
              const statusInfo = getStatusInfo(status);
              const percentage = reportsData.total_bookings > 0 ? Math.round((count / reportsData.total_bookings) * 100) : 0;
              
              return (
                <div key={status} className={`text-center p-4 ${statusInfo.bg} rounded-lg border transition-all hover:shadow-md`}>
                  <div className={`text-3xl font-bold ${statusInfo.color} mb-1`}>{count}</div>
                  <div className="text-sm font-medium text-foreground">{statusInfo.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{percentage}% of total</div>
                </div>
              );
            }) : (
              <div className="col-span-4 text-center text-muted-foreground">
                No status data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {reportsData.recent_activity.confirmed_bookings} bookings confirmed (last 7 days)
                </p>
                <p className="text-xs text-muted-foreground">Total value: ${(reportsData.recent_activity.total_value || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{reportsData.active_clients} active clients</p>
                <p className="text-xs text-muted-foreground">Across all campaigns</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Average booking value: ${(reportsData.avg_booking_value || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Across all confirmed bookings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;