import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Settings() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = (checked) => {
        setDarkMode(checked);
        if (checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        toast.success(`Dark mode ${checked ? 'enabled' : 'disabled'}`);
    };

    const handleLogout = async () => {
        await apiFetch('POST', '/api/logout');
        toast.success('Logged out successfully!');
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Manage your account and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900">Dark Mode</p>
                                <p className="text-sm text-slate-500">Use dark theme throughout the app</p>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                        <Separator />
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}