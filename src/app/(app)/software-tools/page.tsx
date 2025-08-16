
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SoftwareToolsClient } from '@/components/resources/software-tools-client';

async function SoftwareToolsPageData() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        // This will only work if the GITHUB_TOKEN is set in the environment
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            resources = await listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category: 'software-tools',
            });
        } else {
            error = "GitHub token is not configured on the server. Please set the GITHUB_TOKEN environment variable.";
        }
    } catch (e: any) {
        console.error("Failed to fetch software tools on server:", e);
        // Don't throw an error, let the client handle it
        error = "Could not fetch resources from GitHub on the server.";
    }
    
    return <SoftwareToolsClient initialResources={resources} serverError={error} />;
}


export default function SoftwareToolsPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <SoftwareToolsPageData />
        </Suspense>
    )
}
