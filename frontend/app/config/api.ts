// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const API_ENDPOINTS = {
  appointments: `${API_BASE_URL}/api/appointments`,
  health: `${API_BASE_URL}/api/health`,
  doctors: `${API_BASE_URL}/api/doctors`,
  patients: `${API_BASE_URL}/api/patients`,
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('Starting API health check...');
    console.log('Health check URL:', API_ENDPOINTS.health);
    
    const response = await fetch(API_ENDPOINTS.health, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    console.log('Health check response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Health check failed:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Health check response:', data);
    
    return data.status === 'ok';
  } catch (error) {
    console.error('Health check error:', error);
    return false;
  }
};
