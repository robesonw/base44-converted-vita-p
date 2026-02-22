import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './components/notifications/NotificationBell';

const navigation = [
  { name: 'Dashboard', href: 'Dashboard' },
  { name: 'Lab Results', href: 'LabResults' },
  { name: 'Health Diet Hub', href: 'HealthDietHub' },
  { name: 'AI Recipe Generator', href: 'AIRecipeGenerator' },
  { name: 'Meal Plans', href: 'MealPlans' },
  { name: 'Nutrition Tracking', href: 'NutritionTracking' },
  { name: 'Grocery Lists', href: 'GroceryLists' },
  { name: 'Community', href: 'Community' },
  { name: 'Progress Feed', href: 'ProgressFeed' },
  { name: 'Shared Recipes', href: 'SharedRecipes' },
  { name: 'Analytics', href: 'Analytics' },
  { name: 'Help Center', href: 'HelpCenter' },
  { name: 'Profile', href: 'Profile' },
  { name: 'Settings', href: 'Settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</button>
      <aside className={cn(sidebarOpen ? 'block' : 'hidden')}>  {/* Sidebar */}
        <nav>
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className="nav-link">
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}