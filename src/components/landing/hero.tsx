import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="container mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Welcome to <span className="text-primary">Codsach</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          Your one-stop destination for coding resources. Access lab programs, study notes, question papers, and more to ace your exams and projects.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#resources">Explore Resources</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
