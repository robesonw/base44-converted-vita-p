import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
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
import { motion } from 'framer-motion';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author_name: string;
  comments_count: number;
  views_count: number;
}

interface Comment {
  id: string;
  post_id: string;
  content: string;
  author_name: string;
}

export default function Forum() {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [filterCategory, setFilterCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery<Post[]>('forumPosts', () => 
    apiFetch('GET', '/api/forumPosts')
  );

  const createPostMutation = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/forumPosts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
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
      author_name: 'Anonymous',
    });
  };

  const filteredPosts = posts.filter(post => 
    filterCategory === 'all' || post.category === filterCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
          <p className="text-slate-600 mt-1">Share knowledge, ask questions, connect with others</p>
        </div>
        <Button onClick={() => setCreatePostOpen(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Categories */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant={filterCategory === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory('all')}>All</Button>
            {['general', 'recipes', 'nutrition', 'meal_prep', 'tips', 'questions'].map(cat => (
              <Button key={cat} variant={filterCategory === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilterCategory(cat)}>{cat}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card key={post.id} className="border-slate-200">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">by {post.author_name}</span>
                <Badge>{post.comments_count} comments</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <Button className="mt-2" onClick={() => {}}>
                View More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
          </DialogHeader>
          <Label>
            Title
            <Input value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
          </Label>
          <Label>
            Content
            <Textarea value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} />
          </Label>
          <Select value={newPost.category} onValueChange={(val) => setNewPost({ ...newPost, category: val })}>
            <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="recipes">Recipes</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="meal_prep">Meal Prep</SelectItem>
              <SelectItem value="tips">Tips</SelectItem>
              <SelectItem value="questions">Questions</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreatePost} className="mt-4">Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}