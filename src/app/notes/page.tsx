
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

export default function NotesPage() {
  const resources = [
    {
      title: 'Advanced Java Notes',
      description: 'In-depth notes on Advanced Java topics including Servlets, JSP, JDBC, and more.',
      tags: ['Notes', 'Java', 'Sem 2'],
      keywords: ['servlets', 'jsp', 'jdbc', '+2 more'],
      date: 'Feb 10, 2024',
      size: '5.2 MB',
      downloads: 312,
    },
    {
      title: 'DBMS Notes - Normalization',
      description: 'Detailed explanation of database normalization forms (1NF, 2NF, 3NF, BCNF) with examples.',
      tags: ['Notes', 'DBMS', 'Sem 1'],
      keywords: ['normalization', 'database', '1nf', '+2 more'],
      date: 'Jan 22, 2024',
      size: '3.1 MB',
      downloads: 450,
    },
  ];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-1">Browse all subject notes</p>
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
                <SelectItem value="java">Advanced Java</SelectItem>
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
