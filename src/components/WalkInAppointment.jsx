import React from 'react';

const WalkInAppointment = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-white hover:text-pink-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl font-bold text-center mb-8">Walk In Appointment</h1>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden shadow-xl">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-300">
                <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Name</th>
                <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Contact</th>
                <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Service</th>
                <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Stylist</th>
                <th className="py-4 px-6 text-white font-bold text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample Row */}
              <tr className="bg-pink-200 border-b-2 border-white">
                <td className="py-4 px-6 border-r-2 border-white">Jerilyn Mae</td>
                <td className="py-4 px-6 border-r-2 border-white">09123456789</td>
                <td className="py-4 px-6 border-r-2 border-white">Act of Service</td>
                <td className="py-4 px-6 border-r-2 border-white">Cha</td>
                <td className="py-4 px-6">10:51 PM</td>
              </tr>
              {/* Empty Rows */}
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="bg-pink-200 border-b-2 border-white">
                  <td className="py-4 px-6 border-r-2 border-white">&nbsp;</td>
                  <td className="py-4 px-6 border-r-2 border-white">&nbsp;</td>
                  <td className="py-4 px-6 border-r-2 border-white">&nbsp;</td>
                  <td className="py-4 px-6 border-r-2 border-white">&nbsp;</td>
                  <td className="py-4 px-6">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalkInAppointment;
