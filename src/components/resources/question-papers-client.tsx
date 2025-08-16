
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
import { ListFilter, Loader2, SlidersHorizontal } from 'lucide-react';
import { type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export function QuestionPapersClient({ initialResources, serverError }: { initialResources: ListResourcesOutput, serverError: string | null }) {
  const [resources, setResources] = useState<ListResourcesOutput>(initialResources);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(initialResources);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const searchQuery = searchParams.get('q') || '';

  
   useEffect(() => {
    if (serverError) {
        toast({
            title: 'Error',
            description: serverError,
            variant: 'destructive',
        });
    }
  }, [serverError, toast]);

   useEffect(() => {
    let resourcesToFilter = [...resources];

    // Filtering
    if (subjectFilter !== 'all') {
      resourcesToFilter = resourcesToFilter.filter(r => r.subject === subjectFilter);
    }
    if (yearFilter !== 'all') {
        resourcesToFilter = resourcesToFilter.filter(r => r.year === yearFilter);
    }
     // Search
    if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        resourcesToFilter = resourcesToFilter.filter(r => 
            r.title.toLowerCase().includes(lowerCaseQuery) ||
            r.description.toLowerCase().includes(lowerCaseQuery) ||
            r.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)) ||
            (r.keywords && r.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
        );
    }
    
    // Sorting
    if (sortOrder === 'date') {
      resourcesToFilter.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === 'downloads') {
      resourcesToFilter.sort((a, b) => b.downloads - a.downloads);
    } else if (sortOrder === 'name') {
      resourcesToFilter.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredResources(resourcesToFilter);
  }, [resources, subjectFilter, yearFilter, sortOrder, searchQuery]);

  const uniqueSubjects = ['all', ...Array.from(new Set(resources.map(r => r.subject).filter(Boolean))) as string[]];
  const uniqueYears = ['all', ...Array.from(new Set(resources.map(r => r.year).filter(Boolean))) as string[]];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Question Papers</h1>
        <p className="text-muted-foreground mt-1">Browse all previous year question papers</p>
      </div>

      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm mb-8">
         {/* Desktop Filters */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="subject-desktop" className="text-sm font-medium">Subject</label>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger id="subject-desktop">
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
            <label htmlFor="year-desktop" className="text-sm font-medium">Year</label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger id="year-desktop">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                 {uniqueYears.map(year => (
                  <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-start-4">
             <label htmlFor="sort-desktop" className="text-sm font-medium">Sort by</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sort-desktop">
                <SelectValue placeholder="Upload Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Upload Date</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filters */}
         <div className="lg:hidden">
            <Accordion type="single" collapsible>
                <AccordionItem value="filters">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span>Filter & Sort</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="subject-mobile" className="text-sm font-medium">Subject</label>
                                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger id="subject-mobile">
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
                                <label htmlFor="year-mobile" className="text-sm font-medium">Year</label>
                                <Select value={yearFilter} onValueChange={setYearFilter}>
                                <SelectTrigger id="year-mobile">
                                    <SelectValue placeholder="All Years" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueYears.map(year => (
                                    <SelectItem key={year} value={year}>{year === 'all' ? 'All Years' : year}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="sort-mobile" className="text-sm font-medium">Sort by</label>
                                <Select value={sortOrder} onValueChange={setSortOrder}>
                                    <SelectTrigger id="sort-mobile">
                                    <SelectValue placeholder="Upload Date" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    <SelectItem value="date">Upload Date</SelectItem>
                                    <SelectItem value="downloads">Downloads</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                       </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
      </div>
      
       {isLoading ? (
         <div className='flex justify-center items-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
       ) : filteredResources.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">Showing {filteredResources.length} of {resources.length} resources</p>
          <div className="space-y-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </>
      ) : (
         <div className='text-center py-12'>
            <h3 className='text-xl font-semibold'>No Question Papers Found</h3>
            <p className='text-muted-foreground mt-2'>Please ensure the GITHUB_TOKEN is set on the server and resources have been uploaded.</p>
        </div>
      )}
    </div>
  );
}
