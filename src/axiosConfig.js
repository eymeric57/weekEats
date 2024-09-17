// src/utils/axiosConfig.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ROOT } from './constants/apiConstants'; // Ajustez le chemin si nécessaire

// Créez une instance Axios avec l'URL de base
const api = axios.create({
  baseURL: API_ROOT,
});

// Ajoutez l'intercepteur de requête
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optionnel : Ajoutez un intercepteur de réponse pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Gérez ici l'expiration du token ou les erreurs d'authentification
      // Par exemple, déconnectez l'utilisateur ou rafraîchissez le token
      await AsyncStorage.removeItem('userToken');
      // Redirigez vers l'écran de connexion si nécessaire
    }
    return Promise.reject(error);
  }
);

export default api;