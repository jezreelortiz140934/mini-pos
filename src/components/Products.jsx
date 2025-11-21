import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Products = ({ onNavigate, onAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (productName && productPrice && productStock) {
      try {
        if (editingId) {
          // Update existing product
          const { data, error } = await supabase
            .from('products')
            .update({
              name: productName,
              price: parseFloat(productPrice),
              stock: parseInt(productStock)
            })
            .eq('id', editingId)
            .select();

          if (error) throw error;

          setProducts(products.map(p => p.id === editingId ? data[0] : p));
          setEditingId(null);
        } else {
          // Insert new product
          const { data, error } = await supabase
            .from('products')
            .insert([
              {
                name: productName,
                price: parseFloat(productPrice),
                stock: parseInt(productStock)
              }
            ])
            .select();

          if (error) throw error;

          setProducts([data[0], ...products]);
        }
        
        setProductName('');
        setProductPrice('');
        setProductStock('');
        setShowForm(false);
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductStock(product.stock.toString());
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setProductName('');
    setProductPrice('');
    setProductStock('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Products</h1>
          </div>
          <button
            onClick={() => {
              if (showForm && editingId) {
                handleCancelEdit();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => editingId ? handleCancelEdit() : setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg">No products yet</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Product" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-gray-800">₱{product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  {onAddToOrder && product.stock > 0 && (
                    <button
                      onClick={() => {
                        onAddToOrder(product, 'product');
                        alert(`Added ${product.name} to order!`);
                      }}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition-colors mt-3"
                    >
                      Add to Order
                    </button>
                  )}
                  {product.stock === 0 && (
                    <div className="text-center text-red-500 font-semibold py-2">
                      Out of Stock
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
