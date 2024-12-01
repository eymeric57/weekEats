import {useCallback} from 'react';
import axios from 'axios';
import {API_URL} from '../constants/apiConstants';

export const useFetchTypeDetails = () => {
  return useCallback(async typeIds => {
    if (!typeIds?.length) return [];

    try {
      const responses = await Promise.all(
        typeIds.map(async id => {
          try {
            const response = await axios.get(`${API_URL}/types/${id}`);
            return response.data.label;
          } catch (error) {
            console.error(`Erreur pour le type ${id}:`, error);
            return null;
          }
        }),
      );

      return responses.filter(Boolean); // Filtre les nulls
    } catch (error) {
      console.error(
        'Erreur générale lors de la récupération des types:',
        error,
      );
      return [];
    }
  }, []);
};
