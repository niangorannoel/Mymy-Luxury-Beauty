/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Booking from './pages/Booking';
import { Product, Settings } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const savedCart = localStorage.getItem('mymy_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('mymy_cart', JSON.stringify(cart));
  }, [cart]);

  const toggleCartItem = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('mymy_cart');
  };

  const fetchData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings')
      ]);
      const pData = await pRes.json();
      const sData = await sRes.json();
      setProducts(pData);
      setSettings(sData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    setSettings(newSettings);
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    setProducts([...products, { ...product, id: data.id }]);
  };

  const updateProduct = async (id: number, product: Omit<Product, 'id'>) => {
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    setProducts(products.map(p => p.id === id ? { ...product, id } : p));
  };

  const deleteProduct = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading || !settings) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white font-serif text-2xl animate-pulse tracking-widest uppercase">Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              products={products} 
              settings={settings} 
              cart={cart}
              onToggleCart={toggleCartItem}
            />
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProductDetails 
              products={products} 
              settings={settings} 
              cart={cart}
              onToggleCart={toggleCartItem}
            />
          } 
        />
        <Route 
          path="/booking" 
          element={
            <Booking 
              selectedProducts={cart} 
              settings={settings} 
              onClearCart={clearCart}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <Admin 
              products={products} 
              settings={settings} 
              onUpdateSettings={updateSettings}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />
          } 
        />
      </Routes>
    </Router>
  );
}
