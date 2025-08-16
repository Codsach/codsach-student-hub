
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

export default function NotesPage() {
  const [resources, setResources] = useState<ListResourcesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      const githubToken = localStorage.getItem('githubToken');
      if (!githubToken) {
        // Not showing a toast here as it could be annoying for non-admin users.
        // A better approach would be to have a public API endpoint.
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
        console.error("Failed to fetch notes:", error);
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
      
      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : resources.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">Showing {resources.length} of {resources.length} resources</p>
          <div className="space-y-6">
            {resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </>
      ) : (
         <div className='text-center py-12'>
            <h3 className='text-xl font-semibold'>No Notes Found</h3>
            <p className='text-muted-foreground mt-2'>Please connect to GitHub in the admin panel to see your uploaded notes.</p>
        </div>
      )}
    </div>
  );
}
