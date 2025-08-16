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

const FileSchema = z.object({
    name: z.string(),
    size: z.string(),
    downloadUrl: z.string().nullable(),
});

const ResourceSchema = z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    subject: z.string().optional(),
    semester: z.string().optional(),
    year: z.string().optional(),
    keywords: z.array(z.string()),
    date: z.string(),
    downloads: z.number(),
    files: z.array(FileSchema),
    folderName: z.string(),
    downloadUrl: z.string().optional().nullable(),
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
      const { data: resourceFolders } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: input.category,
      });

      if (!Array.isArray(resourceFolders)) {
        return [];
      }
      
      const directories = resourceFolders.filter(item => item.type === 'dir');

      const resources = await Promise.all(directories.map(async (dir: any) => {
        let metadata: any = {};
        
        try {
            const { data: metadataFile } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: `${dir.path}/metadata.json`,
            });

            if ('content' in metadataFile) {
                const metadataContent = Buffer.from(metadataFile.content, 'base64').toString('utf-8');
                metadata = JSON.parse(metadataContent);
            }
        } catch (e) {
            console.error(`Error fetching metadata for ${dir.name}:`, e);
            return null;
        }

        const { data: dirContents } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: dir.path,
        });

        const resourceFiles = Array.isArray(dirContents) ? dirContents.filter(item => item.name !== 'metadata.json') : [];

        const commitResponse = await octokit.rest.repos.listCommits({
            owner,
            repo,
            path: `${dir.path}/metadata.json`,
            per_page: 1,
        });
        const lastCommit = commitResponse.data[0];

        return {
          title: metadata.title || dir.name.replace(/[-_]/g, ' '),
          description: metadata.description || 'No description available.',
          tags: metadata.tags || [input.category],
          subject: metadata.subject,
          semester: metadata.semester,
          year: metadata.year,
          keywords: metadata.keywords || [],
          date: lastCommit ? new Date(lastCommit.commit.author?.date!).toLocaleDateString() : new Date().toLocaleDateString(),
          downloads: 0, 
          folderName: dir.name,
          downloadUrl: metadata.downloadUrl,
          files: resourceFiles.map((file: any) => ({
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            downloadUrl: file.download_url,
          }))
        };
      }));

      return resources.filter((r): r is ListResourcesOutput[0] => r !== null);

    } catch (error: any) {
       if (error.status === 404) {
        return []; 
      }
      console.error('Failed to list resources from GitHub:', error);
      return [];
    }
  }
);
