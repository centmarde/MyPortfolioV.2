import axios from 'axios';
import { CertificateItem } from '@/components/common/Certs';

// Create an axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AchievementsData {
  topAwards: CertificateItem[];
  certificates: CertificateItem[];
}

// Function to get achievements data
export const getAchievements = async (): Promise<AchievementsData> => {
  try {
    // In a real application, this would be a call to a real API endpoint
    // For now, we'll simulate by directly fetching the JSON file
    const response = await axios.get('/data/achievements.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching achievements:', error);
    throw error; // Re-throw the error to ensure the function always returns a value
  }
};

export default api;
