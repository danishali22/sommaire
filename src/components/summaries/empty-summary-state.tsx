import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const EmptySummaryState = () => {
  return (
    <div className="text-center py-12">
      <div className='flex flex-col items-center gap-4'>
        <FileText className="w-16 h-16 mx-auto text-gray-400" />
        <div className="flex flex-col items-center gap-4" />
        <h3 className='text-xl font-semibold text-gray-600'>No summaries yet</h3>
        <p className='text-gray-500 max-w-lg'>Upload your first PDF to get started with AI-powered summaries.</p>
        <Link href="/upload">
          <Button
            variant={"link"}
            className="mt-4 text-white bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 hover:scale-105 transition-all duration-300 group hover:no-underline"
          >
            Create your first summary
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default EmptySummaryState