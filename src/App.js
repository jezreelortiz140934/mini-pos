import './App.css';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import WalkInAppointment from './components/WalkInAppointment';
import Services from './components/Services';
import Stylist from './components/Stylist';
import Sales from './components/Sales';
import Products from './components/Products';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
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

  const renderPage = () => {
    switch(currentPage) {
      case 'walkin':
        return <WalkInAppointment onBack={() => setCurrentPage('dashboard')} onAddToOrder={addToOrder} />;
      case 'services':
        return <Services onBack={() => setCurrentPage('dashboard')} onAddToOrder={addToOrder} />;
      case 'stylist':
        return <Stylist onBack={() => setCurrentPage('dashboard')} />;
      case 'sales':
        return <Sales onBack={() => setCurrentPage('dashboard')} />;
      case 'products':
        return <Products onNavigate={setCurrentPage} onAddToOrder={addToOrder} />;
      default:
        return <Dashboard 
          onNavigate={setCurrentPage} 
          orderItems={orderItems}
          onRemoveFromOrder={removeFromOrder}
          onUpdateQuantity={updateQuantity}
          onClearOrder={clearOrder}
        />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
