const API_BASE_URL = 'https://mediaco-backend.vercel.app/api';

// Storage keys
const USER_ID_KEY = 'user_id';
const USER_DATA_KEY = 'user_data';

// Types
export interface SignupData {
  full_name: string;
  email_address: string;
  password: string;
  company_name?: string;
}

export interface LoginData {
  email_address: string;
  password: string;
}

export interface User {
  id: string;
  full_name: string;
  email_address: string;
  company_name?: string;
  created_at: string;
  last_login?: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Booking {
  id: string;
  campaign_name: string;
  campaign_reference?: string;
  campaign_ref?: string;
  client_name: string;
  client_email?: string;
  status: 'submitted' | 'pdf_generated' | 'sent' | 'confirmed' | 'rejected';
  progress_percentage?: number;
  progress?: number;
  net_amount: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
}

export interface BookingDetails extends Booking {
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  client_phone?: string;
  client_company?: string;
  campaign_description?: string;
  media_type?: string;
  gross_amount?: number;
  partner_discount?: number;
  additional_charges?: number;
  commission_percentage?: number;
  commission_amount?: number;
  vat_percentage?: number;
  vat_amount?: number;
  industry_segment?: string;
  address?: string;
  tax_registration_no?: string;
  creative_delivery_date?: string;
  placement_preferences?: string;
  creative_file_link?: string;
  creative_specs?: string;
  creative_specifications?: string;
  special_instructions?: string;
  signatory_name?: string;
  signatory_title?: string;
  signature_date?: string;
  authorization_required?: boolean;
  timeline?: StatusHistoryEntry[];
  pdf_url?: string;
}

export interface StatusHistoryEntry {
  id: string;
  booking_id: string;
  status: string;
  changed_at: string;
  notes?: string;
}

export interface SalesRepInboxItem {
  rep_status_id: string;
  booking_id: string;
  campaign_name: string;
  client_name: string;
  net_amount: number;
  priority: 'Low' | 'Medium' | 'High';
  rep_status: 'pending' | 'reviewed' | 'confirmed' | 'rejected';
}

export interface ReportsData {
  total_revenue: number;
  total_bookings: number;
  active_clients: number;
  avg_booking_value: number;
  status_distribution: {
    submitted: number;
    in_progress: number;
    confirmed: number;
    rejected: number;
  };
  monthly_performance: {
    month: string;
    revenue: number;
    bookings: number;
  }[];
  top_clients: {
    name: string;
    revenue: number;
    bookings: number;
  }[];
  recent_activity: {
    confirmed_bookings: number;
    total_value: number;
  };
}

export interface UserSettings {
  email_recipients: string[];
}

// Storage utilities
export const storage = {
  setUserId: (userId: string) => {
    localStorage.setItem(USER_ID_KEY, userId);
  },
  
  getUserId: (): string | null => {
    return localStorage.getItem(USER_ID_KEY);
  },
  
  setUserData: (userData: User) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    storage.setUserId(userData.id);
  },
  
  getUserData: (): User | null => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  getUserRole: (): string | null => {
    const userData = storage.getUserData();
    return userData?.role || null;
  },
  
  clearUserData: () => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }
};

// Base API function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.message || responseData.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data: responseData.data, // Extract data from the response
      message: responseData.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Auth API functions
export const authAPI = {
  async signup(signupData: SignupData): Promise<ApiResponse<User>> {
    const response = await apiCall<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });

    if (response.success && response.data) {
      storage.setUserData(response.data);
    }

    return response;
  },

  async login(loginData: LoginData): Promise<ApiResponse<User>> {
    const response = await apiCall<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    if (response.success && response.data) {
      storage.setUserData(response.data);
    }

    return response;
  },

  async getProfile(userId: string): Promise<ApiResponse<User>> {
    return apiCall<User>(`/auth/profile/${userId}`);
  },

  logout() {
    storage.clearUserData();
  },

  getCurrentUser(): User | null {
    return storage.getUserData();
  },

  getCurrentUserId(): string | null {
    return storage.getUserId();
  },

  isAuthenticated(): boolean {
    return storage.getUserId() !== null;
  }
};

// Booking API functions
export const bookingsAPI = {
  async createBooking(bookingData: Partial<BookingDetails>): Promise<ApiResponse<{ booking_id: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ booking_id: string }>(`/bookings?user_id=${userId}`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<Booking[]>(`/bookings?user_id=${userId}`);
  },

  async getBookingDetails(bookingId: string): Promise<ApiResponse<BookingDetails>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<BookingDetails>(`/bookings/${bookingId}`, {
      headers: { 'X-User-ID': userId },
    });
  },

  async updateBookingStatus(bookingId: string, status: string): Promise<ApiResponse<{ message: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ message: string }>(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'X-User-ID': userId },
      body: JSON.stringify({ status }),
    });
  },

  async generatePDF(bookingId: string): Promise<ApiResponse<{ pdf_url: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ pdf_url: string }>(`/bookings/${bookingId}/generate-pdf`, {
      method: 'POST',
      headers: { 'X-User-ID': userId },
    });
  },

  // Send email with user_id (for create booking scenario)
  async sendBookingEmailWithUserId(bookingId: string): Promise<ApiResponse<{ message: string; recipients: string[]; message_id: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ message: string; recipients: string[]; message_id: string }>(`/bookings/${bookingId}/send-booking-email`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  // Send email with specific recipients (for booking details scenario)
  async sendBookingEmailWithRecipients(bookingId: string, emailRecipients: string[]): Promise<ApiResponse<{ message: string; recipients: string[]; message_id: string }>> {
    return apiCall<{ message: string; recipients: string[]; message_id: string }>(`/bookings/${bookingId}/send-booking-email`, {
      method: 'POST',
      body: JSON.stringify({ email_recipients: emailRecipients }),
    });
  },

  // Legacy function for backward compatibility
  async sendEmail(bookingId: string): Promise<ApiResponse<{ message: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ message: string }>(`/bookings/${bookingId}/send-email`, {
      method: 'POST',
      headers: { 'X-User-ID': userId },
    });
  }
};

// Sales Rep Inbox API functions
export const salesRepAPI = {
  async getInboxItems(): Promise<ApiResponse<SalesRepInboxItem[]>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<SalesRepInboxItem[]>(`/sales-rep-inbox?user_id=${userId}`);
  },

  async updateRepStatus(inboxId: string, repStatus: string): Promise<ApiResponse<{ message: string }>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<{ message: string }>(`/sales-rep-inbox/${inboxId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        rep_status: repStatus,
        user_id: userId 
      }),
    });
  }
};

// Reports API functions
export const reportsAPI = {
  async getReports(): Promise<ApiResponse<ReportsData>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<ReportsData>(`/reports?user_id=${userId}`);
  }
};

// Settings API functions
export const settingsAPI = {
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<UserSettings>(`/settings?user_id=${userId}`);
  },

  async updateSettings(emailRecipients: string[]): Promise<ApiResponse<UserSettings>> {
    const userId = storage.getUserId();
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    return apiCall<UserSettings>(`/settings?user_id=${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ email_recipients: emailRecipients }),
    });
  }
};

// AI API functions
export const aiAPI = {
  async extractBookingData(text: string): Promise<ApiResponse<any>> {
    return apiCall<any>('/ai/extract-booking-data', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async extractBookingDataFromPdf(pdfUrl: string): Promise<ApiResponse<any>> {
    return apiCall<any>('/extract-booking-data', {
      method: 'POST',
      body: JSON.stringify({ pdfUrl }),
    });
  }
};

// Health check API function
export const healthAPI = {
  async checkHealth(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return apiCall<{ message: string; timestamp: string }>('/health');
  }
};

// General API functions that include user ID
export const api = {
  async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const userId = storage.getUserId();
    
    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    return apiCall<T>(endpoint, {
      ...options,
      headers: {
        'X-User-ID': userId,
        ...options.headers,
      },
    });
  }
};