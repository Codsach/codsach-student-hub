'use server';
/**
 * @fileOverview A flow for deleting a resource and its metadata from GitHub.
 *
 * - deleteResource - A function that handles deleting a resource from GitHub.
 * - DeleteResourceInput - The input type for the deleteResource function.
 * - DeleteResourceOutput - The return type for the deleteResource function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const DeleteResourceInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  filePath: z.string().describe('The path to the resource file to be deleted.'),
});
export type DeleteResourceInput = z.infer<typeof DeleteResourceInputSchema>;

const DeleteResourceOutputSchema = z.object({
  success: z.boolean().describe('Whether the deletion was successful.'),
  error: z.string().optional().describe('An error message if deletion failed.'),
});
export type DeleteResourceOutput = z.infer<typeof DeleteResourceOutputSchema>;

export async function deleteResource(
  input: DeleteResourceInput
): Promise<DeleteResourceOutput> {
  return deleteResourceFlow(input);
}

const deleteResourceFlow = ai.defineFlow(
  {
    name: 'deleteResourceFlow',
    inputSchema: DeleteResourceInputSchema,
    outputSchema: DeleteResourceOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');
    const metadataPath = input.filePath.replace(/\.[^/.]+$/, "") + '.json';

    try {
       // Get the SHA of the file to be deleted
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: input.filePath,
      });

      if (Array.isArray(fileData)) throw new Error("Path resolved to a directory");

      // Delete the main resource file
      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path: input.filePath,
        message: `feat: Delete resource ${input.filePath}`,
        sha: fileData.sha,
      });

      // Get the SHA of the metadata file to be deleted
      const { data: metadataFileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: metadataPath,
      });

      if (Array.isArray(metadataFileData)) throw new Error("Metadata path resolved to a directory");
      
      // Delete the metadata file
      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        path: metadataPath,
        message: `feat: Delete metadata for ${input.filePath}`,
        sha: metadataFileData.sha,
      });

      return { success: true };
    } catch (error: any) {
      console.error('GitHub Deletion Error:', error);
       // If one of the files is already gone, we can consider it a partial success
      if (error.status === 404) {
          return { success: true, error: "One of the files to delete was not found, but proceeding." };
      }
      return { success: false, error: error.message || 'Failed to delete resource from GitHub.' };
    }
  }
);
