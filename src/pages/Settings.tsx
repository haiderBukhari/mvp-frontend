import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Settings as SettingsIcon, 
  Mail, 
  Trash2, 
  Plus, 
  Save, 
  User, 
  Building,
  Bell,
  Download,
  Moon,
  Sun,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { settingsAPI, authAPI, UserSettings } from '@/lib/api';

const Settings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [campaignPrefix, setCampaignPrefix] = useState('UB');
  const [newEmail, setNewEmail] = useState('');
  const [sendingMode, setSendingMode] = useState('simulate');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(authAPI.getCurrentUser());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await settingsAPI.getSettings();
      if (response.success && response.data) {
        setEmailList(response.data.email_recipients || []);
      } else {
        // Set default email list if no settings exist
        setEmailList(['salesrep@mediaco.test', 'manager@mediaco.test']);
      }
      
      // Set company name from user data
      if (user?.company_name) {
        setCompanyName(user.company_name);
      }
    } catch (error) {
      toast({
        title: "Error loading settings",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    
    // Basic email validation
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

  const handleSaveSettings = async () => {
    try {
      const response = await settingsAPI.updateSettings(emailList);
      if (response.success) {
        toast({
          title: "Settings Saved",
          description: "Your settings have been updated successfully.",
        });
      } else {
        toast({
          title: "Error saving settings",
          description: response.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prefix">Default Campaign Prefix</Label>
              <Input
                id="prefix"
                value={campaignPrefix}
                onChange={(e) => setCampaignPrefix(e.target.value)}
                placeholder="e.g., UB, CP, AD"
                maxLength={5}
              />
              <p className="text-xs text-muted-foreground">
                Used for auto-generating campaign IDs (e.g., {campaignPrefix}-2025-001)
              </p>
            </div>

            <Separator />

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme Preference</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
              </div>
              <div className="flex items-center gap-2">
                <Moon size={16} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                <Switch 
                  checked={!isDarkMode} 
                  onCheckedChange={toggleTheme} 
                />
                <Sun size={16} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                defaultValue={user?.full_name || ""}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email_address || ""}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                defaultValue="Marketing Director"
                placeholder="Enter your role"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="password">Change Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration (PDF Sending)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Email List */}
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

          {/* Add New Email */}
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

          {/* Sending Mode */}
          <div>
            <Label className="text-base font-medium">Sending Mode</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose how PDFs are handled when bookings are confirmed
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-colors ${
                  sendingMode === 'console' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSendingMode('console')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🖥️</div>
                  <h4 className="font-medium">Log to Console</h4>
                  <p className="text-xs text-muted-foreground">Display in browser console</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  sendingMode === 'local' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSendingMode('local')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">💾</div>
                  <h4 className="font-medium">Save Locally</h4>
                  <p className="text-xs text-muted-foreground">Download to device</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-colors ${
                  sendingMode === 'simulate' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSendingMode('simulate')}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <h4 className="font-medium">Simulate Email</h4>
                  <p className="text-xs text-muted-foreground">Simulate sending to recipients</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Toast Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show confirmation messages for booking actions
              </p>
            </div>
            <Switch 
              checked={enableNotifications}
              onCheckedChange={setEnableNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates for booking status changes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications for new bookings
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;