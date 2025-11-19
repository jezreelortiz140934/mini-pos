import './App.css';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import WalkInAppointment from './components/WalkInAppointment';
import Services from './components/Services';
import Stylist from './components/Stylist';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'walkin':
        return <WalkInAppointment onBack={() => setCurrentPage('dashboard')} />;
      case 'services':
        return <Services onBack={() => setCurrentPage('dashboard')} />;
      case 'stylist':
        return <Stylist onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
