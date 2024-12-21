import React from 'react';

type IndexProps = {
  event: {
    onMouseUp: () => void
  },
  children: React.ReactNode
};

const Index: React.FC<IndexProps> = ({ children, event }) => {
  return (
    <div 
      className="mx-auto p-6 w-[1080px] h-[650px] rounded border border-gray-300 shadow-md select-none" 
      {...event}
    >
      <div className="text-lg flex items-center">
        <div className="mr-2 text-xl" />
        Image Crop Tool
      </div>
      <div className="mt-6 flex justify-center">
        {children}
      </div>
    </div>
  )
};

export default Index;