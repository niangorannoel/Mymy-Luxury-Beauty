import { Search, ShoppingBag, Instagram, Facebook, Twitter, Settings as SettingsIcon } from 'lucide-react';
import { Product, Settings } from '../types';
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
import ThreeDCarousel from '../components/ThreeDCarousel';

interface ProductCardProps extends Product {
  key?: number;
}

const ProductCard = ({ id, name, category, price, imageUrl, isSelected, onToggle }: ProductCardProps & { isSelected: boolean, onToggle: (e: MouseEvent) => void }) => (
  <Link to={`/product/${id}`} id={`product-${id}`} className="text-center group block relative">
    <div className="w-full h-96 bg-gray-900/50 mb-4 overflow-hidden relative rounded-xl">
        <img 
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
            <span className="bg-white text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full">Détails</span>
            <button 
              onClick={onToggle}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full border transition-all ${isSelected ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-white text-white hover:bg-white hover:text-black'}`}
            >
              {isSelected ? 'Retirer' : 'Sélectionner'}
            </button>
        </div>
        {isSelected && (
          <div className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-xl">
            <ShoppingBag className="w-4 h-4" />
          </div>
        )}
    </div>
    <h4 className="font-serif text-lg">{name}</h4>
    <p className="text-sm text-white/50">{category}</p>
    <p className="mt-2 font-medium tracking-wider">{price}</p>
  </Link>
);

export default function Home({ 
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
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <header id="main-header" className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 px-8 bg-black/50 backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl font-serif tracking-widest">{settings.siteName}</h1>
        <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider">
          <a href="#" className="hover:text-gray-300 transition-colors">Nouveautés</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Maquillage</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Soin</a>
          <Link to="/admin" className="text-white/40 hover:text-white transition-colors flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-6">
          <button id="search-button" aria-label="Rechercher">
            <Search className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
          </button>
          <Link to="/booking" className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all group">
            <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            {cart.length > 0 && (
              <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
            <span className="text-xs uppercase tracking-widest hidden sm:inline">Rendez-vous</span>
          </Link>
        </div>
      </header>

      <main>
        <section 
          id="hero-section"
          className="h-screen bg-cover bg-center flex items-center justify-center text-center relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-50 transition-all duration-1000 scale-105"
            style={{ backgroundImage: `url('${settings.heroImage}')` }}
            role="presentation"
          ></div>
          <div className="relative z-10 p-8 max-w-4xl">
            <h2 className="text-6xl md:text-9xl font-serif font-light leading-none tracking-tight mb-6">{settings.heroTitle}</h2>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/80 font-light leading-relaxed">{settings.heroSubtitle}</p>
            <button id="discover-collection-button" className="mt-12 px-12 py-4 text-sm uppercase tracking-widest border border-white/50 rounded-full hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-105">
              Découvrir la collection
            </button>
          </div>
        </section>

        <section id="threed-carousel-section" className="py-20 bg-black">
          <div className="text-center mb-16 px-8">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white/20 mb-8">AMI BEAUTÉ</h4>
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">L'Art de la Beauté</h3>
            <h2 className="text-4xl md:text-5xl font-serif font-light italic mb-6">Une Expérience Sensorielle</h2>
            <p className="text-white/50 max-w-xl mx-auto font-light leading-relaxed">
              Plongez dans notre univers où chaque produit est une œuvre d'art, conçue pour sublimer votre éclat naturel avec une précision absolue.
            </p>
          </div>
          <ThreeDCarousel />
        </section>

        <section id="featured-products" className="py-32 px-8 bg-[#0a0a0a]">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h3 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-4">Nos Incontournables</h3>
            <h2 className="text-4xl md:text-6xl font-serif font-light">Les Favoris de nos Clients</h2>
            <div className="w-24 h-px bg-white/20 mx-auto mt-8"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16 mt-16 max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product}
                isSelected={cart.some(p => p.id === product.id)}
                onToggle={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCart(product);
                }}
              />
            ))}
          </div>
        </section>
      </main>

      <footer id="main-footer" className="bg-black border-t border-white/5 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-serif tracking-widest">{settings.siteName}</h3>
            <p className="text-sm text-white/50 font-light leading-relaxed">
              L'excellence de la beauté de luxe, conçue pour sublimer chaque femme avec des produits d'exception.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Aide</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><a href="#" className="hover:text-white transition-colors text-white/70">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-white/70">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-white/70">Livraison & Retours</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Légal</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><a href="#" className="hover:text-white transition-colors text-white/70">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-white/70">Confidentialité</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-6">Suivez-nous</h4>
            <div className="flex space-x-6">
              <a href="#" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="text-white/60 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] uppercase tracking-[0.2em] text-white/20 mt-20 pt-8 border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} {settings.siteName}. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
