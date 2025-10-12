
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Upload, File, X, Info, PlusCircle, ArrowLeft, Search, Eye, Edit, Trash2, LogOut, Loader2, CheckCircle, AlertTriangle, LinkIcon, FileText, Unplug } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Octokit } from 'octokit';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/ai/flows/upload-flow';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { deleteResource } from '@/ai/flows/delete-resource-flow';
import { deleteFile } from '@/ai/flows/delete-file-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"


type ResourceFile = ListResourcesOutput[0]['files'][0] & { path: string };

export default function AdminPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  // State for upload form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  // State for resource management
  const [allResources, setAllResources] = useState<ListResourcesOutput>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  
  // State for group deletion
  const [resourceToDelete, setResourceToDelete] = useState<ListResourcesOutput[0] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for single file deletion
  const [fileToDelete, setFileToDelete] = useState<ResourceFile | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);


  // State for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<ListResourcesOutput[0] | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editSemester, setEditSemester] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editDownloadUrl, setEditDownloadUrl] = useState('');
  
  // State for file list view
  const [isViewFilesModalOpen, setIsViewFilesModalOpen] = useState(false);
  const [resourceToViewFiles, setResourceToViewFiles] = useState<ListResourcesOutput[0] | null>(null);


  useEffect(() => {
    setIsClient(true);
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
    const storedToken = localStorage.getItem('githubToken');
    if (storedToken) {
        setGithubToken(storedToken);
        setIsConnected(true);
    }
  }, [router]);
  
  const fetchAllResources = async () => {
    if (!githubToken) return;
    setIsLoadingResources(true);
    try {
        const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
        const resourcePromises = categories.map(category => 
            listResources({
                githubToken,
                repository: 'Codsach/codsach-resources',
                category,
            })
        );
        const results = await Promise.all(resourcePromises);
        const allFetchedResources = results.flat();
        setAllResources(allFetchedResources);
    } catch (error) {
        console.error("Failed to fetch resources:", error);
        toast({
            title: 'Error',
            description: 'Could not fetch resources from GitHub.',
            variant: 'destructive',
        });
    } finally {
        setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    if (isConnected && activeTab === 'manage') {
        fetchAllResources();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, activeTab]);

  const handleConnectGitHub = async () => {
    if (!githubToken) {
        toast({
            title: 'Error',
            description: 'Please enter a GitHub token.',
            variant: 'destructive',
        });
        return;
    }
    setIsConnecting(true);
    try {
        const octokit = new Octokit({ auth: githubToken });
        await octokit.rest.users.getAuthenticated();
        localStorage.setItem('githubToken', githubToken);
        setIsConnected(true);
        toast({
            title: 'Success',
            description: 'Successfully connected to GitHub.',
        });
    } catch (error) {
        toast({
            title: 'Connection Failed',
            description: 'The GitHub token is invalid or does not have the required permissions.',
            variant: 'destructive',
        });
        setIsConnected(false);
        localStorage.removeItem('githubToken');
    } finally {
        setIsConnecting(false);
    }
  };

  const handleDisconnectGitHub = () => {
    localStorage.removeItem('githubToken');
    setGithubToken('');
    setIsConnected(false);
    toast({
        title: 'Disconnected',
        description: 'You have been disconnected from GitHub.',
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
  };
  
  const resetUploadForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setSubject('');
    setSemester('');
    setYear('');
    setTags([]);
    setFiles([]);
    setDownloadUrl('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!isConnected) {
        toast({ title: "Error", description: "Please connect to GitHub first.", variant: "destructive" });
        return;
    }
    if (!title || !category || !description) {
        toast({ title: "Error", description: "Please fill Title, Category, and Description.", variant: "destructive" });
        return;
    }
     if (category === 'software-tools' && !downloadUrl) {
        toast({ title: "Error", description: "Please provide a download link for software tools.", variant: "destructive" });
        return;
    }
    if (category !== 'software-tools' && files.length === 0) {
        toast({ title: "Error", description: "Please select at least one file to upload.", variant: "destructive" });
        return;
    }
    setIsUploading(true);

    const processUpload = async (fileContents: {name: string, content: string}[]) => {

        try {
            const result = await uploadFile({
                githubToken: githubToken,
                repository: 'Codsach/codsach-resources',
                files: fileContents,
                commitMessage: `feat: Add ${title}`,
                metadata: {
                    title,
                    description,
                    subject,
                    semester,
                    year: category === 'question-papers' ? year : undefined,
                    tags: [category, ...tags],
                    keywords: [],
                    downloadUrl: category === 'software-tools' ? downloadUrl : undefined,
                }
            });

            if (result.success) {
                toast({ title: "Success", description: `Resource uploaded successfully!` });
                resetUploadForm();
                if (activeTab === 'manage') {
                    fetchAllResources();
                }
            } else {
                toast({ title: "Upload Failed", description: result.error, variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Upload Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };
    
    if (files.length > 0) {
        const filePromises = files.map(file => {
            return new Promise<{name: string, content: string}>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    const base64Content = (reader.result as string).split(',')[1];
                    resolve({ name: file.name, content: base64Content });
                };
                reader.onerror = (error) => {
                    reject(error);
                };
            });
        });

        try {
            const fileContents = await Promise.all(filePromises);
            processUpload(fileContents);
        } catch (error) {
            toast({ title: "File Read Error", description: "Could not read the selected files.", variant: "destructive" });
            setIsUploading(false);
        }
    } else {
        // Handle metadata-only upload (for software tools)
        processUpload([]);
    }
  };
  
   const handleDeleteResource = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);

    try {
      const category = resourceToDelete.tags.find(t => ['notes', 'lab-programs', 'question-papers', 'software-tools'].includes(t));
      if (!category) {
        throw new Error("Could not determine resource category.");
      }
      
      const folderPath = `${category}/${resourceToDelete.folderName}`;

      const result = await deleteResource({
        githubToken,
        repository: 'Codsach/codsach-resources',
        folderPath: folderPath,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully deleted "${resourceToDelete.title}".`,
        });
        setAllResources(allResources.filter(r => r.folderName !== resourceToDelete.folderName));
      } else {
        toast({
          title: 'Deletion Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Deletion Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  const handleDeleteFile = async () => {
      if (!fileToDelete || !resourceToViewFiles) return;
      setIsDeletingFile(true);
      
      const category = resourceToViewFiles.tags.find(t => ['notes', 'lab-programs', 'question-papers', 'software-tools'].includes(t));
      if (!category) {
        toast({ title: 'Error', description: 'Could not determine resource category.', variant: 'destructive' });
        setIsDeletingFile(false);
        return;
      }
      
      const filePath = `${category}/${resourceToViewFiles.folderName}/${fileToDelete.name}`;

      try {
        const result = await deleteFile({
            githubToken,
            repository: 'Codsach/codsach-resources',
            filePath: filePath,
        });

        if (result.success) {
            toast({ title: 'Success', description: `File "${fileToDelete.name}" deleted.` });
            
            // Update local state
            setAllResources(prevResources => prevResources.map(res => {
                if (res.folderName === resourceToViewFiles.folderName) {
                    return {
                        ...res,
                        files: res.files.filter(f => f.name !== fileToDelete.name)
                    };
                }
                return res;
            }));
            
            setResourceToViewFiles(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    files: prev.files.filter(f => f.name !== fileToDelete.name)
                };
            });

        } else {
            toast({ title: 'Deletion Failed', description: result.error, variant: 'destructive' });
        }
      } catch (error: any) {
          toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
      } finally {
          setIsDeletingFile(false);
          setFileToDelete(null);
      }
  }
  
   const handleOpenEditModal = (resource: ListResourcesOutput[0]) => {
    setResourceToEdit(resource);
    setEditTitle(resource.title);
    setEditDescription(resource.description);
    setEditSubject(resource.subject || '');
    setEditSemester(resource.semester || '');
    setEditYear(resource.year || '');
    setEditDownloadUrl(resource.downloadUrl || '');
    setIsEditModalOpen(true);
  };

  const handleOpenViewFilesModal = (resource: ListResourcesOutput[0]) => {
    setResourceToViewFiles(resource);
    setIsViewFilesModalOpen(true);
  };
  
  const handleUpdateResource = async () => {
    if (!resourceToEdit) return;
    setIsUpdating(true);

    try {
        const category = resourceToEdit.tags.find(t => ['notes', 'lab-programs', 'question-papers', 'software-tools'].includes(t));
        if (!category) {
            throw new Error("Could not determine resource category.");
        }
        
        const result = await uploadFile({
            githubToken: githubToken,
            repository: 'Codsach/codsach-resources',
            commitMessage: `feat: Update metadata for ${editTitle}`,
            // No files are passed, only updating metadata
            files: [],
            metadata: {
              title: editTitle,
              description: editDescription,
              subject: editSubject,
              semester: editSemester,
              year: category === 'question-papers' ? editYear : undefined,
              tags: resourceToEdit.tags,
              keywords: resourceToEdit.keywords,
              downloadUrl: category === 'software-tools' ? editDownloadUrl : undefined,
            }
        });

        if (result.success) {
            toast({ title: "Success", description: "Resource updated successfully!" });
            setIsEditModalOpen(false);
            setResourceToEdit(null);
            await fetchAllResources();
        } else {
            toast({ title: "Update Failed", description: result.error, variant: "destructive" });
        }
    } catch (error: any) {
        toast({ title: "Update Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
        setIsUpdating(false);
    }
  };


  if (!isClient) {
    return null; // Or a loading spinner
  }

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const categoryColors: { [key: string]: string } = {
    'notes': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'lab-programs': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'question-papers': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'software-tools': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  };
  
  const getCategoryName = (tag: string) => {
    switch (tag) {
        case 'notes': return 'Notes';
        case 'lab-programs': return 'Lab Programs';
        case 'question-papers': return 'Question Papers';
        case 'software-tools': return 'Software Tools';
        default: return 'General';
    }
  }

  const totalDownloads = allResources.reduce((sum, resource) => sum + resource.downloads, 0);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage and upload resources for Codsach</p>
        </div>
      </div>
      
      <Tabs defaultValue="upload" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
          <TabsTrigger value="manage">Manage Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Card className='mb-6'>
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <Github className='h-8 w-8 text-primary' />
                    <div>
                        <CardTitle>GitHub Storage Setup</CardTitle>
                        <CardDescription>Connect your GitHub repository to enable file uploads and storage.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div>
                    <Label>Repository: <Link href="https://github.com/Codsach/codsach-resources" className='text-primary hover:underline'>https://github.com/Codsach/codsach-resources</Link></Label>
                </div>
                <div>
                    <Label htmlFor="gh-token">GitHub Personal Access Token</Label>
                    <Input 
                        id="gh-token" 
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                        type="password"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        disabled={isConnecting || isConnected}
                    />
                </div>
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-300 space-y-2'>
                    <div className='font-semibold flex items-center gap-2'><Info className='h-4 w-4'/>How to get a GitHub Token:</div>
                    <ol className='list-decimal list-inside space-y-1'>
                        <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                        <li>Click "Generate new token (classic)"</li>
                        <li>Select scopes: <span className='font-mono bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded'>repo</span> (Full control of private repositories)</li>
                        <li>Copy the generated token and paste it above</li>
                        <li><Link href="https://github.com/settings/tokens/new" target="_blank" className='text-primary hover:underline'>Create Token</Link></li>
                    </ol>
                </div>
                <div className="flex gap-4">
                    <Button onClick={handleConnectGitHub} disabled={isConnecting || isConnected}>
                        {isConnecting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
                        ) : isConnected ? (
                            <><CheckCircle className="mr-2 h-4 w-4" /> Connected</>
                        ) : (
                            'Connect GitHub'
                        )}
                    </Button>
                    {isConnected && (
                        <Button variant="destructive" onClick={handleDisconnectGitHub}>
                            <Unplug className="mr-2 h-4 w-4" />
                            Disconnect
                        </Button>
                    )}
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="Enter resource title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="lab-programs">Lab Programs</SelectItem>
                        <SelectItem value="question-papers">Question Papers</SelectItem>
                        <SelectItem value="software-tools">Software Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Enter resource description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g., Data Structures" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  </div>
                  {category === 'question-papers' ? (
                     <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" placeholder="e.g., 2023" value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                  ) : (
                    <div>
                        <Label htmlFor="semester">Semester</Label>
                        <Input id="semester" placeholder="e.g., 1, 2, 3" value={semester} onChange={(e) => setSemester(e.target.value)} />
                    </div>
                  )}
                </div>
                 <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                        <Input id="tags" placeholder="Enter tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} />
                        <Button type="button" variant="outline" onClick={handleAddTag}><PlusCircle className='h-4 w-4 mr-2' />Add Tag</Button>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                </div>

                {category === 'software-tools' ? (
                    <div>
                        <Label htmlFor="download-url">Download Link *</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="download-url" placeholder="https://..." className="pl-10" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Label htmlFor="file-upload">Files *</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            />
                            {files.length > 0 ? (
                                <div className='mt-4 space-y-2'>
                                    {files.map(file => (
                                        <div key={file.name} className='flex items-center justify-between bg-muted p-2 rounded-md'>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <FileText className='h-4 w-4 text-muted-foreground' />
                                                <span className='font-medium'>{file.name}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className='h-6 w-6' onClick={() => handleRemoveFile(file.name)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button variant="link" onClick={() => document.getElementById('file-upload')?.click()}>Add more files</Button>
                                </div>
                            ) : (
                                <div className='mt-4'>
                                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>Choose Files</Button>
                                <p className="mt-2 text-sm text-muted-foreground">or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOC, ZIP, etc. (Max 25MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={isUploading || !isConnected}>
                        {isUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                            <><Upload className="mr-2 h-4 w-4" /> Upload to GitHub</>
                        )}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Resources</CardTitle>
              <CardDescription>View, edit, and delete uploaded resources.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search resources..." className="pl-10" />
                    </div>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="lab-programs">Lab Programs</SelectItem>
                            <SelectItem value="notes">Notes</SelectItem>
                            <SelectItem value="question-papers">Question Papers</SelectItem>
                            <SelectItem value="software-tools">Software Tools</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Resource</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Files</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingResources ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : allResources.length > 0 ? (
                                allResources.map((resource, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="font-medium">{resource.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-2">{resource.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${categoryColors[resource.tags[0]] || ''} border-none`}>{getCategoryName(resource.tags[0])}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleOpenViewFilesModal(resource)}>
                                                {resource.files?.length || (resource.downloadUrl ? 1 : 0)}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{new Date(resource.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Dialog open={isEditModalOpen && resourceToEdit?.folderName === resource.folderName} onOpenChange={(open) => { if(!open) { setIsEditModalOpen(false); setResourceToEdit(null); } }}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(resource)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                      <DialogTitle>Edit Resource: {resourceToEdit?.title}</DialogTitle>
                                                      <DialogDescription>
                                                        Make changes to the resource metadata. File content cannot be changed.
                                                      </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div>
                                                            <Label htmlFor="edit-title">Title</Label>
                                                            <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="edit-description">Description</Label>
                                                            <Textarea id="edit-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                                        </div>
                                                        {resourceToEdit?.tags.includes('software-tools') ? (
                                                          <div>
                                                              <Label htmlFor="edit-download-url">Download Link</Label>
                                                              <Input id="edit-download-url" value={editDownloadUrl} onChange={(e) => setEditDownloadUrl(e.target.value)} />
                                                          </div>
                                                        ) : (
                                                          <>
                                                            <div>
                                                                <Label htmlFor="edit-subject">Subject</Label>
                                                                <Input id="edit-subject" value={editSubject} onChange={(e) => setEditSubject(e.target.value)} />
                                                            </div>
                                                            {resourceToEdit?.tags.includes('question-papers') ? (
                                                                <div>
                                                                    <Label htmlFor="edit-year">Year</Label>
                                                                    <Input id="edit-year" value={editYear} onChange={(e) => setEditYear(e.target.value)} />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <Label htmlFor="edit-semester">Semester</Label>
                                                                    <Input id="edit-semester" value={editSemester} onChange={(e) => setEditSemester(e.target.value)} />
                                                                </div>
                                                            )}
                                                          </>
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                          <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button onClick={handleUpdateResource} disabled={isUpdating}>
                                                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                            Save Changes
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <AlertDialog onOpenChange={(open) => !open && setResourceToDelete(null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setResourceToDelete(resource)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the entire resource
                                                        <span className='font-bold'> &quot;{resourceToDelete?.title}&quot; </span> 
                                                        and all its associated files from your GitHub repository.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel onClick={() => setResourceToDelete(null)}>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction onClick={handleDeleteResource} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className='h-4 w-4 mr-2'/>}
                                                        Yes, delete it
                                                      </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                     <TableCell colSpan={5} className="text-center py-12">
                                        <p className="font-semibold">No resources found.</p>
                                        <p className="text-muted-foreground">Upload a resource to see it here.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                    <div>
                        Total Resources: {allResources.length} <br />
                        Showing {allResources.length} resources
                    </div>
                    <div>Total Downloads: {totalDownloads.toLocaleString()}</div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isViewFilesModalOpen} onOpenChange={(open) => { if(!open) { setIsViewFilesModalOpen(false); setResourceToViewFiles(null); }}}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Files for: {resourceToViewFiles?.title}</DialogTitle>
                <DialogDescription>
                    Manage individual files for this resource. Deleting a file is permanent.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                {resourceToViewFiles?.files.map((file) => (
                    <div key={file.name} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-3 min-w-0">
                             <FileText className='h-5 w-5 text-primary flex-shrink-0' />
                             <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">{file.size}</span>
                             </div>
                        </div>
                         <AlertDialog onOpenChange={(open) => !open && setFileToDelete(null)}>
                            <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="icon" onClick={() => setFileToDelete(file as ResourceFile)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this file?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will permanently delete the file <span className="font-bold">&quot;{fileToDelete?.name}&quot;</span>. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteFile} disabled={isDeletingFile} className="bg-destructive hover:bg-destructive/90">
                                        {isDeletingFile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Yes, delete file
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
                {resourceToViewFiles?.files.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No files in this resource.</p>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    

    