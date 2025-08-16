
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { QuestionPapersClient } from '@/components/resources/question-papers-client';

async function QuestionPapersPageData() {
    let resources: ListResourcesOutput = [];
    let error: string | null = null;
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        if (githubToken) {
            resources = await listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category: 'question-papers',
            });
        } else {
            error = "GitHub token is not configured on the server. Please set the GITHUB_TOKEN environment variable.";
        }
    } catch (e: any) {
        console.error("Failed to fetch question papers on server:", e);
        error = "Could not fetch resources from GitHub on the server.";
    }

    return <QuestionPapersClient initialResources={resources} serverError={error} />;
}


export default function QuestionPapersPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className='flex justify-center items-center py-12'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                </div>
            </div>
        }>
            <QuestionPapersPageData />
        </Suspense>
    )
}
