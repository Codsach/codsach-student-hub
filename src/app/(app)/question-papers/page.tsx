
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function QuestionPapersPage() {
  const [allResources, setAllResources] = useState<ListResourcesOutput>([]);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');

  useEffect(() => {
    const fetchResources = async () => {
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
          category: 'question-papers',
        });
        setAllResources(fetchedResources);
        setFilteredResources(fetchedResources);
      } catch (error) {
        console.error("Failed to fetch question papers:", error);
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
  }, [toast]);
  
   useEffect(() => {
    let resources = [...allResources];

    // Filtering
    if (subjectFilter !== 'all') {
      resources = resources.filter(r => r.subject === subjectFilter);
    }
    if (yearFilter !== 'all') {
        resources = resources.filter(r => r.year === yearFilter);
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
  }, [allResources, subjectFilter, yearFilter, sortOrder]);

  const uniqueSubjects = ['all', ...Array.from(new Set(allResources.map(r => r.subject).filter(Boolean))) as string[]];
  const uniqueYears = ['all', ...Array.from(new Set(allResources.map(r => r.year).filter(Boolean))) as string[]];

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Question Papers</h1>
        <p className="text-muted-foreground mt-1">Browse all previous year question papers</p>
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
            <label htmlFor="year" className="text-sm font-medium">Year</label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger id="year">
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
            <h3 className='text-xl font-semibold'>No Question Papers Found</h3>
            <p className='text-muted-foreground mt-2'>Please connect to GitHub in the admin panel and upload some question papers.</p>
        </div>
      )}
    </div>
  );
}
