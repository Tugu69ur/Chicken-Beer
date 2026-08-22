import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

function AppShell() {
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('orders') || '[]');
      const count = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);
      setBasketCount(count);
    };

    updateCount();
    window.addEventListener('cartUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar basketCount={basketCount} />
      <main className="flex-1">
        <Outlet context={{ basketCount }} />
      </main>
      <Footer />
    </div>
  );
}

export default AppShell;
