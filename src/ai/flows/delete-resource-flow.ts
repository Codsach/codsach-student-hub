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
  folderPath: z.string().describe('The path to the resource folder to be deleted.'),
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

    try {
      // Get all files in the directory
      const { data: files } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: input.folderPath,
      });

      if (!Array.isArray(files)) {
        throw new Error("Path is not a directory");
      }

      // Delete each file in the directory
      for (const file of files) {
        await octokit.rest.repos.deleteFile({
          owner,
          repo,
          path: file.path,
          message: `feat: Delete resource file ${file.path}`,
          sha: file.sha,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('GitHub Deletion Error:', error);
      if (error.status === 404) {
          return { success: true, error: "Resource folder not found, assuming already deleted." };
      }
      return { success: false, error: error.message || 'Failed to delete resource folder from GitHub.' };
    }
  }
);
