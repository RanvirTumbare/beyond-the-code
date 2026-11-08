import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/layout/PageTransition';

export const NotFound: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-14 h-14 rounded-full bg-[#EBF3EF] text-[#43866A] flex items-center justify-center mb-6">
          <Compass className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold tracking-wider text-[#43866A] uppercase mb-2">
          404 — Page Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#202520] mb-4">
          Beyond the Path.
        </h1>
        <p className="text-sm sm:text-base text-[#777F79] max-w-md mb-8 leading-relaxed">
          The page or article you are searching for does not exist, has been relocated, or is still being drafted in the diary.
        </p>
        <Link to="/">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </PageTransition>
  );
};
