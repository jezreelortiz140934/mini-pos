import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SkeletonTable from './loading/SkeletonTable';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../hooks/useToast';

const WalkInAppointment = ({ onAddToOrder }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const { toasts, showToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    customer_name: '',
    contact: '',
    stylist_id: '',
    appointment_time: ''
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('walk_in_appointments')
        .select(`
          *,
          stylists (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showToast('Error loading appointments', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchStylists = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStylists(data || []);
    } catch (error) {
      console.error('Error fetching stylists:', error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchStylists();
  }, [fetchAppointments, fetchStylists]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing appointment
        const { error } = await supabase
          .from('walk_in_appointments')
          .update({
            customer_name: formData.customer_name,
            contact: formData.contact,
            service: formData.service,
            stylist_id: formData.stylist_id,
            appointment_time: formData.appointment_time
          })
          .eq('id', editingId);

        if (error) throw error;
        showToast('Appointment updated successfully!', 'success');
        setEditingId(null);
      } else {
        // Insert new appointment
        const { data, error } = await supabase
          .from('walk_in_appointments')
          .insert([formData])
          .select(`
            *,
            stylists (name)
          `);

        if (error) throw error;
        showToast('Appointment added successfully!', 'success');
        setAppointments([data[0], ...appointments]);
      }

      setFormData({
        customer_name: '',
        contact: '',
        stylist_id: '',
        appointment_time: ''
      });
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      showToast('Error saving appointment', 'error');
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({
      customer_name: appointment.customer_name,
      contact: appointment.contact,
      stylist_id: appointment.stylist_id,
      appointment_time: appointment.appointment_time
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      customer_name: '',
      contact: '',
      stylist_id: '',
      appointment_time: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setDeleteDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('walk_in_appointments')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      setAppointments(appointments.filter(apt => apt.id !== deleteDialog.id));
      showToast('Appointment deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      showToast('Error deleting appointment', 'error');
    }
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl font-bold">Walk In Appointment</h1>
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
            {showForm ? 'Cancel' : '+ Add Appointment'}
          </button>
        </div>

        {/* Add/Edit Appointment Form */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? 'Edit Appointment' : 'New Walk-In Appointment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Contact</label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stylist</label>
                  <select
                    value={formData.stylist_id}
                    onChange={(e) => setFormData({ ...formData, stylist_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select Stylist</option>
                    {stylists.map(stylist => (
                      <option key={stylist.id} value={stylist.id}>{stylist.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                {editingId ? 'Update Appointment' : 'Add Appointment'}
              </button>
            </form>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <SkeletonTable columns={5} rows={5} />
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No appointments yet</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Appointment" to create one</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-xl fade-in">
            <table className="w-full">
              <thead>
                <tr className="bg-pink-300">
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Name</th>
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Contact</th>
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Stylist</th>
                  <th className="py-4 px-6 text-white font-bold text-left border-r border-pink-400">Time</th>
                  <th className="py-4 px-6 text-white font-bold text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="bg-pink-200 border-b-2 border-white hover:bg-pink-300 transition-colors">
                    <td className="py-4 px-6 border-r-2 border-white">{apt.customer_name}</td>
                    <td className="py-4 px-6 border-r-2 border-white">{apt.contact}</td>
                    <td className="py-4 px-6 border-r-2 border-white">{apt.stylists?.name || 'N/A'}</td>
                    <td className="py-4 px-6 border-r-2 border-white">{apt.appointment_time}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(apt)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
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
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default WalkInAppointment;
