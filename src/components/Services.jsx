import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SkeletonCard from './loading/SkeletonCard';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../hooks/useToast';

const Services = ({ onBack, onAddToOrder }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
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
      showToast('Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    if (onAddToOrder) {
      onAddToOrder(service, 'service');
      showToast(`Added ${service.title} to order!`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price)
          })
          .eq('id', editingId);

        if (error) throw error;
        showToast('Service updated successfully!', 'success');
      } else {
        // Insert new service
        const { error } = await supabase
          .from('services')
          .insert([{
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price)
          }]);

        if (error) throw error;
        showToast('Service added successfully!', 'success');
      }

      setFormData({ title: '', description: '', price: '' });
      setEditingId(null);
      setShowForm(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      showToast('Error saving service', 'error');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: '' });
    setShowForm(false);
  };

  const handleDelete = (id, title) => {
    setDeleteDialog({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;
      showToast('Service deleted successfully!', 'success');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast('Error deleting service', 'error');
    }
  };

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
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-white text-3xl font-bold">Services</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
          >
            {showForm ? 'Hide Form' : '+ Add Service'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-teal-600">
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h2>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Service Name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₱)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
              >
                {editingId ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>
        )}

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
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all relative"
              >
                {/* Edit/Delete Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(service);
                    }}
                    className="bg-white text-blue-500 hover:text-blue-700 p-2 rounded-full shadow-lg"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(service.id, service.title);
                    }}
                    className="bg-white text-red-500 hover:text-red-700 p-2 rounded-full shadow-lg"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className="h-64 bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white opacity-50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null, title: '' })}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Services;
