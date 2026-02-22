import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Forum() {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['forumPosts'],
    queryFn: () => apiFetch('GET', '/api/forumPosts'),
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/forumPosts', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['forumPosts']);
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
    createPostMutation.mutate(newPost);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
          <p className="text-slate-600 mt-1">Share knowledge, ask questions, connect with others</p>
        </div>
        <Button onClick={() => setCreatePostOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
          New Post
        </Button>
      </div>

      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">by {post.author_name}</span>
                      <span className="text-xs text-slate-500">{post.comments_count || 0} comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
            className="mb-4"
          />
          <Textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
            className="mb-4"
          />
          <Button onClick={handleCreatePost}>Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}