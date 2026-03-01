import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    author_name: string;
}

const Forum: React.FC = () => {
    const [createPostOpen, setCreatePostOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
    const queryClient = useQueryClient();
    const { data: user } = useAuth();

    const { data: posts = [] } = useQuery<Post[]>('forumPosts', () => apiFetch('GET', '/api/forum-posts'));

    const createPostMutation = useMutation({
        mutationFn: (data: Post) => apiFetch('POST', '/api/forum-posts', data),
        onSuccess: () => {
            queryClient.invalidateQueries('forumPosts');
            toast.success('Post created!');
            setCreatePostOpen(false);
            setNewPost({ title: '', content: '', category: 'general' });
        },
    });

    const handleCreatePost = () => {
        if (!newPost.title || !newPost.content) {
            toast.error('Please fill in title and content');
            return;
        }

        createPostMutation.mutate({
            ...newPost,
            author_name: user?.full_name || 'Anonymous',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
                    <p className="text-slate-600 mt-1">Share knowledge, ask questions, connect with others</p>
                </div>
                <Button onClick={() => setCreatePostOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
            </div>

            <Card className="border-slate-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-purple-600" /> Recent Discussions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                <h4 className="font-semibold text-slate-900">{post.title}</h4>
                                <p className="text-slate-500">by {post.author_name}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Post</DialogTitle>
                    </DialogHeader>
                    <Label htmlFor="post-title">Title</Label>
                    <Input id="post-title" value={newPost.title} onValueChange={(val) => setNewPost({ ...newPost, title: val })} />
                    <Label htmlFor="post-content">Content</Label>
                    <Textarea id="post-content" value={newPost.content} onValueChange={(val) => setNewPost({ ...newPost, content: val })} />
                    <Label htmlFor="post-category">Category</Label>
                    <Select value={newPost.category} onValueChange={(val) => setNewPost({ ...newPost, category: val })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="recipes">Recipes</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleCreatePost}>Create Post</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Forum;