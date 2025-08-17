
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SoftwareToolsClient } from '@/components/resources/software-tools-client';

export const revalidate = 0;

export default async function SoftwareToolsPage() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!githubToken || !geminiApiKey) {
            error = "Server configuration error: Required environment variables (GITHUB_TOKEN, GEMINI_API_KEY) are missing. Please set them in your deployment environment.";
        } else {
            resources = await listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category: 'software-tools',
            });
        }
    } catch (e: any) {
        console.error("Failed to fetch software tools on server:", e);
        error = "Could not fetch resources from GitHub on the server. The server logs may have more details.";
    }
    
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <SoftwareToolsClient initialResources={resources} serverError={error} />
        </Suspense>
    )
}
