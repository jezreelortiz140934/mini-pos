import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WalkInAppointment from './components/WalkInAppointment';
import Services from './components/Services';
import Stylist from './components/Stylist';
import Sales from './components/Sales';
import Products from './components/Products';
import Inventory from './components/Inventory';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [orderItems, setOrderItems] = useState([]);

  const addToOrder = (item, type) => {
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

  return (
    <Router basename="/mini-pos">
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                orderItems={orderItems}
                onRemoveFromOrder={removeFromOrder}
                onUpdateQuantity={updateQuantity}
                onClearOrder={clearOrder}
              />
            } 
          />
          <Route 
            path="/walkin" 
            element={<WalkInAppointment onAddToOrder={addToOrder} />} 
          />
          <Route 
            path="/services" 
            element={<Services onAddToOrder={addToOrder} />} 
          />
          <Route 
            path="/stylist" 
            element={<Stylist />} 
          />
          <Route 
            path="/sales" 
            element={<Sales />} 
          />
          <Route 
            path="/products" 
            element={<Products onAddToOrder={addToOrder} />} 
          />
          <Route 
            path="/inventory" 
            element={<Inventory />} 
          />
          <Route 
            path="/admin/*" 
            element={<AdminDashboard />} 
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
