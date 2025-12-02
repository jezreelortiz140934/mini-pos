import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WalkInAppointment from './components/WalkInAppointment';
import Services from './components/Services';
import Stylist from './components/Stylist';

import Products from './components/Products';
import Inventory from './components/Inventory';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);

  // Check for existing session on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToOrder = (item, type, navigate) => {
    const existingItem = orderItems.find(
      orderItem => orderItem.id === item.id && orderItem.type === type
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map(orderItem =>
          orderItem.id === item.id && orderItem.type === type
            ? { ...orderItem, qty: orderItem.qty + 1 }
            : orderItem
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: item.id,
          name: item.title || item.name,
          price: item.price,
          qty: 1,
          type: type
        }
      ]);
    }
    
    // Navigate back to dashboard with loading state
    if (navigate) {
      navigate('/', { state: { showLoading: true } });
    }
  };

  const removeFromOrder = (id, type) => {
    setOrderItems(orderItems.filter(item => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id, type, newQty) => {
    if (newQty <= 0) {
      removeFromOrder(id, type);
    } else {
      setOrderItems(
        orderItems.map(item =>
          item.id === id && item.type === type
            ? { ...item, qty: newQty }
            : item
        )
      );
    }
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrderItems([]);
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard 
                  orderItems={orderItems}
                  onRemoveFromOrder={removeFromOrder}
                  onUpdateQuantity={updateQuantity}
                  onClearOrder={clearOrder}
                  onLogout={handleLogout}
                  user={user}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/walkin" 
            element={
              <ProtectedRoute>
                <WalkInAppointment onAddToOrder={addToOrder} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/services" 
            element={
              <ProtectedRoute>
                <Services onAddToOrder={addToOrder} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stylist" 
            element={
              <ProtectedRoute>
                <Stylist />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <Products onAddToOrder={addToOrder} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
