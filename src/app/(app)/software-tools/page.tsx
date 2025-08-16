
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2 } from 'lucide-react';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SoftwareToolsPage() {
  const [resources, setResources] = useState<ListResourcesOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
          category: 'software-tools',
        });
        setResources(fetchedResources);
      } catch (error) {
        console.error("Failed to fetch software tools:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">Software Tools</h1>
        <p className="text-muted-foreground mt-1">Browse all essential software tools</p>
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
            <h3 className='text-xl font-semibold'>No Software Tools Found</h3>
            <p className='text-muted-foreground mt-2'>Please connect to GitHub in the admin panel and upload some software tools.</p>
        </div>
      )}
    </div>
  );
}
