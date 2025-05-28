import React from 'react'

const ProgressBar = ({
  sections,
  currentSection,
}: {
  sections: any[];
  currentSection: number;
}) => {
  return <div className='absolute top-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-xs pt-4'>Progress Bar</div>;
};

export default ProgressBar