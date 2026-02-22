import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuth();

  const { data: userSettings, isLoading } = useQuery({
    queryKey: ['userSettings', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      return await apiFetch('GET', `/api/userSettings?created_by=${user.email}`);
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = async (checked) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    // Assuming we have a logout function in the auth context
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and application preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-indigo-600">🔒</div>
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-2xl">
                  {user?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">Change Avatar</Button>
                <p className="text-sm text-slate-500 mt-2">JPG, GIF or PNG. Max size 2MB</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user?.full_name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email} disabled />
              </div>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-indigo-600">🔔</div>
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-500">Receive meal plan reminders via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Weekly Reports</p>
                <p className="text-sm text-slate-500">Get weekly nutrition summaries</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Plan Reminders</p>
                <p className="text-sm text-slate-500">Reminders for upcoming meals</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-indigo-600">🎨</div>
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how the app looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Dark Mode</p>
                <p className="text-sm text-slate-500">Use dark theme throughout the app</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Compact View</p>
                <p className="text-sm text-slate-500">Show more content on screen</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}