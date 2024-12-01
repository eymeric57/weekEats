import axios from 'axios';
import {API_URL} from '../constants/apiConstants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/ld+json',
  },
});

export const mealService = {
  create: async mealData => {
    const response = await api.post('/meals', mealData);
    return response.data;
  },

  update: async (id, updateData) => {
    const response = await api.patch(`/meals/${id}`, updateData, {
      headers: {'Content-Type': 'application/merge-patch+json'},
    });
    return response.data;
  },

  delete: async id => {
    await api.delete(`/meals/${id}`);
  },

  getById: async id => {
    const response = await api.get(`/meals/${id}`);
    return response.data;
  },
};

export const planningService = {
  create: async planningData => {
    const response = await api.post('/plannings', planningData);
    return response.data;
  },

  update: async (id, updateData) => {
    const response = await api.patch(`/plannings/${id}`, updateData, {
      headers: {'Content-Type': 'application/merge-patch+json'},
    });
    return response.data;
  },

  delete: async id => {
    await api.delete(`/plannings/${id}`);
  },

  getByUser: async userId => {
    const response = await api.get('/plannings', {
      params: {
        user: `/api/users/${userId}`, // Selon la configuration de ton API
      },
    });
    return response.data;
  },

  getById: async id => {
    const response = await api.get(`/plannings/${id}`);
    return response.data;
  },
};

export const typeService = {
  getById: async id => {
    const response = await api.get(`/types/${id}`);
    return response.data;
  },
};

export const userService = {
  getById: async id => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
