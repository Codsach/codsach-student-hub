'use server';
/**
 * @fileOverview A flow for listing resources from a GitHub repository.
 *
 * - listResources - A function that handles listing resources from GitHub.
 * - ListResourcesInput - The input type for the listResources function.
 * - ListResourcesOutput - The return type for the listResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const ListResourcesInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  category: z.string().describe('The category (directory) to list resources from.'),
});
export type ListResourcesInput = z.infer<typeof ListResourcesInputSchema>;

const ResourceSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    subject: z.string().optional(),
    semester: z.string().optional(),
    year: z.string().optional(),
    keywords: z.array(z.string()),
    date: z.string(),
    size: z.string(),
    downloads: z.number(),
    downloadUrl: z.string(),
    fileName: z.string(),
});

const ListResourcesOutputSchema = z.array(ResourceSchema);
export type ListResourcesOutput = z.infer<typeof ListResourcesOutputSchema>;


export async function listResources(
  input: ListResourcesInput
): Promise<ListResourcesOutput> {
  return listResourcesFlow(input);
}


const listResourcesFlow = ai.defineFlow(
  {
    name: 'listResourcesFlow',
    inputSchema: ListResourcesInputSchema,
    outputSchema: ListResourcesOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');

    try {
      const { data: files } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: input.category,
      });

      if (!Array.isArray(files)) {
        return [];
      }
      
      const resourceFiles = files.filter(file => !file.name.endsWith('.json') && file.type === 'file');

      const resources = await Promise.all(resourceFiles.map(async (file: any) => {
        const metadataPath = file.path.replace(/\.[^/.]+$/, "") + '.json';
        let metadata: any = {
            title: file.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ""),
            description: 'No description available.',
            tags: [input.category],
            keywords: [file.name.split('.')[0]],
            subject: undefined,
            semester: undefined,
            year: undefined,
        };

        try {
            const { data: metadataFile } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: metadataPath,
            });
            if ('content' in metadataFile) {
                const metadataContent = Buffer.from(metadataFile.content, 'base64').toString('utf-8');
                const parsedMetadata = JSON.parse(metadataContent);
                metadata = { ...metadata, ...parsedMetadata };
            }
        } catch (e) {
            console.log(`No metadata file found for ${file.name}`);
        }
        
        const commitResponse = await octokit.rest.repos.listCommits({
            owner,
            repo,
            path: file.path,
            per_page: 1,
        });
        const lastCommit = commitResponse.data[0];

        return {
          title: metadata.title,
          description: metadata.description,
          tags: metadata.tags,
          subject: metadata.subject,
          semester: metadata.semester,
          year: metadata.year,
          keywords: metadata.keywords || [],
          date: lastCommit ? new Date(lastCommit.commit.author?.date!).toLocaleDateString() : new Date().toLocaleDateString(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          downloads: 0, // Download count would need a separate tracking mechanism
          downloadUrl: file.download_url,
          fileName: file.name,
        };
      }));

      return resources;
    } catch (error: any) {
       if (error.status === 404) {
        return []; // Directory doesn't exist, return empty array
      }
      console.error('Failed to list resources from GitHub:', error);
      return [];
    }
  }
);
