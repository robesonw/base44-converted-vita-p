import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const LabResults = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadDate, setUploadDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => await apiFetch('GET', '/api/auth/me'),
    retry: false,
  });

  const { data: labResults = [] } = useQuery({
    queryKey: ['labResults'],
    queryFn: async () => await apiFetch('GET', '/api/lab-results')
  });
  
  const createLabResult = useMutation({
    mutationFn: async (data) => await apiFetch('POST', '/api/lab-results', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['labResults']);
      toast.success('Lab result uploaded successfully!');
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_date', uploadDate);
    formData.append('notes', notes);

    try {
      await createLabResult.mutateAsync(formData);
      setUploadDate('');
      setNotes('');
      setFile(null);
    } catch (error) {
      toast.error('Upload failed: ' + error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Lab Results</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="uploadDate">Upload Date</Label>
          <Input type="date" value={uploadDate} onChange={e => setUploadDate(e.target.value)} required />
          <Label htmlFor="notes">Notes</Label>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
          <Label htmlFor="file">Select File</Label>
          <Input type="file" onChange={handleFileUpload} required />
          <Button type="submit" disabled={isUploading}>Upload</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LabResults;
