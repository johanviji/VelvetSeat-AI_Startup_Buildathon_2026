import FloatingParticles from './components/FloatingParticles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import SalonProfile from './pages/SalonProfile';
import AIConcierge from './pages/AIConcierge';
import BookingConfirmation from './pages/BookingConfirmation';
import Compare from './pages/Compare';
import Search from "./pages/Search";

export default function App() {
  const [salons, setSalons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalons();
  }, []);

  const fetchSalons = async () => {
    try {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setSalons(data || []);
    } catch (error) {
      console.error('Error fetching salons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1A0A0F]">
        <Navbar />
        <FloatingParticles />
        <Routes>
          <Route path="/" element={<Home salons={salons} loading={loading} />} />
          <Route path="/salon/:id" element={<SalonProfile />} />
          <Route path="/concierge" element={<AIConcierge />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/search" element={<Search />} />


          <Route path="/compare" element={<Compare />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}