import { useState, FormEvent } from 'react';
import { Product, Settings } from '../types';
import { ArrowLeft, Calendar, Clock, User, Mail, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarPicker from '../components/CalendarPicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Booking({ 
  selectedProducts, 
  settings, 
  onClearCart 
}: { 
  selectedProducts: Product[], 
  settings: Settings,
  onClearCart: () => void
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const totalPrice = selectedProducts.reduce((acc, p) => {
    const price = parseInt(p.price.replace(/[^0-9]/g, '')) || 0;
    return acc + price;
  }, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Veuillez sélectionner une date pour votre rendez-vous.');
      return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const bookingData = {
      clientName: formData.get('name'),
      clientEmail: formData.get('email'),
      appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
      appointmentTime: formData.get('time'),
      totalPrice: `${totalPrice.toLocaleString()} FCFA`,
      products: selectedProducts
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        onClearCart();
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-4xl font-serif mb-4">Rendez-vous Confirmé !</h2>
        <p className="text-white/60 max-w-md mx-auto mb-8">
          Votre demande a été transmise à l'équipe de {settings.siteName}. Nous vous contacterons très prochainement pour confirmer votre séance.
        </p>
        <Link to="/" className="text-sm uppercase tracking-widest border border-white/20 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="p-6 px-8 border-b border-white/5 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif tracking-widest">{settings.siteName}</Link>
      </header>

      <main className="max-w-6xl mx-auto py-16 px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-xs uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Modifier ma sélection
          </Link>
          
          <h1 className="text-4xl font-serif mb-8">Finaliser mon Rendez-vous</h1>
          
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Ma sélection de soins</h3>
            <div className="space-y-4">
              {selectedProducts.map(product => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <img src={product.imageUrl} className="w-16 h-16 object-cover rounded-lg" alt={product.name} />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-xs text-white/40">{product.category}</p>
                  </div>
                  <p className="font-medium">{product.price}</p>
                </div>
              ))}
              {selectedProducts.length === 0 && (
                <p className="text-white/40 italic">Aucun produit sélectionné.</p>
              )}
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
              <span className="text-sm uppercase tracking-widest text-white/40">Total Estimé</span>
              <span className="text-3xl font-serif">{totalPrice.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10">
          <h2 className="text-2xl font-serif mb-8">Vos Informations</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                <User className="w-3 h-3" /> Nom Complet
              </label>
              <input name="name" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" placeholder="Ex: Marie Koné" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input name="email" type="email" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" placeholder="marie@example.com" />
            </div>

            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Date souhaitée
              </label>
              <CalendarPicker 
                selectedDate={selectedDate} 
                onDateSelect={setSelectedDate} 
              />
              {selectedDate && (
                <p className="text-xs text-white/60 text-center">
                  Date sélectionnée : <span className="text-white font-medium">{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                <Clock className="w-3 h-3" /> Heure
              </label>
              <input name="time" type="time" required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || selectedProducts.length === 0}
              className="w-full bg-white text-black py-5 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isSubmitting ? 'Traitement...' : 'Confirmer le Rendez-vous'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
