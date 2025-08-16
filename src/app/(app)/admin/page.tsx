
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Upload, File, X, Info, PlusCircle, ArrowLeft, Search, Eye, Edit, Trash2, LogOut, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Octokit } from 'octokit';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/ai/flows/upload-flow';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { deleteResource } from '@/ai/flows/delete-resource-flow';
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


export default function AdminPage() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [allResources, setAllResources] = useState<ListResourcesOutput>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [resourceToDelete, setResourceToDelete] = useState<ListResourcesOutput[0] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!isConnected) {
        toast({ title: "Error", description: "Please connect to GitHub first.", variant: "destructive" });
        return;
    }
    if (!title || !category || !description || !file) {
        toast({ title: "Error", description: "Please fill all required fields and select a file.", variant: "destructive" });
        return;
    }
    setIsUploading(true);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Content = (reader.result as string).split(',')[1];
            const fileName = file.name.replace(/ /g, '-');
            const filePath = `${category}/${fileName}`;

            const result = await uploadFile({
                githubToken: githubToken,
                repository: 'Codsach/codsach-resources',
                filePath: filePath,
                fileContent: base64Content,
                commitMessage: `feat: Add ${title}`,
                metadata: {
                  title,
                  description,
                  subject,
                  semester,
                  tags: [category, ...tags],
                  keywords: [],
                }
            });

            if (result.success) {
                toast({ title: "Success", description: `File uploaded successfully! URL: ${result.url}` });
                // Reset form
                setTitle('');
                setCategory('');
                setDescription('');
                setSubject('');
                setSemester('');
                setTags([]);
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Refresh resources if on manage tab
                if(activeTab === 'manage') {
                    fetchAllResources();
                }
            } else {
                toast({ title: "Upload Failed", description: result.error, variant: "destructive" });
            }
            setIsUploading(false);
        };
        reader.onerror = (error) => {
             toast({ title: "File Read Error", description: "Could not read the selected file.", variant: "destructive" });
             setIsUploading(false);
        };

    } catch (error: any) {
        toast({ title: "Upload Failed", description: error.message || "An unexpected error occurred.", variant: "destructive" });
        setIsUploading(false);
    }
  };
  
   const handleDeleteResource = async () => {
    if (!resourceToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteResource({
        githubToken,
        repository: 'Codsach/codsach-resources',
        filePath: `${resourceToDelete.tags[0]}/${resourceToDelete.fileName}`,
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: `Successfully deleted "${resourceToDelete.title}".`,
        });
        setAllResources(allResources.filter(r => r.fileName !== resourceToDelete.fileName));
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
    'notes': 'bg-green-100 text-green-800',
    'lab-programs': 'bg-blue-100 text-blue-800',
    'question-papers': 'bg-purple-100 text-purple-800',
    'software-tools': 'bg-orange-100 text-orange-800',
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
                <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-2'>
                    <div className='font-semibold flex items-center gap-2'><Info className='h-4 w-4'/>How to get a GitHub Token:</div>
                    <ol className='list-decimal list-inside space-y-1'>
                        <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                        <li>Click "Generate new token (classic)"</li>
                        <li>Select scopes: <span className='font-mono bg-yellow-100 px-1 rounded'>repo</span> (Full control of private repositories)</li>
                        <li>Copy the generated token and paste it above</li>
                        <li><Link href="https://github.com/settings/tokens/new" target="_blank" className='text-primary hover:underline'>Create Token</Link></li>
                    </ol>
                </div>
                <Button onClick={handleConnectGitHub} disabled={isConnecting || isConnected}>
                    {isConnecting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...</>
                    ) : isConnected ? (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Connected</>
                    ) : (
                        'Connect GitHub'
                    )}
                </Button>
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
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Input id="semester" placeholder="e.g., 1, 2, 3" value={semester} onChange={(e) => setSemester(e.target.value)} />
                  </div>
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
                <div>
                  <Label htmlFor="file-upload">File *</Label>
                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    {file ? (
                        <div className='mt-2 text-sm text-gray-600'>
                            <p>Selected file: {file.name}</p>
                            <Button variant="link" onClick={() => {
                                setFile(null);
                                if(fileInputRef.current) fileInputRef.current.value = '';
                            }}>Remove</Button>
                        </div>
                    ) : (
                        <div className='mt-4'>
                           <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>Choose File</Button>
                           <p className="mt-2 text-sm text-gray-600">or drag and drop</p>
                           <p className="text-xs text-gray-500">PDF, DOC, ZIP, etc. (Max 25MB)</p>
                        </div>
                    )}
                  </div>
                </div>
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
                                <TableHead>Upload Date</TableHead>
                                <TableHead>Size</TableHead>
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
                                        <TableCell>{resource.date}</TableCell>
                                        <TableCell>{resource.size}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={resource.downloadUrl} target="_blank"><Eye className="h-4 w-4" /></Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" disabled>
                                                <Edit className="h-4 w-4" />
                                            </Button>
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
                                                        This action cannot be undone. This will permanently delete the resource
                                                        <span className='font-bold'> {resourceToDelete?.title} </span> 
                                                        and its associated metadata file from your GitHub repository.
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
    </div>
  );
}

    