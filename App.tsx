
import React from 'react';
import CurrencyConverter from './components/CurrencyConverter';
// import Header from './components/Header'; // You can remove this import too, as App.tsx won't use it
import Footer from './components/Footer';
import { LocalizationProvider } from './contexts/LocalizationContext';

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        {/* REMOVE THE <Header /> COMPONENT FROM HERE */}
        <main className="w-full max-w-2xl mx-auto p-4">
          <CurrencyConverter />
        </main>
        <Footer />
      </div>
    </LocalizationProvider>
  );
};

export default App;
