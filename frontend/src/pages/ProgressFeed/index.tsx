import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, TrendingUp, Trophy, Target, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { apiFetch } from '@/lib/api';

export default function ProgressFeed() {
  const [commentText, setCommentText] = useState({});
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      // Assuming fetching user using apiFetch
      return await apiFetch('GET', '/api/users/me');
    }
  });

  const { data: sharedProgress = [] } = useQuery({
    queryKey: ['sharedProgress'],
    queryFn: () => apiFetch('GET', '/api/sharedProgress?page=1&limit=50'),
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ progressId, comment }) => apiFetch('POST', '/api/progressComments', {
      progress_id: progressId,
      comment,
      author_name: user?.full_name || 'Anonymous'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progressComments'] });
      toast.success('Comment added!');
      setCommentText(prev => ({ ...prev, [progressId]: '' }));
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Progress Feed</h1>
      <p className="text-slate-600 mt-1">See what the community is achieving</p>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="space-y-4">
          {sharedProgress.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3>No shared progress yet</h3>
              </CardContent>
            </Card>
          ) : (
            sharedProgress.map((progress, index) => (
              <motion.div key={progress.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <CardTitle>{progress.title}</CardTitle>
                        <p>by {progress.author_name} â¢ {format(new Date(progress.created_date), 'MMM d, yyyy')}</p>
                      </div>
                      <Badge variant="secondary">{progress.progress_type}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}