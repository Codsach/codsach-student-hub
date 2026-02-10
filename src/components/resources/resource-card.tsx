
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, HardDrive, Download, Tag, FileText, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { downloadFile, getDirectGoogleDriveDownloadUrl } from '@/lib/utils';


interface ResourceFile {
    name: string;
    size: string;
    downloadUrl: string | null;
}

interface ResourceCardProps {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  createdAt: string;
  updatedAt: string;
  downloads: number;
  files: ResourceFile[];
  downloadUrl?: string | null; // For software tools with external links
  subject?: string;
  semester?: string;
  year?: string;
}

export function ResourceCard({ title, description, tags, keywords, createdAt, downloads, files = [], downloadUrl, subject, semester, year }: ResourceCardProps) {
  const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
  const [viewFileName, setViewFileName] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  
  const getCategoryName = (tag: string) => {
    switch (tag) {
        case 'notes': return 'Notes';
        case 'lab-programs': return 'Lab Programs';
        case 'question-papers': return 'Question Papers';
        case 'software-tools': return 'Software Tools';
        default: return tag.toUpperCase();
    }
  }
  
  const totalSize = files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(2);
  
  const handleViewFile = (file: ResourceFile) => {
    if (file.downloadUrl) {
      setViewFileUrl(file.downloadUrl);
      setViewFileName(file.name);
    }
  }

  const handleDownload = async (file: ResourceFile) => {
    if (!file.downloadUrl) return;
    setIsDownloading(file.name);
    try {
        await downloadFile(file.downloadUrl, file.name);
    } catch (error) {
        console.error("Download failed:", error);
        // Fallback for browsers that might block the fetch, though it might open in a new tab
        window.open(file.downloadUrl, '_blank');
    } finally {
        setIsDownloading(null);
    }
  };

  return (
    <>
    <Card className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 h-12 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{getCategoryName(tag)}</Badge>
          ))}
          {subject && <Badge variant="outline">{subject}</Badge>}
          {semester && <Badge variant="outline">Sem {semester}</Badge>}
          {year && <Badge variant="outline">{year}</Badge>}
        </div>
        {keywords && keywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground mb-6">
            <Tag className="h-4 w-4" />
            {keywords.map((keyword, index) => (
              <span key={index}>{keyword}</span>
            ))}
          </div>
        )}

        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md bg-muted/50 gap-3">
              <div className='flex items-center gap-3'>
                <FileText className='h-5 w-5 text-primary flex-shrink-0' />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <div className='flex gap-2 w-full sm:w-auto flex-shrink-0'>
                <Button size="sm" variant="outline" onClick={() => handleViewFile(file)} disabled={!file.downloadUrl} className="flex-1">
                  <Eye className="mr-2 h-4 w-4" /> View
                </Button>
                <Button size="sm" onClick={() => handleDownload(file)} disabled={!file.downloadUrl || isDownloading === file.name} className="flex-1 hover-glow">
                    <Download className={`mr-2 h-4 w-4 ${isDownloading === file.name ? 'animate-pulse' : ''}`} /> 
                    {isDownloading === file.name ? '...' : 'Download'}
                </Button>
              </div>
            </div>
          ))}

          {tags.includes('software-tools') && downloadUrl && (
             <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className='flex items-center gap-3'>
                    <FileText className='h-5 w-5 text-primary' />
                    <p className="text-sm font-medium">{title}</p>
                </div>
                <Button size="sm" asChild className="hover-glow">
                    <a href={getDirectGoogleDriveDownloadUrl(downloadUrl)} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                </Button>
             </div>
          )}
        </div>

      </CardContent>
      <div className="flex items-center justify-between border-t p-4 bg-muted/30 rounded-b-lg">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" title='Upload Date'>
              <Calendar className="h-4 w-4" />
              <span>{new Date(createdAt).toLocaleDateString()}</span>
            </div>
             {!tags.includes('software-tools') && (
                <div className="flex items-center gap-2" title='Total Size'>
                <HardDrive className="h-4 w-4" />
                <span>{totalSize} MB</span>
                </div>
            )}
            <div className="flex items-center gap-2" title='Total Downloads'>
              <Download className="h-4 w-4" />
              <span>{downloads.toLocaleString()}</span>
            </div>
          </div>
      </div>
    </Card>

    <Dialog open={!!viewFileUrl} onOpenChange={(open) => { if (!open) setViewFileUrl(null); }}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col">
            <DialogHeader className="p-6">
              <DialogTitle>{viewFileName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 w-full">
              <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(getDirectGoogleDriveDownloadUrl(viewFileUrl || ''))}&embedded=true`}
                  className="h-full w-full"
                  frameBorder="0"
              ></iframe>
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
