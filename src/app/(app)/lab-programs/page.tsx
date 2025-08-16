
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LabProgramsClient } from '@/components/resources/lab-programs-client';

async function LabProgramsPageData() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        // This will only work if the GITHUB_TOKEN is set in the environment
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            resources = await listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category: 'lab-programs',
            });
        }
    } catch (e: any) {
        console.error("Failed to fetch lab programs on server:", e);
        // Don't throw an error, let the client handle it
        error = "Could not fetch resources from GitHub on the server.";
    }

    // Pass the server-fetched resources (or empty array) to the client component
    // The client component will handle fetching if initialResources is empty.
    return <LabProgramsClient initialResources={resources} serverError={error} />;
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
            <LabProgramsPageData />
        </Suspense>
    )
}
