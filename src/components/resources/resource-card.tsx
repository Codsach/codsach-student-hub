
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, HardDrive, Download, Tag, Circle } from 'lucide-react';
import Link from 'next/link';

interface ResourceCardProps {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  date: string;
  size: string;
  downloads: number;
  downloadUrl?: string;
  subject?: string;
  semester?: string;
  year?: string;
}

export function ResourceCard({ title, description, tags, keywords, date, size, downloads, downloadUrl, subject, semester, year }: ResourceCardProps) {
  
  const getCategoryName = (tag: string) => {
    switch (tag) {
        case 'notes': return 'Notes';
        case 'lab-programs': return 'Lab Programs';
        case 'question-papers': return 'Question Papers';
        case 'software-tools': return 'Software Tools';
        default: return tag.toUpperCase();
    }
  }

  const getDownloadLink = () => {
    if (!downloadUrl) return '#';
    // Check if it's a Google Drive link and convert it for direct download
    if (downloadUrl.includes('drive.google.com')) {
      const regex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
      const match = downloadUrl.match(regex);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return downloadUrl;
  };

  return (
    <Card className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">{getCategoryName(tag)}</Badge>
          ))}
          {subject && <Badge variant="outline">{subject}</Badge>}
          {semester && <Badge variant="outline">Sem {semester}</Badge>}
          {year && <Badge variant="outline">{year}</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
          <Circle className="h-3 w-3 fill-current" />
          {keywords.map((keyword, index) => (
            <span key={index}>{keyword}</span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span>{size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{downloads}</span>
            </div>
          </div>
          <Button asChild disabled={!downloadUrl}>
            <Link href={getDownloadLink()} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
