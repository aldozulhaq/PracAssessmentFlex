import React from 'react';
import { WifiIcon, KitchenIcon } from '../Icons';

const AmenityItem = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center p-4 border rounded-lg h-28">
    {icon}
    <span className="mt-2 text-sm text-flex-text-secondary">{label}</span>
  </div>
);

const AmenitiesPreview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-flex-dark-green mb-4">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AmenityItem icon={<WifiIcon />} label="Fast Wifi" />
        <AmenityItem icon={<KitchenIcon />} label="Full Kitchen" />
        {/* Add more placeholder amenities */}
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg h-28 animate-pulse bg-gray-100"></div>
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg h-28 animate-pulse bg-gray-100"></div>
      </div>
    </div>
  );
};

export default AmenitiesPreview;