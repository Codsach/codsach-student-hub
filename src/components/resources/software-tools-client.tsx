
'use client';

import { ResourceCard } from '@/components/resources/resource-card';
import { Loader2 } from 'lucide-react';
import { type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function SoftwareToolsClient({ initialResources, serverError }: { initialResources: ListResourcesOutput, serverError: string | null }) {
  const [resources, setResources] = useState<ListResourcesOutput>(initialResources);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (serverError) {
        toast({
            title: 'Error',
            description: serverError,
            variant: 'destructive',
        });
    }
  }, [serverError, toast]);

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
            <p className='text-muted-foreground mt-2'>Please ensure the GITHUB_TOKEN is set on the server and resources have been uploaded.</p>
        </div>
      )}
    </div>
  );
}
