
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2, SearchX } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

function SearchPageContent({allFetchedResources, serverError}: {allFetchedResources: ListResourcesOutput, serverError: string | null}) {
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(allFetchedResources);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
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
    if (isLoading) return;

    if (!searchQuery) {
      setFilteredResources(allFetchedResources);
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
  }, [allFetchedResources, searchQuery, isLoading]);

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


async function SearchPageData() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!githubToken || !geminiApiKey) {
            error = "Server configuration error: Required environment variables (GITHUB_TOKEN, GEMINI_API_KEY) are missing. Please set them in your deployment environment.";
        } else {
             const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
             const resourcePromises = categories.map(category => 
                listResources({
                    githubToken,
                    repository: 'Codsach/codsach-resources',
                    category,
                })
            );
            const results = await Promise.all(resourcePromises);
            resources = results.flat();
        }
    } catch (e: any) {
        console.error("Failed to fetch resources for search on server:", e);
        error = "Could not fetch resources from GitHub for search on the server. The server logs may have more details.";
    }
    return <SearchPageContent allFetchedResources={resources} serverError={error} />;
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
            <SearchPageData />
        </Suspense>
    )
}
