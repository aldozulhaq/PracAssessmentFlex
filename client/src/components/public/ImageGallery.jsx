import React from 'react';

const ImageGallery = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[450px]">
      <div className="col-span-1 row-span-2 bg-gray-200 rounded-l-lg animate-pulse"></div>
      <div className="col-span-1 row-span-1 bg-gray-300 rounded-tr-lg animate-pulse"></div>
      <div className="col-span-1 row-span-1 bg-gray-400 rounded-br-lg animate-pulse"></div>
    </div>
  );
};

export default ImageGallery;