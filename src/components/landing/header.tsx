'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Menu, 
  LogOut, 
  Bell, 
  Code, 
  FileText, 
  Wrench, 
  CheckCheck, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '../theme-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type ListResourcesOutput } from '@/ai/flows/list-resources-flow';
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

function getCategoryInfo(tags: string[] = []) {
  const lowerTags = tags.map(t => t.toLowerCase());
  if (lowerTags.includes('lab-programs')) {
    return {
      category: 'lab-programs',
      label: 'Lab Program',
      icon: Code,
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
  }
  if (lowerTags.includes('question-papers')) {
    return {
      category: 'question-papers',
      label: 'Question Paper',
      icon: FileText,
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    };
  }
  if (lowerTags.includes('software-tools')) {
    return {
      category: 'software-tools',
      label: 'Software Tool',
      icon: Wrench,
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    };
  }
  return {
    category: 'notes',
    label: 'Notes',
    icon: BookOpen,
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };
}

function getResourceLink(resource: ListResourcesOutput[0]) {
  const info = getCategoryInfo(resource.tags);
  return `/${info.category}?q=${encodeURIComponent(resource.title)}`;
}

interface NotificationBellProps {
  recentResources: ListResourcesOutput;
  align?: 'start' | 'center' | 'end';
}

function NotificationBell({ recentResources, align = 'end' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastViewedTime, setLastViewedTime] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  const syncLastViewed = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lastViewedNotifications');
      if (stored) {
        setLastViewedTime(parseInt(stored, 10));
      } else {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        setLastViewedTime(sevenDaysAgo);
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    syncLastViewed();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'lastViewedNotifications') {
        syncLastViewed();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [syncLastViewed]);

  const isResourceUnread = (resource: ListResourcesOutput[0]) => {
    if (!mounted) return false;
    const createdAtTime = new Date(resource.createdAt).getTime();
    return createdAtTime > lastViewedTime;
  };

  const unreadCount = mounted
    ? recentResources.filter(r => isResourceUnread(r)).length
    : 0;

  const handleMarkAllAsRead = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    localStorage.setItem('lastViewedNotifications', now.toString());
    setLastViewedTime(now);
  };

  const handleItemClick = () => {
    setIsOpen(false);
    handleMarkAllAsRead();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground hover:text-primary transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5 pointer-events-none" />
          {unreadCount > 0 && (
            <span className="pointer-events-none absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 shadow-xl border-border/60 z-50" align={align}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/40">
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              Recent Uploads
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {unreadCount} new
                </span>
              )}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest study materials added to the hub
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-7 text-xs px-2 text-muted-foreground hover:text-primary"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Mark read
            </Button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/30 p-1">
          {recentResources.length > 0 ? (
            recentResources.map((resource) => {
              const info = getCategoryInfo(resource.tags);
              const Icon = info.icon;
              const isUnread = isResourceUnread(resource);

              return (
                <Link
                  key={resource.folderName || resource.title}
                  href={getResourceLink(resource)}
                  onClick={handleItemClick}
                  className={`group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/70 ${
                    isUnread ? 'bg-primary/[0.04]' : ''
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${info.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {resource.title}
                      </p>
                      {isUnread && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${info.badgeClass}`}>
                        {info.label}
                      </span>
                      <span>•</span>
                      <span>
                        {mounted
                          ? formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })
                          : 'recently'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground px-4">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="font-medium text-foreground">No recent uploads</p>
              <p className="text-xs mt-1">Check back later for newly added resources.</p>
            </div>
          )}
        </div>

        {recentResources.length > 0 && (
          <div className="p-2 border-t border-border/40 bg-muted/20 text-center">
            <Link
              href="/search"
              onClick={() => setIsOpen(false)}
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Browse all resources <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function Header({ recentResources = [] }: { recentResources: ListResourcesOutput }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminLoggedIn(!!sessionStorage.getItem('isAdminLoggedIn'));
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
  };

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

        {/* Desktop actions */}
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

          <NotificationBell recentResources={recentResources} align="end" />

          <ThemeToggle />

          {isAdminLoggedIn ? (
            <>
              <Button asChild className="rounded-full" variant="outline">
                <Link href="/admin">Admin Panel</Link>
              </Button>
              <Button onClick={handleLogout} className="rounded-full">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button asChild className="rounded-full">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:hidden">
          <NotificationBell recentResources={recentResources} align="end" />
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
                    <div className="flex flex-col gap-2">
                      <Button asChild className="w-full" variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/admin">Admin Panel</Link>
                      </Button>
                      <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
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
