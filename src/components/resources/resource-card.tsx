
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, HardDrive, Download, Tag, Circle, FileText } from 'lucide-react';
import Link from 'next/link';

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
  date: string;
  downloads: number;
  files: ResourceFile[];
  downloadUrl?: string | null; // For software tools with external links
  subject?: string;
  semester?: string;
  year?: string;
}

export function ResourceCard({ title, description, tags, keywords, date, downloads, files = [], downloadUrl, subject, semester, year }: ResourceCardProps) {
  
  const getCategoryName = (tag: string) => {
    switch (tag) {
        case 'notes': return 'Notes';
        case 'lab-programs': return 'Lab Programs';
        case 'question-papers': return 'Question Papers';
        case 'software-tools': return 'Software Tools';
        default: return tag.toUpperCase();
    }
  }

  const getDownloadLink = (url: string | null) => {
    if (!url) return '#';
    
    // Check if it's a Google Drive link
    if (url.includes('drive.google.com')) {
      const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([^/&?]+)/);
      if (match && match[1]) {
        const fileId = match[1];
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    return url;
  };
  
  const totalSize = files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(2);

  return (
    <Card className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
              <div className='flex items-center gap-3'>
                <FileText className='h-5 w-5 text-primary' />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                </div>
              </div>
              <Button size="sm" asChild disabled={!file.downloadUrl}>
                <Link href={getDownloadLink(file.downloadUrl)} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Link>
              </Button>
            </div>
          ))}

          {tags.includes('software-tools') && downloadUrl && (
             <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className='flex items-center gap-3'>
                    <FileText className='h-5 w-5 text-primary' />
                    <p className="text-sm font-medium">{title}</p>
                </div>
                <Button size="sm" asChild>
                    <Link href={getDownloadLink(downloadUrl)} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download
                    </Link>
                </Button>
             </div>
          )}
        </div>

      </CardContent>
      <div className="flex items-center justify-between border-t p-4 bg-muted/30 rounded-b-lg">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2" title='Upload Date'>
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2" title='Total Size'>
              <HardDrive className="h-4 w-4" />
              <span>{totalSize} MB</span>
            </div>
            <div className="flex items-center gap-2" title='Total Downloads'>
              <Download className="h-4 w-4" />
              <span>{downloads.toLocaleString()}</span>
            </div>
          </div>
      </div>
    </Card>
  );
}
