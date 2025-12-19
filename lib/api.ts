// API Helper for Static Export
// This file handles API calls to PHP backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mabrur-ai.id/api-php';

export const apiClient = {
  // Generic fetch wrapper
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth APIs
  auth: {
    async login(email: string, password: string) {
      return apiClient.fetch('/auth/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  },

  // Jamaah APIs
  jamaah: {
    async verify(token: string) {
      return apiClient.fetch('/jamaah/verify.php', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },

    async getStatus(token: string) {
      return apiClient.fetch(`/jamaah/status.php?token=${token}`, {
        method: 'GET',
      });
    },
  },

  // Content APIs
  content: {
    async getManasik() {
      return apiClient.fetch('/content/manasik.php', {
        method: 'GET',
      });
    },

    async chatbot(message: string) {
      return apiClient.fetch('/content/chatbot.php', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  },
};

export default apiClient;
