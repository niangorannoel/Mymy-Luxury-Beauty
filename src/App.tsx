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
import { Product, Settings, Appointment } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProducts = localStorage.getItem('mymy_products');
    const savedSettings = localStorage.getItem('mymy_settings');
    const savedAppointments = localStorage.getItem('mymy_appointments');
    const savedCart = localStorage.getItem('mymy_cart');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const defaultProducts: Product[] = [
        { id: 1, name: 'Sérum Éclat Absolu', category: 'Soin', price: '44.500 FCFA', imageUrl: 'https://images.unsplash.com/photo-1608571423902-369d87195231?q=80&w=800', stock: 15 },
        { id: 2, name: 'Rouge Velours Intense', category: 'Lèvres', price: '23.000 FCFA', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800', stock: 8 },
        { id: 3, name: 'Palette Ombres Célestes', category: 'Yeux', price: '34.000 FCFA', imageUrl: 'https://images.unsplash.com/photo-1512207128-52591706248d?q=80&w=800', stock: 4 },
        { id: 4, name: 'Fond de Teint Lumière', category: 'Teint', price: '29.500 FCFA', imageUrl: 'https://images.unsplash.com/photo-1607599542258-92b372a44a1e?q=80&w=800', stock: 20 },
      ];
      setProducts(defaultProducts);
      localStorage.setItem('mymy_products', JSON.stringify(defaultProducts));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      const defaultSettings: Settings = {
        siteName: "Mymy Luxury Beauty",
        heroTitle: "AMI BEAUTÉ",
        heroSubtitle: "Découvrez des textures innovantes et des couleurs vibrantes qui révèlent votre éclat naturel.",
        heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1920&auto=format&fit=crop"
      };
      setSettings(defaultSettings);
      localStorage.setItem('mymy_settings', JSON.stringify(defaultSettings));
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('mymy_products', JSON.stringify(products));
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading && settings) {
      localStorage.setItem('mymy_settings', JSON.stringify(settings));
    }
  }, [settings, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('mymy_appointments', JSON.stringify(appointments));
    }
  }, [appointments, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('mymy_cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const toggleCartItem = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, product: Omit<Product, 'id'>) => {
    setProducts(products.map(p => p.id === id ? { ...product, id } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    const newAppointment: Appointment = {
      ...appointment,
      id: newId,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };
    setAppointments([newAppointment, ...appointments]);
  };

  const updateAppointmentStatus = (id: number, status: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
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
              onAddAppointment={addAppointment}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <Admin 
              products={products} 
              settings={settings} 
              appointments={appointments}
              onUpdateSettings={updateSettings}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onUpdateAppointmentStatus={updateAppointmentStatus}
              onDeleteAppointment={deleteAppointment}
            />
          } 
        />
      </Routes>
    </Router>
  );
}
