export interface MenuItem {
  _id: string;
  name: string;
  menuGroup?: 'Upvas' | 'Regular' | 'Party' | 'Cloud Kitchen';
  description: string;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Beverages' | 'Prasadam';
  price: number;
  image?: string;
  isAvailable: boolean;
  isVegan: boolean;
  ingredients: string[];
  createdAt: string;
}

export interface Booking {
  _id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  eventDate: string;
  eventType: string;
  numberOfGuests: number;
  serviceType: 'Catering' | 'Cloud Kitchen' | 'Prasadam Seva';
  specialRequirements?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface AnalyticsReport {
  generatedAt: string;
  totalUsers: number;
  totalBookings: number;
  amountBooked: number;
  amountCollected: number;
  pendingPayments: number;
  paidBookings: number;
  pendingBookings: number;
  statuses: { status: string; count: number }[];
  monthly: { month: string; bookings: number; revenue: number }[];
  popularItems: { name: string; quantity: number }[];
  payments: { method: string; count: number; amount: number }[];
}
