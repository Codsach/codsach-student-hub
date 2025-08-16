
'use client';

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
import { type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function LabProgramsClient({ initialResources }: { initialResources: ListResourcesOutput }) {
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(initialResources);
  const searchParams = useSearchParams();
  
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const searchQuery = searchParams.get('q') || '';
  
   useEffect(() => {
    let resources = [...initialResources];

    // Filtering
    if (subjectFilter !== 'all') {
      resources = resources.filter(r => r.subject === subjectFilter);
    }
    if (semesterFilter !== 'all') {
        resources = resources.filter(r => r.semester === semesterFilter);
    }
    
    // Search
    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        resources = resources.filter(r => 
            r.title.toLowerCase().includes(lowerCaseQuery) ||
            r.description.toLowerCase().includes(lowerCaseQuery) ||
            r.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)) ||
            (r.keywords && r.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
        );
    }
    
    // Sorting
    if (sortOrder === 'date') {
      resources.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'downloads') {
      resources.sort((a, b) => b.downloads - a.downloads);
    } else if (sortOrder === 'name') {
      resources.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredResources(resources);
  }, [initialResources, subjectFilter, semesterFilter, sortOrder, searchQuery]);

  const uniqueSubjects = ['all', ...Array.from(new Set(initialResources.map(r => r.subject).filter(Boolean))) as string[]];
  const uniqueSemesters = ['all', ...Array.from(new Set(initialResources.map(r => r.semester).filter(Boolean))) as string[]];


  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lab Programs</h1>
        <p className="text-muted-foreground mt-1">Browse all lab programs</p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                 {uniqueSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject === 'all' ? 'All Subjects' : subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="semester" className="text-sm font-medium">Semester</label>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger id="semester">
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                 {uniqueSemesters.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem === 'all' ? 'All Semesters' : `Sem ${sem}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-start-4">
             <label htmlFor="sort" className="text-sm font-medium">Sort by</label>
            <div className="flex gap-2">
              <Select value={sortOrder} onValueChange={setSortOrder}>
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
      
       {filteredResources.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">Showing {filteredResources.length} of {initialResources.length} resources</p>
          <div className="space-y-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </>
      ) : (
         <div className='text-center py-12'>
            <h3 className='text-xl font-semibold'>No Lab Programs Found</h3>
            <p className='text-muted-foreground mt-2'>Please try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
