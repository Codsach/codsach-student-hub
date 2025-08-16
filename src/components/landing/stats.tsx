'use client';
import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Download, Users } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = (frame / totalFrames) ** 2; // easeOutQuad
      const currentCount = Math.round(end * progress);
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  return <span>{count.toLocaleString()}+</span>;
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: number }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <Card ref={ref} className="text-center">
      <CardHeader className="flex flex-col items-center gap-2">
        {icon}
        <CardTitle className="text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-4xl font-bold text-primary">
        {isInView ? <AnimatedCounter end={value} /> : '0+'}
      </CardContent>
    </Card>
  );
};

export function Stats() {
  const stats = [
    {
      icon: <Book className="h-8 w-8 text-accent" />,
      title: 'Resources',
      value: 500,
    },
    {
      icon: <Download className="h-8 w-8 text-accent" />,
      title: 'Downloads',
      value: 10000,
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: 'Happy Users',
      value: 5000,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-muted/50">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
