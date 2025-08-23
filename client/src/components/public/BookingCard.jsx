import React from 'react';

const BookingCard = () => {
  return (
    <div className="sticky top-24 border border-gray-200 rounded-lg p-6 shadow-lg bg-white">
      <p className="text-2xl font-bold mb-4">
        Request to book
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 border rounded-lg p-2">
            <input type="text" placeholder="Check-in" className="border-none focus:ring-0"/>
            <input type="text" placeholder="Check-out" className="border-none focus:ring-0"/>
        </div>
        <input type="text" placeholder="Guests" className="w-full border rounded-lg p-2"/>
        <button className="w-full bg-flex-dark-green text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
          Submit
        </button>
      </div>
      <p className="text-center text-sm text-flex-text-secondary mt-4">You won't be charged yet</p>
    </div>
  );
};

export default BookingCard;