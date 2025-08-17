
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2, SearchX } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';

function SearchPageContent() {
  const [allResources, setAllResources] = useState<ListResourcesOutput>([]);
  const [filteredResources, setFilteredResources] = useState<ListResourcesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      // This is a secure server action proxy. The client does not need a token.
      try {
        const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
        const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

        if (!githubToken) {
          throw new Error('GitHub token is not configured on the server.');
        }

        const resourcePromises = categories.map(category => 
            listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category,
            })
        );
        const results = await Promise.all(resourcePromises);
        const allFetchedResources = results.flat();

        setAllResources(allFetchedResources);
      } catch (error: any) {
        console.error("Failed to fetch resources for search:", error);
        toast({
          title: 'Error',
          description: error.message || 'Could not fetch resources from GitHub for search.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);
  
  useEffect(() => {
    if (isLoading) return;

    if (!searchQuery) {
      setFilteredResources(allResources);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allResources.filter(r => 
        r.title.toLowerCase().includes(lowerCaseQuery) ||
        r.description.toLowerCase().includes(lowerCaseQuery) ||
        r.tags.some(t => t.toLowerCase().includes(lowerCaseQuery)) ||
        (r.subject && r.subject.toLowerCase().includes(lowerCaseQuery)) ||
        (r.keywords && r.keywords.some(k => k.toLowerCase().includes(lowerCaseQuery)))
    );
    
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredResources(results);
  }, [allResources, searchQuery, isLoading]);

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
            <SearchPageContent />
        </Suspense>
    )
}
