import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, Eye, Heart, Pin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Forum() {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', tags: '' });
  const [newComment, setNewComment] = useState('');

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiFetch('/users/me'),
  });

  const { data: posts = [] } = useQuery({
    queryKey: ['forumPosts'],
    queryFn: () => apiFetch('/forum-posts'),
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['forumComments'],
    queryFn: () => apiFetch('/forum-comments'),
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => apiFetch('/forum-posts', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
      toast.success('Post created!');
      setCreatePostOpen(false);
      setNewPost({ title: '', content: '', category: 'general', tags: '' });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (data) => apiFetch('/forum-comments', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumComments'] });
      toast.success('Comment added!');
      setNewComment('');
    },
  });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in title and content');
      return;
    }

    createPostMutation.mutate({
      ...newPost,
      tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean),
      author_name: user?.name || 'Anonymous',
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    addCommentMutation.mutate({
      post_id: selectedPost.id,
      content: newComment,
      author_name: user?.name || 'Anonymous',
    });
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setCreatePostOpen(true);
  };

  return (
    <div>
      <Button onClick={() => setCreatePostOpen(true)}>Create Post</Button>
      <div className="grid md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Card key={post.id} onClick={() => openPost(post)}>
            <CardContent>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <p>{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={newPost.title} onValueChange={(e) => setNewPost({ ...newPost, title: e })} />
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" value={newPost.content} onValueChange={(e) => setNewPost({ ...newPost, content: e })} />
          <Button onClick={handleCreatePost}>Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}