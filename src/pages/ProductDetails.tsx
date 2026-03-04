import { useParams, Link } from 'react-router-dom';
import { Product, Settings } from '../types';
import { ArrowLeft, ShoppingBag, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ProductDetails({ 
  products, 
  settings, 
  cart, 
  onToggleCart 
}: { 
  products: Product[], 
  settings: Settings,
  cart: Product[],
  onToggleCart: (p: Product) => void
}) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const isSelected = cart.some(p => p.id === product?.id);

  if (!product) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Produit non trouvé</h2>
        <Link to="/" className="text-white/60 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 px-8 bg-black/50 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="text-2xl font-serif tracking-widest">{settings.siteName}</Link>
        <div className="flex items-center space-x-6">
          <Link to="/booking" className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all group">
            <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            {cart.length > 0 && (
              <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Retour à la collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="aspect-[4/5] bg-white/5 rounded-2xl overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">{product.category}</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-6">{product.name}</h1>
            <p className="text-2xl font-light mb-8">{product.price}</p>
            
            <div className="w-full h-px bg-white/10 mb-8"></div>
            
            <div className="space-y-6 mb-12">
              <h3 className="text-xs uppercase tracking-widest text-white/60">Description</h3>
              <p className="text-white/70 font-light leading-relaxed text-lg">
                {product.description || "Aucune description disponible pour ce produit d'exception. Découvrez l'excellence de MYMY MAQUILLAGE à travers cette création unique."}
              </p>
            </div>

            <button 
              onClick={() => onToggleCart(product)}
              className={`w-full py-5 rounded-full text-sm uppercase tracking-widest font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isSelected ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-black hover:bg-white/90'}`}
            >
              {isSelected ? 'Retirer de ma sélection' : 'Sélectionner pour mon soin'}
            </button>
            
            {isSelected && (
              <Link to="/booking" className="w-full mt-4 text-center text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                Passer au rendez-vous →
              </Link>
            )}

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border border-white/5 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Livraison</p>
                <p className="text-xs">48-72h</p>
              </div>
              <div className="p-4 border border-white/5 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Qualité</p>
                <p className="text-xs">Premium</p>
              </div>
              <div className="p-4 border border-white/5 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Retour</p>
                <p className="text-xs">30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-black border-t border-white/5 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-serif tracking-widest">{settings.siteName}</h3>
            <p className="text-sm text-white/50 font-light leading-relaxed">
              L'excellence de la beauté de luxe, conçue pour sublimer chaque femme avec des produits d'exception.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Suivez-nous</h4>
            <div className="flex space-x-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
