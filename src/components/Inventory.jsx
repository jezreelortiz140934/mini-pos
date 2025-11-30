import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonTable from './loading/SkeletonTable';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../hooks/useToast';

const Inventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });
  const { toasts, showToast, removeToast } = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    sku: '',
    supplier: '',
    description: '',
    image_url: '',
    is_active: true
  });

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);

      // Handle image upload if a file is selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category || null,
        sku: formData.sku || null,
        supplier: formData.supplier || null,
        description: formData.description || null,
        image_url: imageUrl || null,
        is_active: formData.is_active
      };

      if (editingId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId);

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

      setFormData({ 
        name: '', 
        price: '', 
        stock: '', 
        category: '', 
        sku: '', 
        supplier: '', 
        description: '', 
        image_url: '', 
        is_active: true 
      });
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error saving product', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || '',
      sku: product.sku || '',
      supplier: product.supplier || '',
      description: product.description || '',
      image_url: product.image_url || '',
      is_active: product.is_active !== undefined ? product.is_active : true
    });
    setImagePreview(product.image_url || null);
    setImageFile(null);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      price: '', 
      stock: '', 
      category: '', 
      sku: '', 
      supplier: '', 
      description: '', 
      image_url: '', 
      is_active: true 
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
  };

  const handleDelete = (id, name) => {
    setDeleteDialog({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;
      showToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Error deleting product', 'error');
    }
  };

  const handleQuickStockUpdate = async (productId, currentStock, change) => {
    const newStock = currentStock + change;
    if (newStock < 0) {
      showToast('Stock cannot be negative', 'warning');
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);

      if (error) throw error;
      showToast(`Stock updated to ${newStock}`, 'success');
      fetchProducts();
    } catch (error) {
      console.error('Error updating stock:', error);
      showToast('Error updating stock', 'error');
    }
  };

  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalItems = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-purple-500 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin')}
        className="mb-4 sm:mb-6 md:mb-8 flex items-center text-white hover:text-purple-200 transition-colors"
      >
        <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Inventory Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-purple-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg text-sm sm:text-base"
          >
            {showForm ? 'Hide Form' : '+ Add Product'}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-lg">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Products</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-lg">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Items in Stock</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalItems}</p>
          </div>
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 shadow-lg">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Inventory Value</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">₱{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8 rounded text-sm sm:text-base">
            <p className="font-bold">Low Stock Alert!</p>
            <p>{lowStockCount} product(s) have less than 10 items in stock.</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                {editingId ? 'Edit Product' : 'Add New Product'}
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
                <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (₱)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category (Optional)</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Hair Care, Skin Care"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">SKU (Optional)</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., SHP-001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Supplier (Optional)</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Product Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="mt-2">
                  <label className="block text-gray-700 font-semibold mb-2">Or enter Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-700 font-semibold">
                  Active Product
                </label>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : (editingId ? 'Update Product' : 'Add Product')}
              </button>
            </form>
          </div>
        )}

        {/* Inventory Table */}
        {loading ? (
          <SkeletonTable columns={6} rows={8} />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No products in inventory</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Product" to get started</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl fade-in">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-500">
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-purple-600">Product Name</th>
                  <th className="py-4 px-6 text-white font-bold text-right border-r border-purple-600">Price</th>
                  <th className="py-4 px-6 text-white font-bold text-center border-r border-purple-600">Stock</th>
                  <th className="py-4 px-6 text-white font-bold text-center border-r border-purple-600">Stock Status</th>
                  <th className="py-4 px-6 text-white font-bold text-center border-r border-purple-600">Quick Update</th>
                  <th className="py-4 px-6 text-white font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr 
                    key={product.id}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50 transition-colors`}
                  >
                    <td className="py-4 px-6 border-r border-gray-200 font-semibold">{product.name}</td>
                    <td className="py-4 px-6 border-r border-gray-200 text-right">₱{product.price.toFixed(2)}</td>
                    <td className="py-4 px-6 border-r border-gray-200 text-center">
                      <span className="text-lg font-bold">{product.stock}</span>
                    </td>
                    <td className="py-4 px-6 border-r border-gray-200 text-center">
                      {product.stock === 0 ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Out of Stock</span>
                      ) : product.stock < 10 ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">Low Stock</span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">In Stock</span>
                      )}
                    </td>
                    <td className="py-4 px-6 border-r border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleQuickStockUpdate(product.id, product.stock, -1)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold"
                          title="Decrease by 1"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(product.id, product.stock, 1)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-bold"
                          title="Increase by 1"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(product.id, product.stock, 10)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold"
                          title="Increase by 10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default Inventory;
