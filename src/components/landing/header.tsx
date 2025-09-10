
'use client';

import Link from 'next/link';
import { BookOpen, Search, Menu, User, LogOut, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { listResources, ListResourcesOutput } from '@/ai/flows/list-resources-flow';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';


const Logo = () => (
    <div className="relative w-8 h-8 group-hover:scale-110 transition-transform">
        <svg className="absolute w-full h-full animate-[spin_5s_linear_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="12" stroke="url(#paint0_linear_logo_header)" strokeWidth="10"/>
            <defs>
                <linearGradient id="paint0_linear_logo_header" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(var(--primary))"/>
                    <stop offset="1" stopColor="#50B4F2"/>
                </linearGradient>
            </defs>
        </svg>
        <svg className="absolute w-full h-full animate-[spin_4s_linear_infinite_reverse]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="35" width="30" height="30" rx="6" stroke="hsl(var(--primary))" strokeWidth="8"/>
        </svg>
    </div>
);


export function Header() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const [recentResources, setRecentResources] = useState<ListResourcesOutput>([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminLoggedIn(!!sessionStorage.getItem('isAdminLoggedIn'));
      
      const fetchResources = async () => {
        try {
            const categories = ['notes', 'lab-programs', 'question-papers', 'software-tools'];
            // This is a dummy token. In a real app, you'd want to handle this securely.
            // For a read-only public repo, we can sometimes get away without a token,
            // but it's better to use one to avoid rate limits.
            const dummyToken = 'any_string_will_do_for_public_repo';
            const resourcePromises = categories.map(category => 
                listResources({
                    githubToken: dummyToken,
                    repository: 'Codsach/codsach-resources',
                    category,
                })
            );
            const results = await Promise.all(resourcePromises);
            const allFetchedResources = results.flat();
            
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recent = allFetchedResources
                .filter(r => new Date(r.date) > sevenDaysAgo)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            setRecentResources(recent);
            
            const lastViewedTimestamp = localStorage.getItem('lastViewedNotifications');
            if (recent.length > 0) {
                const latestResourceTimestamp = new Date(recent[0].date).getTime();
                if (!lastViewedTimestamp || latestResourceTimestamp > parseInt(lastViewedTimestamp, 10)) {
                    setHasUnread(true);
                }
            }

        } catch (error) {
            console.error("Could not fetch recent resources in header:", error);
            // Don't show a toast here to avoid bothering users on every page load
        }
      };
      
      fetchResources();
    }
  }, []);
  
    useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [pathname, searchParams]);


  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
    router.push('/login');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const query = e.currentTarget.search.value;
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      } else {
        router.push('/search');
      }
      setIsMobileMenuOpen(false);
  }
  
  const handleNotificationOpen = () => {
      setHasUnread(false);
      localStorage.setItem('lastViewedNotifications', Date.now().toString());
  }

  const getResourcePageLink = (resource: ListResourcesOutput[0]) => {
      if (resource.tags.includes('notes')) return '/notes';
      if (resource.tags.includes('lab-programs')) return '/lab-programs';
      if (resource.tags.includes('question-papers')) return '/question-papers';
      if (resource.tags.includes('software-tools')) return '/software-tools';
      return '/';
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/lab-programs', label: 'Lab Programs' },
    { href: '/notes', label: 'Notes' },
    { href: '/question-papers', label: 'Question Papers' },
    { href: '/software-tools', label: 'Software Tools' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
              <Logo />
               <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient">
                Codsach
              </h1>
            </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 md:flex">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  name="search"
                  placeholder="Search resources..." 
                  className="pl-10 w-48 bg-muted border-none rounded-full"
                  defaultValue={searchQuery}
              />
            </div>
          </form>
            <Popover onOpenChange={(open) => { if(open) handleNotificationOpen(); }}>
                <PopoverTrigger asChild>
                     <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5"/>
                        {hasUnread && <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />}
                        <span className="sr-only">Notifications</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Recent Uploads</h4>
                            <p className="text-sm text-muted-foreground">
                                New resources added in the last 7 days.
                            </p>
                        </div>
                        <div className="grid gap-2">
                           {recentResources.length > 0 ? (
                                recentResources.map(resource => (
                                    <Link key={resource.folderName} href={getResourcePageLink(resource)} className="group grid grid-cols-[25px_1fr] items-start gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">{resource.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(resource.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                           ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No new uploads recently.</p>
                           )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
          <ThemeToggle />
          {isAdminLoggedIn ? (
            <>
              <Button asChild className='rounded-full' variant="outline">
                <Link href="/admin">Admin Panel</Link>
              </Button>
              <Button onClick={handleLogout} className='rounded-full'>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button asChild className='rounded-full'>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-0 flex flex-col"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader className="p-4 border-b">
                 <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl group" onClick={() => setIsMobileMenuOpen(false)}>
                     <Logo />
                     <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient">
                      Codsach
                    </h1>
                   </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-grow flex flex-col justify-between">
                <nav className="flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-4 border-t flex flex-col gap-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                          name="search"
                          placeholder="Search resources..." 
                          className="pl-10 w-full" 
                          defaultValue={searchQuery}
                          autoFocus={false}
                      />
                    </div>
                  </form>
                   {isAdminLoggedIn ? (
                      <div className='flex flex-col gap-2'>
                        <Button asChild className='w-full' variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/admin">Admin Panel</Link>
                        </Button>
                        <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className='w-full'>
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className='w-full' onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
