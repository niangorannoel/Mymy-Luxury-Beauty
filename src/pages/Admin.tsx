import { useState, ChangeEvent, useEffect } from 'react';
import { Product, Settings, Appointment } from '../types';
import { LayoutGrid, Package, Settings as SettingsIcon, Plus, Trash2, Edit2, Save, X, ArrowLeft, CalendarCheck, Clock, User, Mail, Check, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin({ 
  products, 
  settings, 
  appointments,
  onUpdateSettings, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onUpdateAppointmentStatus,
  onDeleteAppointment
}: { 
  products: Product[], 
  settings: Settings,
  appointments: Appointment[],
  onUpdateSettings: (s: Settings) => void,
  onAddProduct: (p: Omit<Product, 'id'>) => void,
  onUpdateProduct: (id: number, p: Omit<Product, 'id'>) => void,
  onDeleteProduct: (id: number) => void,
  onUpdateAppointmentStatus: (id: number, status: string) => void,
  onDeleteAppointment: (id: number) => void
}) {
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'appointments'>('appointments');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempSettings, setTempSettings] = useState<Settings>(settings);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [appointmentPage, setAppointmentPage] = useState(1);
  const appointmentsPerPage = 5;

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsSave = () => {
    onUpdateSettings(tempSettings);
    alert('Paramètres enregistrés !');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="mb-12">
          <h1 className="text-xl font-serif tracking-widest">BACK OFFICE</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Gestion du site</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'appointments' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <CalendarCheck className="w-4 h-4" />
            Rendez-vous
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Package className="w-4 h-4" />
            Produits
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'settings' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <SettingsIcon className="w-4 h-4" />
            Configuration
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'appointments' ? (
          <div>
            <header className="mb-12">
              <h2 className="text-3xl font-serif">Gestion des Rendez-vous</h2>
              <p className="text-white/50 mt-2">Consultez et traitez les demandes de soins de vos clients.</p>
            </header>

            <div className="space-y-6">
              {appointments
                .slice((appointmentPage - 1) * appointmentsPerPage, appointmentPage * appointmentsPerPage)
                .map(apt => (
                <div key={apt.id} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Client</p>
                        <h4 className="font-medium text-lg">{apt.clientName}</h4>
                        <p className="text-sm text-white/60">{apt.clientEmail}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Date & Heure</p>
                        <p className="text-sm font-medium">{new Date(apt.appointmentDate).toLocaleDateString('fr-FR')} à {apt.appointmentTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Total</p>
                        <p className="text-sm font-bold text-white">{apt.totalPrice}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Statut</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                          apt.status === 'Confirmé' ? 'bg-green-500/20 text-green-500' : 
                          apt.status === 'Annulé' ? 'bg-red-500/20 text-red-500' : 
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'Confirmé')}
                        className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                        title="Confirmer"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onUpdateAppointmentStatus(apt.id, 'Annulé')}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Annuler"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Supprimer définitivement ?')) onDeleteAppointment(apt.id); }}
                        className="p-2 bg-white/5 text-white/40 rounded-lg hover:bg-white/10 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                    <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Produits sélectionnés pour le soin</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {apt.products.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-black/40 rounded-lg">
                            <img src={p.imageUrl} className="w-10 h-10 object-cover rounded" alt={p.name} />
                            <div className="overflow-hidden">
                              <p className="text-xs font-medium truncate">{p.name}</p>
                              <p className="text-[10px] text-white/40">{p.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {appointments.length > appointmentsPerPage && (
                  <div className="flex items-center justify-center gap-4 pt-8">
                    <button 
                      onClick={() => setAppointmentPage(prev => Math.max(1, prev - 1))}
                      disabled={appointmentPage === 1}
                      className="p-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: Math.ceil(appointments.length / appointmentsPerPage) }).map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setAppointmentPage(i + 1)}
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${appointmentPage === i + 1 ? 'bg-white text-black' : 'hover:bg-white/5 text-white/40'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setAppointmentPage(prev => Math.min(Math.ceil(appointments.length / appointmentsPerPage), prev + 1))}
                      disabled={appointmentPage === Math.ceil(appointments.length / appointmentsPerPage)}
                      className="p-2 rounded-full border border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {appointments.length === 0 && (
                  <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                    <CalendarCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40">Aucun rendez-vous pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'settings' ? (
          <div className="max-w-3xl">
            <header className="mb-12">
              <h2 className="text-3xl font-serif">Configuration du Site</h2>
              <p className="text-white/50 mt-2">Personnalisez l'apparence et les textes de votre boutique.</p>
            </header>

            <div className="space-y-8">
              <div className="grid gap-6 p-8 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Nom de la marque</label>
                  <input 
                    type="text" 
                    value={tempSettings.siteName}
                    onChange={e => setTempSettings({...tempSettings, siteName: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Titre Hero</label>
                  <input 
                    type="text" 
                    value={tempSettings.heroTitle}
                    onChange={e => setTempSettings({...tempSettings, heroTitle: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Sous-titre Hero</label>
                  <textarea 
                    rows={3}
                    value={tempSettings.heroSubtitle}
                    onChange={e => setTempSettings({...tempSettings, heroSubtitle: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:border-white/30 outline-none transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Image Hero</label>
                  <div className="flex flex-col gap-4">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleFileUpload(e, (base64) => setTempSettings({...tempSettings, heroImage: base64}))}
                      className="text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-white/80 cursor-pointer"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-white/20 uppercase">Ou URL :</span>
                      <input 
                        type="text" 
                        value={tempSettings.heroImage}
                        onChange={e => setTempSettings({...tempSettings, heroImage: e.target.value})}
                        className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                  {tempSettings.heroImage && (
                    <div className="mt-4 h-32 rounded-lg overflow-hidden border border-white/10">
                      <img src={tempSettings.heroImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSettingsSave}
                className="bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </button>
            </div>
          </div>
        ) : (
          <div>
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h2 className="text-3xl font-serif">Gestion des Produits</h2>
                <p className="text-white/50 mt-2">Ajoutez, modifiez ou supprimez des articles de votre collection.</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Rechercher par nom ou ID..." 
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Produit
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {products
                .filter(p => 
                  p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || 
                  p.id.toString().includes(productSearchTerm)
                )
                .map(product => (
                <div key={product.id} className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-white/40 uppercase tracking-widest">{product.category}</p>
                      {product.services && (
                        <p className="text-xs text-white/20 italic">Services: {product.services}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right mr-8 flex flex-col items-end gap-1">
                    <p className="font-medium">{product.price}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        product.stock <= 5 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/10 text-white/40'
                      }`}>
                        Stock: {product.stock}
                      </span>
                      {product.stock <= 5 && (
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Stock Bas !</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm('Supprimer ce produit ?')) onDeleteProduct(product.id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsAdding(false); setEditingProduct(null); }}></div>
          <div className="relative bg-[#111] border border-white/10 rounded-3xl p-10 w-full max-w-xl shadow-2xl">
            <h3 className="text-2xl font-serif mb-8">{isAdding ? 'Ajouter un Produit' : 'Modifier le Produit'}</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get('name') as string,
                category: formData.get('category') as string,
                price: formData.get('price') as string,
                imageUrl: formData.get('imageUrl') as string,
                description: formData.get('description') as string,
                services: formData.get('services') as string,
                stock: parseInt(formData.get('stock') as string) || 0,
              };
              if (isAdding) onAddProduct(data);
              else if (editingProduct) onUpdateProduct(editingProduct.id, data);
              setIsAdding(false);
              setEditingProduct(null);
            }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Nom</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Catégorie</label>
                  <input name="category" defaultValue={editingProduct?.category} required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Prix</label>
                  <input name="price" defaultValue={editingProduct?.price} required className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Quantité en Stock</label>
                  <input name="stock" type="number" defaultValue={editingProduct?.stock || 0} required min="0" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
                </div>
                <div className="space-y-2">
                  {/* Empty space for alignment if needed, or another field */}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30 resize-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Services associés</label>
                <input name="services" defaultValue={editingProduct?.services} placeholder="Ex: Shampoing, Coupe, Brushing" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40">Image</label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      handleFileUpload(e, (base64) => {
                        const input = (e.target.form as HTMLFormElement).elements.namedItem('imageUrl') as HTMLInputElement;
                        if (input) input.value = base64;
                      });
                    }}
                    className="text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                  />
                  <input name="imageUrl" defaultValue={editingProduct?.imageUrl} required placeholder="Ou URL de l'image" className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-white/30" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                  className="flex-1 px-6 py-3 border border-white/10 rounded-full text-sm hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  {isAdding ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
