import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { createPageUrl } from '../utils';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import QuickStartChecklist from '../components/onboarding/QuickStartChecklist';
import OnboardingTour from '../components/onboarding/OnboardingTour';
import { useAuth } from '@/contexts/AuthContext';

interface MealPlan {
  name: string;
  created_date: string;
  days?: Array<{ breakfast?: { calories?: string }; lunch?: { calories?: string }; dinner?: { calories?: string }; snacks?: { calories?: string } }>; 
}

interface LabResult {
  upload_date: string;
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: mealPlans = [] }: { data: MealPlan[] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/mealPlans'),
  });

  const { data: sharedPlans = [] }: { data: MealPlan[] } = useQuery({
    queryKey: ['sharedPlans'],
    queryFn: () => apiFetch('GET', '/api/sharedMealPlans'),
  });

  const { data: labResults = [] }: { data: LabResult[] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => apiFetch('GET', '/api/labResults'),
  });

  const totalMeals = mealPlans.reduce((sum, p) => {
    return sum + (p.days?.length || 0) * 4;
  }, 0);

  const avgCalories = React.useMemo(() => {
    if (mealPlans.length === 0) return 0;
    let totalCals = 0;
    let dayCount = 0;
    mealPlans.forEach(plan => {
      plan.days?.forEach(day => {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(mealType => {
          const meal = day[mealType];
          if (meal?.calories) {
            const match = meal.calories.match(/(\d+)/);
            if (match) {
              totalCals += parseInt(match[1]);
              dayCount++;
            }
          }
        });
      });
    });
    return dayCount > 0 ? Math.round(totalCals / (mealPlans.reduce((sum, p) => sum + (p.days?.length || 0), 0) || 1)) : 0;
  }, [mealPlans]);

  const stats = {
    activePlans: mealPlans.length,
    totalMeals,
    avgCalories,
    communityShares: sharedPlans.length,
  };

  const statCards = [
    { title: 'Active Plans', value: stats.activePlans, subtitle: 'meal plans', icon: Calendar, color: 'indigo' },
    { title: 'Meals Planned', value: stats.totalMeals, subtitle: 'total meals', icon: Target, color: 'emerald' },
    { title: 'Avg Calories/Day', value: stats.avgCalories > 0 ? `${stats.avgCalories}` : 'N/A', subtitle: stats.avgCalories > 0 ? 'kcal per day' : 'Create plans to track', icon: Flame, color: 'orange' },
    { title: 'Community Shares', value: stats.communityShares, subtitle: 'shared recently', icon: TrendingUp, color: 'purple' },
  ];

  const recentActivity = React.useMemo(() => {
    const activities = mealPlans.slice(0, 3).map(plan => ({
      action: 'Created meal plan',
      plan: plan.name,
      time: 'Just now'
    }));
    if (labResults.length > 0) {
      activities.push({
        action: 'Uploaded lab results',
        plan: 'Health tracking',
        time: 'Just now'
      });
    }
    return activities.length > 0 ? activities : [{ action: 'Welcome!', plan: 'Start by creating your first meal plan', time: 'Get started' }];
  }, [mealPlans, labResults]);

  return (
    <div className="space-y-6">
      <OnboardingTour />
      <QuickStartChecklist />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-600 mt-1">
            Here's your nutrition overview for today
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={createPageUrl('Index')}>🏠 Home Page</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500 flex items-center justify-center`}>  
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Today's Nutrition Goals</CardTitle>
              <CardDescription>Track your daily intake targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Calories</span>
                  <span className="text-sm font-semibold text-slate-900">1,250 / 2,000 kcal</span>
                </div>
                <Progress value={62.5} className="h-2" />
              </div>
              <div>Your Progress</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}