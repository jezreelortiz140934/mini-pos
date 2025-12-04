import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonCard from './loading/SkeletonCard';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const Services = ({ onAddToOrder }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
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

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchProducts();
  }, [fetchServices, fetchProducts]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setSelectedProducts([]);
    setShowProductModal(true);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirmService = () => {
    if (onAddToOrder && selectedService) {
      // Get selected product details
      const productsUsed = products.filter(p => selectedProducts.includes(p.id));
      
      // Add service with products information
      const serviceWithProducts = {
        ...selectedService,
        productsUsed: productsUsed
      };
      
      onAddToOrder(serviceWithProducts, 'service', navigate);
      showToast(`Added ${selectedService.title} to order!`, 'success');
      setShowProductModal(false);
      setSelectedService(null);
      setSelectedProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 p-8">
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
                {service.image_url && (
                  <div className="h-64 bg-gray-200 overflow-hidden">
                    <img 
                      src={service.image_url} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
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

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      {/* Product Selection Modal */}
      {showProductModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedService.title}
              </h3>
              <p className="text-gray-600 mb-6">
                Select products used for this service (optional)
              </p>

              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products available</p>
              ) : (
                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{product.name}</div>
                        <div className="text-sm text-gray-600">₱{product.price.toFixed(2)}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSelectedService(null);
                    setSelectedProducts([]);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmService}
                  className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Add to Order
                  {selectedProducts.length > 0 && (
                    <span className="ml-2">({selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''})</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
