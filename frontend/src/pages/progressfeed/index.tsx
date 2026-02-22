import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flames, Trophy, Target, TrendingUp, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProgressFeed() {
    const [commentText, setCommentText] = useState({});
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => apiFetch('GET', '/api/user/me'),
    });

    const { data: sharedProgress = [] } = useQuery({
        queryKey: ['sharedProgress'],
        queryFn: () => apiFetch('GET', '/api/sharedProgress')
    });

    const addCommentMutation = useMutation({
        mutationFn: ({ progressId, comment }) => apiFetch('POST', '/api/comments', { progressId, comment, author_name: user?.full_name || 'Anonymous' }),
        onSuccess: () => {
            // Invalidate Queries / update state 
            toast.success('Comment added!');
        },
    });

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
                        <Card>
                            <CardContent className="p-12 text-center">
                                <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No shared progress yet</h3>
                                <p className="text-slate-600">Be the first to share your nutrition tracking progress!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        sharedProgress.map(progress => (
                            <Card key={progress.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            {/* Render Progress Icon */}
                                            <div>
                                                <CardTitle>{progress.title}</CardTitle>
                                                <p className="text-sm text-slate-500 mt-1">by {progress.author_name}</p>
                                            </div>
                                        </div>
                                        <Badge>{progress.progress_type}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700">{progress.description}</p>
                                    <Button onClick={() => addCommentMutation.mutate({ progressId: progress.id, comment: commentText[progress.id] })}>Comment</Button>
                                    <Input value={commentText[progress.id] || ''} onChange={(e) => setCommentText(prev => ({ ...prev, [progress.id]: e.target.value }))} />
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}