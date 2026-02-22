import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const { data: userSettings, isLoading, error } = useQuery({
    queryKey: ['userSettings', user?.email],
    queryFn: () => apiFetch('GET', `/api/userSettings?created_by=${user.email}`),
    enabled: !!user,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading settings.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label>Full Name</Label>
            <Input defaultValue={user?.full_name} />
            <Label>Email</Label>
            <Input defaultValue={user?.email} disabled />
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
            </div>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
