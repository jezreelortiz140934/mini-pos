import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonCard from './loading/SkeletonCard';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Services = ({ onAddToOrder }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      showToast('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleServiceClick = (service) => {
    if (onAddToOrder) {
      onAddToOrder(service, 'service', navigate);
      showToast(`Added ${service.title} to order!`, 'success');
    }
  };

  const getServiceImage = (title) => {
    const serviceName = title.toLowerCase();
    
    // Haircut
    if (serviceName.includes('haircut') || serviceName.includes('hair cut')) {
      return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop';
    }
    
    // Color/Coloring
    if (serviceName.includes('color')) {
      return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop';
    }
    
    // Perm/Perming
    if (serviceName.includes('perm')) {
      return 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop';
    }
    
    // Conditioning/Treatment
    if (serviceName.includes('condition') || serviceName.includes('treatment')) {
      return 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop';
    }
    
    // Keratin
    if (serviceName.includes('keratin')) {
      return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop';
    }
    
    // Hair Spa
    if (serviceName.includes('spa')) {
      return 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop';
    }
    
    // Body Massage
    if (serviceName.includes('massage')) {
      return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop';
    }
    
    // Default image - salon/beauty
    return 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-white hover:text-pink-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-white text-3xl font-bold">Services</h1>
          <p className="text-teal-100 mt-2">Select a service to add to your order</p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-xl">
            <p className="text-gray-500 text-xl">No services available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={getServiceImage(service.title)} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-teal-600 text-xl font-bold mb-2">{service.title}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  )}
                  <p className="text-pink-500 font-bold text-2xl">₱{service.price.toLocaleString()}</p>
                  <button 
                    onClick={() => handleServiceClick(service)}
                    className="mt-4 w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Services;
