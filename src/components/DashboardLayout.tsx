import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  FileText, 
  Plus, 
  MessageCircle, 
  Inbox, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { storage } from '@/lib/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if theme preference is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to dark mode if no preference is saved
    return true;
  });
  
  const activeTab = location.pathname === '/dashboard' ? 'dashboard' :
                   location.pathname === '/create-booking' ? 'create-booking' :
                   location.pathname.replace('/', '');

  const userRole = storage.getUserRole();

  useEffect(() => {
    // Apply theme on component mount and when isDarkMode changes
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
      { id: 'bookings', label: 'Bookings', icon: FileText, path: '/bookings' },
    ];

    const userSpecificItems = userRole === 'sales' 
      ? [
          { id: 'sales-rep-inbox', label: 'Sales Rep Inbox', icon: Inbox, path: '/sales-rep-inbox' },
        ]
      : [
          { id: 'create-booking', label: 'Create Booking', icon: Plus, path: '/create-booking' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat' },
        ];

    const commonItems = [
      { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
      { id: 'help-support', label: 'Help & Support', icon: HelpCircle, path: '/help-support' },
    ];

    return [...baseItems, ...userSpecificItems, ...commonItems];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">MediaCo</h1>
              <p className="text-sm text-muted-foreground">Booking Platform</p>
            </div>
            {/* Theme Toggle */}
            <div className="flex items-center space-x-1">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <Separator />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome back, Haider 👋</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;