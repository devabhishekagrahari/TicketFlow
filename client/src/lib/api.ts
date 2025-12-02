const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: 'Network error. Please try again.' };
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }) {
    return this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me');
  }

  // Buses
  async getBuses() {
    return this.request<any[]>('/api/buses');
  }

  async getBusById(id: number) {
    return this.request<any>(`/api/buses/${id}`);
  }

  async createBus(busData: any) {
    return this.request<any>('/api/buses', {
      method: 'POST',
      body: JSON.stringify(busData),
    });
  }

  async updateBus(id: number, updates: any) {
    return this.request<any>(`/api/buses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteBus(id: number) {
    return this.request<any>(`/api/buses/${id}`, {
      method: 'DELETE',
    });
  }

  // Routes
  async searchRoutes(source: string, destination: string, date?: string) {
    const params = new URLSearchParams({ source, destination });
    if (date) params.append('date', date);
    return this.request<any[]>(`/api/routes/search?${params}`);
  }

  async getAllRoutes() {
    return this.request<any[]>('/api/routes');
  }

  async getRouteById(id: number) {
    return this.request<any>(`/api/routes/${id}`);
  }

  async createRoute(routeData: any) {
    return this.request<any>('/api/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  }

  async updateRoute(id: number, updates: any) {
    return this.request<any>(`/api/routes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteRoute(id: number) {
    return this.request<any>(`/api/routes/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async createBooking(bookingData: any) {
    return this.request<any>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings() {
    return this.request<any[]>('/api/bookings/my');
  }

  async getBookingById(id: number) {
    return this.request<any>(`/api/bookings/${id}`);
  }

  async cancelBooking(id: number) {
    return this.request<any>(`/api/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Agents
  async getAllAgents() {
    return this.request<any[]>('/api/agents');
  }

  async getAgentDashboard() {
    return this.request<any>('/api/agents/dashboard');
  }

  async createAgentProfile(commissionRate: string) {
    return this.request<any>('/api/agents', {
      method: 'POST',
      body: JSON.stringify({ commissionRate }),
    });
  }

  async approveAgent(id: number) {
    return this.request<any>(`/api/agents/${id}/approve`, {
      method: 'PATCH',
    });
  }

  async updateAgentCommission(id: number, commissionRate: string) {
    return this.request<any>(`/api/agents/${id}/commission`, {
      method: 'PATCH',
      body: JSON.stringify({ commissionRate }),
    });
  }

  // Auth helpers
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  removeAuthToken() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const api = new ApiClient();
