import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const ProgressFeed: React.FC = () => {
  const [commentText, setCommentText] = useState<{}>({});
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: sharedProgress = [] } = useQuery(['sharedProgress'], async () => {
    return await apiFetch('GET', '/api/sharedProgress');
  });

  const likeProgressMutation = useMutation({
    mutationFn: async (progressId: string) => {
      // Handle like mutation
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sharedProgress']);
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ progressId, comment }: { progressId: string; comment: string; }) => {
      return await apiFetch('POST', '/api/progressComment', { progress_id: progressId, comment, author_name: user?.full_name || 'Anonymous' });
    },
    onSuccess: () => {
      toast.success('Comment added!');
      queryClient.invalidateQueries(['progressComments']);
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Progress Feed</h1>
      <Tabs defaultValue="feed">
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
            sharedProgress.map((progress: any, index: number) => (
              <motion.div key={progress.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        <div>
                          <CardTitle className="text-lg">{progress.title}</CardTitle>
                          <p className="text-sm text-slate-500 mt-1">by {progress.author_name}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{progress.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">{progress.description}</p>
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