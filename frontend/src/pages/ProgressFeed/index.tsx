import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Target, Trophy, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressData {
  id: string;
  title: string;
  description?: string;
  created_date: string;
  author_name: string;
  progress_type: string;
  likes_count: number;
  comments_count: number;
  stats?: { meals_tracked?: number; streak_days?: number; goals_met?: number; avg_protein?: number; };
}

const ProgressFeed: React.FC = () => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState({});
  const queryClient = useQueryClient();

  const { data: sharedProgress = [] } = useQuery<ProgressData[]>({
    queryKey: ['sharedProgress'],
    queryFn: () => apiFetch('GET', '/api/sharedProgress'),
  });

  const likeProgressMutation = useMutation({
    mutationFn: async (progressId: string) => {
      // Logic to like or unlike progress
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sharedProgress'] });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ progressId, comment }) => {
      await apiFetch('POST', '/api/progressComments', { progress_id: progressId, comment, author_name: user?.full_name || 'Anonymous' });  
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressComments'] });
      toast.success('Comment added!');
    },
  });

  const getProgressIcon = (type: string) => {
    switch(type) {
      case 'streak': return <Flame className="w-5 h-5 text-orange-500" />;
      case 'goal_reached': return <Target className="w-5 h-5 text-green-500" />;
      case 'milestone': return <Trophy className="w-5 h-5 text-amber-500" />;
      default: return <TrendingUp className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Progress Feed</h1>
        <p className="text-slate-600 mt-1">See what the community is achieving</p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {sharedProgress.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No shared progress yet</h3>
                <p className="text-slate-600">Be the first to share your nutrition tracking progress!</p>
              </CardContent>
            </Card>
          ) : (
            sharedProgress.map((progress, index) => (
              <motion.div
                key={progress.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getProgressIcon(progress.progress_type)}
                        <div>
                          <h2 className="text-lg">{progress.title}</h2>
                          <p className="text-sm text-slate-500 mt-1">
                            by {progress.author_name} • {format(new Date(progress.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {progress.progress_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {progress.description && <p className="text-slate-700">{progress.description}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressFeed;