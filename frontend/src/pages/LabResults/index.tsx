import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LabResults() {
  const [uploadDate, setUploadDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: labResults = [] } = useQuery(['labResults'], () => apiFetch('GET', '/api/labResults'));

  const createLabResult = useMutation({
    mutationFn: (data) => apiFetch('POST', '/api/labResults', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['labResults']);
      toast.success('Lab result uploaded successfully!');
      setUploadDate('');
      setNotes('');
      setFile(null);
    },
  });

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_date', uploadDate);
    formData.append('notes', notes);

    await createLabResult.mutateAsync(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Results</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Upload Date</Label>
        <Input type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} />

        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Label>Upload Lab Result File</Label>
        <Input type="file" onChange={handleFileUpload} />

        <Button onClick={handleSubmit}>Upload</Button>

        <div>
          <h3>Previous Lab Results</h3>
          {labResults.map(result => (
            <div key={result.id}>{result.upload_date}: {result.notes}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}