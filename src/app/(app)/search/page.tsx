
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2, SearchX } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

function SearchResultsLoader() {
  const [allFetchedResources, setAllFetchedResources] = useState<ListResourcesOutput>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        // This is a client component, so we need to call a route handler or server action
        // to securely access environment variables. For now, we'll create an API route.
        // This part would need to be implemented. For now, we will simulate the fetch.
        // In a real scenario, you'd fetch from '/api/resources'.
        setServerError("Search functionality requires a backend endpoint to securely fetch all resources. This has not been implemented yet.");
      } catch (e: any) {
        setServerError(e.message || "Failed to fetch resources for search.");
      } finally {
        setIsLoading(false);
      }
    }
    // This is a placeholder. In a real app, we would fetch the resources from an API route.
    // For now, we'll just show the error that this needs to be built.
    setAllFetchedResources([]);
    setIsLoading(false);
  }, []);

  return <SearchResults allFetchedResources={allFetchedResources} serverError={serverError} />;
}

function SearchResults({allFetchedResources, serverError}: {allFetchedResources: ListResourcesOutput, serverError: string | null}) {
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(allFetchedResources);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
   useEffect(() => {
    if (serverError) {
        toast({
            title: 'Error Loading Search',
            description: serverError,
            variant: 'destructive',
        });
    }
  }, [serverError, toast]);

  useEffect(() => {
    setIsLoading(true);
    if (!searchQuery) {
      setFilteredResources(allFetchedResources);
      setIsLoading(false);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allFetchedResources.filter(r => 
        r.title.toLowerCase().includes(lowerCaseQuery) ||
        r.description.toLowerCase().includes(lowerCaseQuery) ||
        r.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)) ||
        (r.subject && r.subject.toLowerCase().includes(lowerCaseQuery)) ||
        (r.keywords && r.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
    );
    
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredResources(results);
    setIsLoading(false);
  }, [allFetchedResources, searchQuery]);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        {searchQuery ? (
            <p className="text-muted-foreground mt-1">Showing results for: <span className="text-foreground font-semibold">&quot;{searchQuery}&quot;</span></p>
        ) : (
            <p className="text-muted-foreground mt-1">Please enter a search term to find resources.</p>
        )}
      </div>

       {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
       ) : serverError ? (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Search Not Available</AlertTitle>
            <AlertDescription>
                The global search feature is not fully implemented. Resources must be fetched on the server, but this is a client page. Please browse resources via their category pages.
            </AlertDescription>
        </Alert>
       ) : filteredResources.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">Found {filteredResources.length} matching resources</p>
          <div className="space-y-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard key={`${resource.folderName}-${index}`} {...resource} />
            ))}
          </div>
        </>
      ) : (
         <div className='text-center py-20 bg-card rounded-lg'>
            <SearchX className='mx-auto h-16 w-16 text-muted-foreground' />
            <h3 className='mt-4 text-xl font-semibold'>No Results Found</h3>
            <p className='text-muted-foreground mt-2'>We couldn&apos;t find any resources matching your search.</p>
        </div>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <SearchResultsLoader />
        </Suspense>
    )
}
