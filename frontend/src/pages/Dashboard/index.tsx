import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import QuickStartChecklist from '@/components/onboarding/QuickStartChecklist';
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import { TrendingUp, Calendar, Flame, Target } from 'lucide-react';

interface MealPlan {
  days?: Array<{ breakfast?: { calories?: string }, lunch?: { calories?: string }, dinner?: { calories?: string }, snacks?: { calories?: string } }>;  
  created_date: string;
  name: string;
}

interface LabResult {
  upload_date: string;
}

const Dashboard = () => {
  const { user } = useAuth();

  const { data: mealPlans = [] }: { data: MealPlan[] } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => apiFetch('GET', '/api/meal-plans'),
  });

  const { data: sharedPlans = [] }: { data: MealPlan[] } = useQuery({
    queryKey: ['sharedPlans'],
    queryFn: () => apiFetch('GET', '/api/shared-meal-plans'),
  });

  const { data: labResults = [] }: { data: LabResult[] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => apiFetch('GET', '/api/lab-results'),
  });

  const totalMeals = mealPlans.reduce((sum, p) => sum + (p.days?.length || 0) * 4, 0);

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
          <Link to="/index">
            🏡 Home Page
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value], index) => (
          <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600">{key}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2}>{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;