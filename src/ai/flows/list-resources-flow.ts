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
    keywords: z.array(z.string()),
    date: z.string(),
    size: z.string(),
    downloads: z.number(),
    downloadUrl: z.string(),
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
      
      const resources = await Promise.all(files.map(async (file: any) => {
        // For simplicity, we are using placeholder data for some fields.
        // A more robust solution would involve storing metadata alongside the files.
        const commitResponse = await octokit.rest.repos.listCommits({
            owner,
            repo,
            path: file.path,
            per_page: 1,
        });
        const lastCommit = commitResponse.data[0];

        return {
          title: file.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, ""),
          description: lastCommit ? lastCommit.commit.message : 'No description available.',
          tags: [input.category, 'new'],
          keywords: [file.name.split('.')[0]],
          date: lastCommit ? new Date(lastCommit.commit.author?.date!).toLocaleDateString() : new Date().toLocaleDateString(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          downloads: 0, // Download count would need a separate tracking mechanism
          downloadUrl: file.download_url,
        };
      }));

      return resources;
    } catch (error: any) {
       if (error.status === 404) {
        return []; // Directory doesn't exist, return empty array
      }
      console.error('Failed to list resources from GitHub:', error);
      // In a real app, you might want to throw the error or handle it differently
      return [];
    }
  }
);
