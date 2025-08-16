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
      
      const jsonFiles = files.filter(file => file.name.endsWith('.json') && file.type === 'file');

      const resources = await Promise.all(jsonFiles.map(async (jsonFile: any) => {
        let metadata: any = {};
        let fileDetails: any = {
            size: jsonFile.size,
            name: jsonFile.name.replace('.json', ''),
            path: jsonFile.path.replace('.json', ''),
            download_url: null,
        };

        try {
            const { data: metadataFile } = await octokit.rest.repos.getContent({
                owner,
                repo,
                path: jsonFile.path,
            });

            if ('content' in metadataFile) {
                const metadataContent = Buffer.from(metadataFile.content, 'base64').toString('utf-8');
                metadata = JSON.parse(metadataContent);
            }
        } catch (e) {
            console.error(`Error fetching metadata for ${jsonFile.name}:`, e);
            // If we can't get metadata, skip this resource
            return null;
        }

        // For non-software tools, try to get the corresponding file details
        if (input.category !== 'software-tools') {
            try {
                 const { data: resourceFile } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path: fileDetails.path,
                 });
                 if (!Array.isArray(resourceFile)) {
                     fileDetails = resourceFile;
                 }
            } catch(e) {
                console.log(`No corresponding resource file found for ${jsonFile.name}, maybe it's metadata only.`);
            }
        }
        
        const commitResponse = await octokit.rest.repos.listCommits({
            owner,
            repo,
            path: jsonFile.path,
            per_page: 1,
        });
        const lastCommit = commitResponse.data[0];

        return {
          title: metadata.title || fileDetails.name.replace(/[-_]/g, ' '),
          description: metadata.description || 'No description available.',
          tags: metadata.tags || [input.category],
          subject: metadata.subject,
          semester: metadata.semester,
          year: metadata.year,
          keywords: metadata.keywords || [],
          date: lastCommit ? new Date(lastCommit.commit.author?.date!).toLocaleDateString() : new Date().toLocaleDateString(),
          size: `${(fileDetails.size / 1024 / 1024).toFixed(2)} MB`,
          downloads: 0, // Download count would need a separate tracking mechanism
          downloadUrl: metadata.downloadUrl || fileDetails.download_url,
          fileName: fileDetails.name,
        };
      }));

      // Filter out any null results from skipped resources
      return resources.filter((r): r is ListResourcesOutput[0] => r !== null);

    } catch (error: any) {
       if (error.status === 404) {
        return []; // Directory doesn't exist, return empty array
      }
      console.error('Failed to list resources from GitHub:', error);
      return [];
    }
  }
);
