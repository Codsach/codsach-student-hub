
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LabProgramsClient } from '@/components/resources/lab-programs-client';

async function LabProgramsPageData() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            throw new Error("GitHub token is not configured on the server.");
        }
        resources = await listResources({
            githubToken,
            repository: 'Codsach/codsach-resources',
            category: 'lab-programs',
        });
    } catch (e: any) {
        console.error("Failed to fetch lab programs on server:", e);
        error = "Could not fetch resources from GitHub. Please ensure your GitHub token is configured correctly.";
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    return <LabProgramsClient initialResources={resources} />;
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
