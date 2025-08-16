import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function downloadFile(url: string, filename: string) {
  try {
    // Fetch the file as a blob
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the temporary anchor and revoking the blob URL
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    console.error('There was an error downloading the file:', error);
    // As a fallback, try to open the URL in a new tab
    window.open(url, '_blank');
  }
}
