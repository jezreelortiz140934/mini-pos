import React from 'react';

const Services = ({ onBack }) => {
  const services = [
    {
      id: 1,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Haircut and Styling',
      price: '₱25 000'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Color and Highlights',
      price: '₱25 000'
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Perm and Straightening',
      price: '₱25 000'
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Deep conditioning',
      price: '₱25 000'
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Keratin Treatment',
      price: '₱25 000'
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/300x350',
      title: 'Chic Updo',
      description: 'Hair Spa',
      price: '₱25 000'
    }
  ];

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

      <div className="max-w-6xl mx-auto">
        <h1 className="text-white text-3xl font-bold text-center mb-12">Choose Services</h1>

        {/* Services Grid */}
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* Image */}
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-4 text-center">
                <h3 className="text-pink-400 text-lg font-semibold mb-1">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <p className="text-teal-500 font-bold text-lg">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
