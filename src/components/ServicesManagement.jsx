import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonCard from './loading/SkeletonCard';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../hooks/useToast';

const ServicesManagement = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    image_url: '',
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, title: '' });
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

  const getServiceImage = (title) => {
    const serviceName = title.toLowerCase();
    
    if (serviceName.includes('haircut') || serviceName.includes('hair cut')) {
      return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('color')) {
      return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('perm')) {
      return 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('condition') || serviceName.includes('treatment')) {
      return 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('keratin')) {
      return 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('spa')) {
      return 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop';
    }
    if (serviceName.includes('massage')) {
      return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop';
  };

  const handleImageUpload = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `service-${Date.now()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Error uploading image', 'error');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url;

      // Upload image if file is selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) return; // Stop if upload failed
      }

      const serviceData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration ? parseInt(formData.duration) : null,
        category: formData.category || null,
        image_url: imageUrl || null,
        is_active: formData.is_active
      };

      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingId);

        if (error) throw error;
        showToast('Service updated successfully!', 'success');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        showToast('Service added successfully!', 'success');
      }

      setFormData({ 
        title: '', 
        description: '', 
        price: '', 
        duration: '', 
        category: '', 
        image_url: '', 
        is_active: true 
      });
      setImageFile(null);
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
      price: service.price.toString(),
      duration: service.duration ? service.duration.toString() : '',
      category: service.category || '',
      image_url: service.image_url || '',
      is_active: service.is_active !== undefined ? service.is_active : true
    });
    setShowForm(true);
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

  const handleCancelEdit = () => {
    setFormData({ title: '', description: '', price: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="mb-8 flex items-center text-white hover:text-green-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-bold">Services Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-lg"
          >
            {showForm ? 'Hide Form' : '+ Add Service'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-600">
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
                <label className="block text-gray-700 font-semibold mb-2">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (₱)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category (Optional)</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Hair, Beauty, Spa"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {imageFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {imageFile.name}</p>
                )}
                {formData.image_url && !imageFile && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Current" className="w-32 h-32 object-cover rounded" />
                    <p className="text-sm text-gray-600 mt-1">Current image</p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active_service"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="is_active_service" className="ml-2 text-gray-700 font-semibold">
                  Active Service
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
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
                    onClick={() => handleEdit(service)}
                    className="bg-white text-blue-500 hover:text-blue-700 p-2 rounded-full shadow-lg"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.title)}
                    className="bg-white text-red-500 hover:text-red-700 p-2 rounded-full shadow-lg"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={service.image_url || getServiceImage(service.title)} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-green-600 text-xl font-bold mb-2">{service.title}</h3>
                  {service.description && (
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  )}
                  <p className="text-pink-500 font-bold text-2xl">₱{service.price.toLocaleString()}</p>
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

export default ServicesManagement;
