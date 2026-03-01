import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, TrendingUp, TrendingDown, Minus, Loader2, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LabResults() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDate, setUploadDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  const { data: labResults = [] } = useQuery({
    queryKey: ['labResults'],
    queryFn: async () => {
      const currentUser = await base44.auth.me();
      return base44.entities.LabResult.filter({ created_by: currentUser.email }, '-upload_date');
    },
  });

  const createLabResult = useMutation({
    mutationFn: (data) => base44.entities.LabResult.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labResults'] });
      toast.success('Lab result uploaded successfully!');
      setUploadDate('');
      setNotes('');
      setFile(null);
    },
  });

  const deleteLabResult = useMutation({
    mutationFn: (id) => base44.entities.LabResult.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labResults'] });
      toast.success('Lab result deleted successfully!');
    },
  });

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Rename file to lowercase .pdf extension if needed
    if (selectedFile.name.toUpperCase().endsWith('.PDF') && !selectedFile.name.endsWith('.pdf')) {
      const newName = selectedFile.name.replace(/\.PDF$/i, '.pdf');
      const renamedFile = new File([selectedFile], newName, { type: 'application/pdf' });
      setFile(renamedFile);
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadDate) {
      toast.error('Please select a file and date');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract multiple test results from PDF (handles historical data)
      const extractedData = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            test_results: {
              type: "array",
              description: "Extract ALL test results with dates from the PDF, including historical data",
              items: {
                type: "object",
                properties: {
                  test_date: { 
                    type: "string",
                    description: "The date of this specific test in YYYY-MM-DD format"
                  },
                  biomarkers: {
                    type: "object",
                    properties: {
                      ALT: { 
                        type: "object", 
                        properties: { 
                          value: { type: "number" }, 
                          unit: { type: "string" }, 
                          status: { 
                            type: "string",
                            enum: ["normal", "high", "low"],
                            description: "Extract the exact status shown: 'High', 'Low', or 'normal' if blank"
                          } 
                        } 
                      },
                      AST: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      Glucose: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      Sodium: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      Potassium: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      eGFR: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      BUN: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } },
                      Creatinine: { type: "object", properties: { value: { type: "number" }, unit: { type: "string" }, status: { type: "string", enum: ["normal", "high", "low"] } } }
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (extractedData.status === 'success' && extractedData.output?.test_results) {
        // Create a lab result record for each test date found in the PDF
        const results = extractedData.output.test_results;

        // Get existing lab result dates to avoid duplicates
        const existingDates = new Set(labResults.map(r => r.upload_date));
        let createdCount = 0;
        let skippedCount = 0;
        // Remaining logic for processing results
      }
    } catch (error) {
      toast.error('There was an error uploading your file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Lab Results</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Lab Results</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label htmlFor="uploadDate">Upload Date</Label>
            <Input id="uploadDate" type="date" value={uploadDate} onChange={(e) => setUploadDate(e.target.value)} />
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Label htmlFor="file">File</Label>
            <Input id="file" type="file" accept="application/pdf" onChange={handleFileUpload} />
            <Button type="submit">Upload</Button>
          </form>
          {labResults.length > 0 && (
            <div className="mt-4">
              {/* Display lab results */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// AI Reviewer Fix [Potential hostile file manipulation during upload]:
const validMimeTypes = ['application/pdf']; if (!validMimeTypes.includes(selectedFile.type) || selectedFile.size > 5000000) { toast.error('Invalid file type or size.'); return; }