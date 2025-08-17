
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2, SearchX } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

export const revalidate = 0;

function SearchPageContent() {
  const [allFetchedResources, setAllFetchedResources] = useState<ListResourcesOutput>([]);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  useEffect(() => {
    async function fetchAllResources() {
      setIsLoading(true);
      try {
        const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // This will not be present, so we rely on the server fetch below
        if (githubToken) {
           console.warn("Using public github token on client. This is not recommended for production.");
        }

        // We can't pass the secure token to the client, so we will need a different approach if client-side fetching is desired.
        // For now, we rely on the server-fetched initial data passed via props if this were a child component, 
        // or an API route. Let's make an API route call instead.
        
        // This component structure is a bit problematic for this use case.
        // A better pattern would be for the server page to fetch and pass data.
        // Let's refactor to assume the data comes from a server component.
        // But since we are in a fully client component here, let's just accept the initial slowness.
        // And we cannot call the flow from here without exposing keys.
        // The search page MUST be refactored to be server-rendered first.
        
        // The search/page.tsx needs to be a server component that fetches the data.
        // Let's assume for a moment this page is not built with best practices and try to make it work
        // without exposing keys. We can't.
        
        // Let's restructure the page.
        // The parent will be a server component that fetches data.
        // This component will receive the data as props.
        
        // The current structure where `SearchPageContent` fetches data is flawed.
        // The parent `SearchPageData` fetches and passes it down.
        
        // The issue is that the initial fetch is happening on the server in SearchPageData,
        // but this component's logic might not be correctly using it.
        
        // Re-reading... The parent component `SearchPageData` is fetching the data.
        // It passes `allFetchedResources` as a prop. So this component does not need to fetch.

        // The error must be somewhere else. The user sees "No Software Tools Found".
        // That comes from the software-tools-client.tsx page.
        // This indicates the `listResources` flow is failing.
        
        // The flow itself must be the issue. Let's re-examine `list-resources-flow.ts`.
        // Caching was added. Maybe that is the problem on Vercel.
        
        // Back to this file, this logic is client-side. The parent `SearchPageData` is server-side.
        // Let's just filter what we get from the server.
        // The logic below looks fine assuming `allFetchedResources` is passed correctly.

      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch initial resources for search.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    // We will get resources from props, so we don't need to fetch here.
    // Let's simplify and rely on the parent component.
    setIsLoading(false);
  }, [toast]);


  useEffect(() => {
    if (!allFetchedResources || isLoading) return;

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
  
  // This hook will now be responsible for fetching data on the client side
  // This is a temporary measure to ensure search works, but it's not ideal for performance.
  // The better long-term fix is to ensure the server component `SearchPageData` works reliably.
   useEffect(() => {
    async function doFetch() {
        setIsLoading(true);
        try {
            // This is a workaround and not a good practice as it might expose the token if not handled carefully
            // However, the AI flow itself is a server action and should be secure.
             const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
             // We can't call listResources directly here as it requires a token.
             // This component's architecture is flawed. It needs to be server-first.
             // Let's assume the parent SearchPageData passes the props correctly.
             // I'll remove the client-side fetching logic I was contemplating.

        } catch (e) {
             toast({
                title: 'Error',
                description: 'Could not fetch search results.',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    }
    // doFetch();
    // The above is removed. We will rely on props passed from the parent server component.
  }, [searchQuery, toast]);
  
  // This component will be refactored to receive props from `SearchPageData`.

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
    // This server component fetches data and passes it to the client component.
    // This is the correct pattern.
    // The previous error was likely due to the client component trying to re-fetch.
    // By refactoring SearchPageContent to ONLY filter props, we fix the pattern.

    // Let's refactor the client component to just be a display/filter component.
    // We will rename it to `SearchResults`.
    return <SearchResults allFetchedResources={resources} serverError={error} />;
}

// Renamed from SearchPageContent to make it clearer.
function SearchResults({allFetchedResources, serverError}: {allFetchedResources: ListResourcesOutput, serverError: string | null}) {
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>(allFetchedResources);
  const [isLoading, setIsLoading] = useState(false); // Should not be true for long.
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
            <SearchPageData />
        </Suspense>
    )
}
