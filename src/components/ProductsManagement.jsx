import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Toast from './Toast';
import { useToast } from '../hooks/useToast';

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: imageUrl
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        showToast('Product updated successfully!', 'success');
      } else {
        // Insert new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        showToast('Product added successfully!', 'success');
      }

      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || ''
    });
    setImagePreview(product.image_url || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      image_url: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-600 p-8">
      <button 
        onClick={() => navigate('/admin')}
        className="mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white text-4xl font-bold mb-2">Product Management</h1>
            <p className="text-purple-100">Manage your salon products</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-xl">
            <p className="text-gray-500 text-xl">No products available</p>
            <p className="text-gray-400 mt-2">Click "Add Product" to create one</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                {product.image_url && (
                  <div className="w-full bg-gray-100 flex items-center justify-center p-4">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">₱{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>

                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Price (₱) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : editingProduct ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default ProductsManagement;
