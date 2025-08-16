
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
import { ListFilter, Loader2 } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';


async function LabProgramsPageData() {
  const { toast } = useToast();
  // This is a server component, but we need a token.
  // In a real app, you'd get this from a secure server-side store or environment variable.
  // For this prototype, we are assuming it might not work server-side without a logged-in user context
  // that can provide the token. The original implementation had it in localStorage,
  // which is client-side only. This is a conceptual refactor.
   let resources: ListResourcesOutput = [];
    try {
        // This flow would need a way to get the token on the server.
        // For now, we will leave the client-side fetching as a fallback.
        // In a real app, this would be `await listResources(...)`
    } catch (error) {
        console.error("Failed to fetch lab programs on server:", error);
         toast({
          title: 'Error',
          description: 'Could not fetch resources from GitHub on the server.',
          variant: 'destructive',
        });
    }

  return <LabProgramsPageContent initialResources={resources} />;
}


function LabProgramsPageContent({ initialResources }: { initialResources: ListResourcesOutput }) {
  const [allResources, setAllResources] = useState<ListResourcesOutput>(initialResources);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(initialResources);
  const [isLoading, setIsLoading] = useState(initialResources.length === 0);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResources = async () => {
      // Only fetch on client if initial data is not present
      if (initialResources.length > 0) return;

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
          category: 'lab-programs',
        });
        setAllResources(fetchedResources);
        setFilteredResources(fetchedResources);
      } catch (error) {
        console.error("Failed to fetch lab programs:", error);
        toast({
          title: 'Error',
          description: 'Could not fetch resources from GitHub.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [toast, initialResources]);
  
   useEffect(() => {
    let resources = [...allResources];

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
  }, [allResources, subjectFilter, semesterFilter, sortOrder, searchQuery]);

  const uniqueSubjects = ['all', ...Array.from(new Set(allResources.map(r => r.subject).filter(Boolean))) as string[]];
  const uniqueSemesters = ['all', ...Array.from(new Set(allResources.map(r => r.semester).filter(Boolean))) as string[]];


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
      
       {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : filteredResources.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">Showing {filteredResources.length} of {allResources.length} resources</p>
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

export default function LabProgramsPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <LabProgramsPageContent initialResources={[]} />
        </Suspense>
    )
}
