import React from 'react';

const SkeletonTable = ({ columns = 5, rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="py-4 px-6">
                <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded shimmer"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="py-4 px-6">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shimmer"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
