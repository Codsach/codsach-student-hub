
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

export default function LabProgramsPage() {
  const resources = [
    {
      title: 'Data Structures and Algorithms Lab Programs',
      description: 'Complete implementation of all DSA lab programs including sorting algorithms, trees, graphs, and more.',
      tags: ['Lab Programs', 'Data Structures', 'Sem 1'],
      keywords: ['algorithms', 'sorting', 'trees', '+1 more'],
      date: 'Jan 15, 2024',
      size: '2.5 MB',
      downloads: 245,
    },
    // Add more resource objects here
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lab Programs</h1>
        <p className="text-muted-foreground mt-1">Browse all lab programs</p>
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
            <label htmlFor="semester" className="text-sm font-medium">Semester</label>
            <Select>
              <SelectTrigger id="semester">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="sem1">Sem 1</SelectItem>
                <SelectItem value="sem2">Sem 2</SelectItem>
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
