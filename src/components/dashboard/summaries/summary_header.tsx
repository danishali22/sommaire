import React from 'react'

const SummaryHeader = ({title}: {title: string}) => {
  return (
    <h1 className='text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent'>{title}</h1>
  )
}

export default SummaryHeader