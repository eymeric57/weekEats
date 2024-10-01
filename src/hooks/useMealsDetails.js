import React from 'react'

const useMealsDetails = (id) => {
 
    // Méthode pour récupérer les détails des repas
    const fetchMealDetails = async (ids) => {
        const labels = [];
        for (const id of ids) {
          try {
            const response = await axios.get(`${API_URL}/meals/${id}`);
            labels.push(response.data.label);
          } catch (error) {
            console.log(`Erreur lors de la récupération du repas ${id}: ${error}`);
          }
        }
        return labels;
      };

        // Fonction pour récupérer les détails des types
        const fetchTypeDetails = async (ids) => {
            const labels = [];
            for (const id of ids) {
              try {
                const response = await axios.get(`${API_URL}/types/${id}`);
                labels.push(response.data.label);
              } catch (error) {
                console.log(`Erreur lors de la récupération du type ${id}: ${error}`);
              }
            }
            return labels;
          };


    return{
        fetchMealDetails,
        fetchTypeDetails
    }
}

export default useMealsDetails