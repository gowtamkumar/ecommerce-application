import axios from 'axios';

// Replace with your machine's IP address if running on a physical device
// For Android Emulator, use 'http://10.0.2.2:3900'
// For iOS Simulator, use 'http://localhost:3900'
export const BASE_URL = 'http://10.0.2.2:3900/api/v1'; 

const client = axios.create({
  baseURL: BASE_URL,
});

export default client;
