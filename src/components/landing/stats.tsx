
'use client';
import { useEffect, useState, useRef } from 'react';
import { BookOpen, FileText, HardDrive, GraduationCap, LucideIcon } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(end * progress);
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames]);

  return <span>{count.toLocaleString()}{suffix}+</span>;
};

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  duration?: number;
  icon?: LucideIcon;
}

const StatCard = ({ title, value, unit = '', duration, icon: Icon }: StatCardProps) => {
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

  const formattedSuffix = unit ? (unit.startsWith(' ') ? unit : ` ${unit}`) : '';

  return (
    <div ref={ref} className="text-center group p-4 rounded-xl transition-all duration-300 hover:bg-muted/40">
      {Icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
        {isInView ? <AnimatedCounter end={value} duration={duration} suffix={formattedSuffix} /> : `0${formattedSuffix}+`}
      </div>
      <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">{title}</p>
    </div>
  );
};

export interface StatsProps {
  stats?: {
    totalResources?: number;
    totalFiles?: number;
    storageMB?: number;
    subjectsCount?: number;
  };
}

export function Stats({ stats: liveStats }: StatsProps) {
  const statsList = [
    {
      title: 'Total Resources',
      value: liveStats?.totalResources ?? 27,
      unit: '',
      icon: BookOpen,
    },
    {
      title: 'Study Files',
      value: liveStats?.totalFiles ?? 120,
      unit: '',
      icon: FileText,
    },
    {
      title: 'Storage Used',
      value: liveStats?.storageMB ?? 50,
      unit: 'MB',
      icon: HardDrive,
    },
    {
      title: 'Subjects Covered',
      value: liveStats?.subjectsCount ?? 5,
      unit: '',
      icon: GraduationCap,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {statsList.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
