export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  description?: string;
  services?: string;
  stock: number;
}

export interface Settings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
}

export interface Appointment {
  id: number;
  clientName: string;
  clientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  totalPrice: string;
  status: string;
  products: Product[];
  createdAt: string;
}
