import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface LabResult {
  upload_date: string;
  file_url: string;
  notes: string;
}

export default function LabResults() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadDate, setUploadDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { data: labResults = [] }: { data: LabResult[] } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => apiFetch('GET', `/api/labresults?created_by=${user?.email}`),
  });

  const createLabResult = useMutation({
    mutationFn: async (data: LabResult) => apiFetch('POST', '/api/labresults', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['labResults']);
      toast.success('Lab result uploaded successfully!');
    },
  });

  const deleteLabResult = useMutation({
    mutationFn: (id: string) => apiFetch('DELETE', `/api/labresults/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['labResults']);
      toast.success('Lab result deleted successfully!');
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }

    setIsUploading(true);

    try {
      const { file_url } = await apiFetch('POST', '/api/upload', new FormData().append('file', file));
      await createLabResult.mutateAsync({ upload_date: uploadDate, file_url, notes });
      // Reset form
      setUploadDate('');
      setNotes('');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Lab Results</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <Label htmlFor="uploadDate">Upload Date</Label>
        <Input
          type="date"
          id="uploadDate"
          value={uploadDate}
          onChange={(e) => setUploadDate(e.target.value)}
          required
        />
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Input type="file" onChange={handleFileUpload} required />
        <Button type="submit" disabled={isUploading}>Upload</Button>
      </form>
      <div className="mt-4">
        {labResults.map((result) => (
          <Card key={result.upload_date} className="my-2">
            <CardHeader>
              <CardTitle>{result.upload_date}</CardTitle>
              <Button onClick={() => deleteLabResult.mutate(result.upload_date)}>Delete</Button>
            </CardHeader>
            <CardContent>
              <a href={result.file_url} target="_blank" rel="noopener noreferrer"><FileText /> View Result</a>
              <p>{result.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}