'use server';
/**
 * @fileOverview A flow for uploading files to a GitHub repository.
 *
 * - uploadFile - A function that handles the file upload process to GitHub.
 * - UploadFileInput - The input type for the uploadFile function.
 * - UploadFileOutput - The return type for the uploadFile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Octokit } from 'octokit';

const UploadFileInputSchema = z.object({
  githubToken: z.string().describe('The GitHub personal access token.'),
  repository: z
    .string()
    .describe('The GitHub repository in the format "owner/repo".'),
  filePath: z
    .string()
    .describe('The path where the file will be stored in the repository.'),
  fileContent: z
    .string()
    .describe('The content of the file, base64 encoded.'),
  commitMessage: z.string().describe('The commit message for the file upload.'),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

const UploadFileOutputSchema = z.object({
  success: z.boolean().describe('Whether the file upload was successful.'),
  url: z.string().optional().describe('The URL of the uploaded file.'),
  error: z.string().optional().describe('An error message if the upload failed.'),
});
export type UploadFileOutput = z.infer<typeof UploadFileOutputSchema>;


export async function uploadFile(
  input: UploadFileInput
): Promise<UploadFileOutput> {
  return uploadFileFlow(input);
}


const uploadFileFlow = ai.defineFlow(
  {
    name: 'uploadFileFlow',
    inputSchema: UploadFileInputSchema,
    outputSchema: UploadFileOutputSchema,
  },
  async (input) => {
    const octokit = new Octokit({ auth: input.githubToken });
    const [owner, repo] = input.repository.split('/');

    try {
      const response = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: input.filePath,
        message: input.commitMessage,
        content: input.fileContent,
      });

      return {
        success: true,
        url: response.data.content?.html_url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upload file to GitHub.',
      };
    }
  }
);
