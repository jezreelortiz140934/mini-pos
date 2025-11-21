import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Stylist = ({ onBack }) => {
  const [showForm, setShowForm] = useState(false);
  const [stylists, setStylists] = useState([]);
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch stylists from Supabase
  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setStylists(data || []);
    } catch (error) {
      console.error('Error fetching stylists:', error);
      alert('Error loading stylists');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.contact) {
      try {
        if (editingId) {
          // Update existing stylist
          const { data, error } = await supabase
            .from('stylists')
            .update({
              name: formData.name,
              contact_number: formData.contact,
            })
            .eq('id', editingId)
            .select();

          if (error) throw error;

          setStylists(stylists.map(s => s.id === editingId ? data[0] : s));
          setEditingId(null);
        } else {
          // Insert new stylist
          const { data, error } = await supabase
            .from('stylists')
            .insert([
              {
                name: formData.name,
                contact_number: formData.contact,
              }
            ])
            .select();

          if (error) throw error;

          setStylists([data[0], ...stylists]);
        }
        
        setFormData({ name: '', contact: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error saving stylist:', error);
        alert('Error saving stylist');
      }
    }
  };

  const handleEdit = (stylist) => {
    setFormData({ name: stylist.name, contact: stylist.contact_number });
    setEditingId(stylist.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', contact: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stylist?')) {
      try {
        const { error } = await supabase
          .from('stylists')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setStylists(stylists.filter(stylist => stylist.id !== id));
      } catch (error) {
        console.error('Error deleting stylist:', error);
        alert('Error deleting stylist');
      }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-bold">Stylists</h1>
          <button 
            onClick={() => {
              if (showForm && editingId) {
                handleCancelEdit();
              } else {
                setShowForm(!showForm);
              }
            }}
            className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Stylist'}
          </button>
        </div>

        {/* Add/Edit Stylist Form */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Stylist' : 'Add New Stylist'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter stylist name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="09XXXXXXXXX"
                  pattern="[0-9]{11}"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {editingId ? 'Update Stylist' : 'Add Stylist'}
              </button>
            </form>
          </div>
        )}

        {/* Stylists Grid */}
        {loading ? (
          <div className="text-center text-white text-xl py-12">Loading stylists...</div>
        ) : stylists.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-xl">
            <p className="text-gray-500 text-xl">No stylists yet. Add your first stylist!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stylists.map((stylist) => (
              <div 
                key={stylist.id}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                    </svg>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(stylist)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(stylist.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{stylist.name}</h3>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{stylist.contact_number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stylist;
