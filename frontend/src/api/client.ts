// src/api/client.ts
import axios from 'axios';

// Usamos la variable de entorno que definimos en Docker Compose
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  // La sesión viaja en una cookie httpOnly seteada por el backend; el navegador
  // la adjunta solo si withCredentials está activo (necesario cross-port en dev).
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
