import client from './client';

export const getHome = async () => {
  try {
    const response = await client.get('/home');
    return response.data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};
