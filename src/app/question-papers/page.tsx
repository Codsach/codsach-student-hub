
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ResourceCard } from '@/components/resources/resource-card';
import { ListFilter } from 'lucide-react';

export default function QuestionPapersPage() {
  const resources = [
    {
      title: 'DSA Mid-Term Question Paper 2023',
      description: 'Mid-term question paper for Data Structures and Algorithms from the previous year.',
      tags: ['Question Paper', 'DSA', 'Sem 1'],
      keywords: ['mid-term', '2023', 'exam'],
      date: 'Mar 05, 2024',
      size: '1.2 MB',
      downloads: 180,
    },
    {
      title: 'DBMS Final Exam Paper 2022',
      description: 'Final examination paper for Database Management Systems, with solutions.',
      tags: ['Question Paper', 'DBMS', 'Sem 1'],
      keywords: ['final-exam', '2022', 'solutions'],
      date: 'Feb 28, 2024',
      size: '1.8 MB',
      downloads: 210,
    },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Question Papers</h1>
        <p className="text-muted-foreground mt-1">Browse all previous year question papers</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Select>
              <SelectTrigger id="subject">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="dsa">Data Structures</SelectItem>
                <SelectItem value="dbms">DBMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="year" className="text-sm font-medium">Year</label>
            <Select>
              <SelectTrigger id="year">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-start-4">
             <label htmlFor="sort" className="text-sm font-medium">Sort by</label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Upload Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Upload Date</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">Showing {resources.length} of {resources.length} resources</p>

      <div className="space-y-6">
        {resources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
    </div>
  );
}
