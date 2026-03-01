import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils/createPageUrl';
import { 
  TrendingUp,
  Calendar,
  Flame,
  Target,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QuickStartChecklist from '@/components/onboarding/QuickStartChecklist';
import OnboardingTour from '@/components/onboarding/OnboardingTour';

export default function Dashboard() {
  const { data: mealPlans = [], isLoading: loadingMealPlans } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: () => base44.entities.MealPlan.list('-created_date', 10),
    retry: false,
  });

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const loading = loadingMealPlans || loadingUser;

  return (
    <div className="space-y-6">
      <OnboardingTour />
      <QuickStartChecklist />
      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back, {user?.name || 'there'}! ð
            </h1>
            <p className="text-slate-600 mt-1">
              Here's your nutrition overview for today
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to={createPageUrl('Index')}>ð  Home Page</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
