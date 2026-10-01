
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, BookOpen, FileText, Settings, ArrowRight } from 'lucide-react';
import type { CategoryStat } from '@/lib/resources';

interface ResourcesProps {
  categoryStats?: CategoryStat[];
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; href: string }> = {
  'lab-programs': {
    icon: <Code2 className="h-8 w-8 text-white" />,
    color: 'bg-blue-500 group-hover:bg-blue-600',
    href: '/lab-programs',
  },
  'notes': {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    color: 'bg-green-500 group-hover:bg-green-600',
    href: '/notes',
  },
  'question-papers': {
    icon: <FileText className="h-8 w-8 text-white" />,
    color: 'bg-purple-500 group-hover:bg-purple-600',
    href: '/question-papers',
  },
  'software-tools': {
    icon: <Settings className="h-8 w-8 text-white" />,
    color: 'bg-orange-500 group-hover:bg-orange-600',
    href: '/software-tools',
  },
};

const DEFAULT_CATEGORIES: CategoryStat[] = [
  {
    key: 'lab-programs',
    title: 'Lab Programs',
    description: 'Complete lab programs with source code and explanations',
    count: 0,
    countLabel: 'Lab Programs',
    href: '/lab-programs',
  },
  {
    key: 'notes',
    title: 'Study Notes',
    description: 'Comprehensive notes for all MCA subjects',
    count: 0,
    countLabel: 'Study Notes',
    href: '/notes',
  },
  {
    key: 'question-papers',
    title: 'Question Papers',
    description: 'Previous year question papers and solutions',
    count: 0,
    countLabel: 'Question Papers',
    href: '/question-papers',
  },
  {
    key: 'software-tools',
    title: 'Software Tools',
    description: 'Essential software and development tools',
    count: 0,
    countLabel: 'Software Tools',
    href: '/software-tools',
  },
];

export function Resources({ categoryStats }: ResourcesProps) {
  const categoriesToRender = categoryStats && categoryStats.length > 0
    ? categoryStats
    : DEFAULT_CATEGORIES;

  return (
    <section id="resources" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Our Resources
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need for your MCA journey, organized and easily accessible
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesToRender.map((cat) => {
            const meta = CATEGORY_META[cat.key] || {
              icon: <BookOpen className="h-8 w-8 text-white" />,
              color: 'bg-primary',
              href: cat.href || '#',
            };

            return (
              <Link key={cat.key || cat.title} href={meta.href} className="group block focus:outline-none">
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border rounded-xl bg-card cursor-pointer group-hover:border-primary/50 relative overflow-hidden">
                  <CardHeader className="flex-col items-start gap-4 space-y-0 pb-2">
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-3 rounded-xl transition-colors ${meta.color}`}>
                        {meta.icon}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className="font-semibold group-hover:text-primary transition-colors">
                      {cat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                    <div className="pt-2">
                      <Badge variant="secondary" className="font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {cat.countLabel}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

