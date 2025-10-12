
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { NotesClient } from '@/components/resources/notes-client';

export const revalidate = 0;

export default async function NotesPage() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;

    try {
        const githubToken = process.env.GITHUB_TOKEN;
        
        if (!githubToken) {
            throw new Error("Server configuration error: GITHUB_TOKEN is missing.");
        }
        resources = await listResources({
            githubToken,
            repository: 'Codsach/codsach-resources',
            category: 'notes',
        });
    } catch (e: any)
    {
        console.error("Failed to fetch notes on server:", e);
        error = "Could not fetch resources from GitHub. This is likely due to a server configuration issue (missing GITHUB_TOKEN).";
    }

    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <NotesClient initialResources={resources} serverError={error} />
        </Suspense>
    )
}
