import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link'
import React from 'react'

const SummaryHeader = ({title}: {title: string}) => {
  return (
    <div className="flex gap-4 mb-4 justify-between">
      <div></div>
      <div>
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <Button
            variant={"link"}
            className="group flex items-center gap-1 sm:gap-2 hover:bg-white/80 backdrop-blur-xs rounded-full transition-all duration-200 shadow-xs hover:shadow-md border border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 transition-transform group-hover:translate-x-0.5" />
            <span className='text-xs sm:text-sm text-muted-foreground font-medium'>
              Back <span className='hidden sm:inline'>To Dashboard</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default SummaryHeader