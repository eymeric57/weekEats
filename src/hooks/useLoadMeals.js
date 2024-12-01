// hooks/useLoadMeals.js
import {useCallback} from 'react';
import {useFetchMealDetails} from './useFetchMealDetails';
import {useFetchTypeDetails} from './useFetchTypeDetails';

export const useLoadMeals = () => {
  const fetchMealDetails = useFetchMealDetails();
  const fetchTypeDetails = useFetchTypeDetails();

  return useCallback(
    async plannings => {
      if (!plannings?.length) return {matin: [], midi: [], soir: []};

      const dayData = {
        matin: [],
        midi: [],
        soir: [],
      };

      for (const planning of plannings) {
        // Vérifier que le planning a des repas
        if (!planning.meals?.length) continue;

        const mealIds = planning.meals.map(meal => meal.split('/').pop());
        const typeIds = planning.types.map(type => type.split('/').pop());

        try {
          // Récupérer les données des repas et des types
          const [mealDetails, typeLabels] = await Promise.all([
            fetchMealDetails(mealIds),
            fetchTypeDetails(typeIds),
          ]);

          // Vérifier que nous avons bien reçu les données
          if (!mealDetails || !typeLabels) continue;

          console.log('Fetched data:', {mealDetails, typeLabels});

          // Pour chaque type, ajouter le repas correspondant à la bonne période
          typeLabels.forEach((type, index) => {
            const meal = mealDetails[index];

            // Vérifier que nous avons à la fois le type et le repas
            if (!type || !meal?.id || !meal?.label) {
              console.log('Invalid meal or type:', {type, meal});
              return;
            }

            const typeLabel = type.toLowerCase();

            if (typeLabel.includes('matin')) {
              if (!dayData.matin.find(m => m.id === meal.id)) {
                dayData.matin.push(meal);
              }
            } else if (typeLabel.includes('midi')) {
              if (!dayData.midi.find(m => m.id === meal.id)) {
                dayData.midi.push(meal);
              }
            } else if (typeLabel.includes('soir')) {
              if (!dayData.soir.find(m => m.id === meal.id)) {
                dayData.soir.push(meal);
              }
            }
          });
        } catch (error) {
          console.error('Error processing planning:', error);
        }
      }

      console.log('Final dayData:', dayData);
      return dayData;
    },
    [fetchMealDetails, fetchTypeDetails],
  );
};
