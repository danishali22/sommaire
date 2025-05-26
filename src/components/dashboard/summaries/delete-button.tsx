import React from 'react'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

const DeleteButton = () => {
  return (
    <Button variant={"ghost"} size={"icon"} className='text-gray-400 bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-50'>
      <Trash className='w-4 h-4' /> 
    </Button>
  )
}

export default DeleteButton