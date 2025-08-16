
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
import { listResources, type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


export function NotesClient({ initialResources, serverError }: { initialResources: ListResourcesOutput, serverError: string | null }) {
  const [resources, setResources] = useState<ListResourcesOutput>(initialResources);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(initialResources);
  const [isLoading, setIsLoading] = useState(initialResources.length === 0 && !serverError);
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const searchQuery = searchParams.get('q') || '';


   useEffect(() => {
    async function fetchClientSide() {
        if (initialResources.length === 0 && !serverError) {
            setIsLoading(true);
            const githubToken = localStorage.getItem('githubToken');
            if (!githubToken) {
                toast({
                  title: 'GitHub Not Connected',
                  description: 'Please connect your GitHub account in the admin panel to see resources.',
                  variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }
            try {
                const fetchedResources = await listResources({
                    githubToken,
                    repository: 'Codsach/codsach-resources',
                    category: 'notes',
                });
                setResources(fetchedResources);
            } catch (error) {
                console.error("Failed to fetch resources on client:", error);
                toast({
                  title: 'Error',
                  description: 'Could not fetch resources from GitHub.',
                  variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        }
    }
    fetchClientSide();
  }, [initialResources.length, serverError, toast]);

   useEffect(() => {
    let resourcesToFilter = [...resources];

    // Filtering
    if (subjectFilter !== 'all') {
      resourcesToFilter = resourcesToFilter.filter(r => r.subject === subjectFilter);
    }
    if (semesterFilter !== 'all') {
        resourcesToFilter = resourcesToFilter.filter(r => r.semester === semesterFilter);
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
  }, [resources, subjectFilter, semesterFilter, sortOrder, searchQuery]);

  const uniqueSubjects = ['all', ...Array.from(new Set(resources.map(r => r.subject).filter(Boolean))) as string[]];
  const uniqueSemesters = ['all', ...Array.from(new Set(resources.map(r => r.semester).filter(Boolean))) as string[]];


  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="text-muted-foreground mt-1">Browse all subject notes</p>
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
            <label htmlFor="semester-desktop" className="text-sm font-medium">Semester</label>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger id="semester-desktop">
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
                                <label htmlFor="semester-mobile" className="text-sm font-medium">Semester</label>
                                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                <SelectTrigger id="semester-mobile">
                                    <SelectValue placeholder="All Semesters" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueSemesters.map(sem => (
                                        <SelectItem key={sem} value={sem}>{sem === 'all' ? 'All Semesters' : `Sem ${sem}`}</SelectItem>
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
            <h3 className='text-xl font-semibold'>No Notes Found</h3>
            <p className='text-muted-foreground mt-2'>Please connect to GitHub or try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
