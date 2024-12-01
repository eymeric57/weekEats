import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserData} from '../redux/user/UserSelector';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from './loader/Loader';
import {API_ROOT, API_URL} from '../constants/apiConstants';
import {deleteMeal, fetchPlanningDetail} from '../redux/planing/PlaningSlice';
import {fetchUserDetail} from '../redux/user/UserSlice';

const MealsByDay = ({date}) => {
  const {userDetail} = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [mealsData, setMealsData] = useState({matin: [], midi: [], soir: []});
  const [isLoading, setIsLoading] = useState(true);

  const fetchMealById = async mealId => {
    try {
      const response = await fetch(`${API_ROOT}${mealId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche du plat:', error);
      return null;
    }
  };

  useEffect(() => {
    const getMealsForDay = async () => {
      try {
        if (!userDetail?.plannings) {
          console.log('MealsByDay - Pas de plannings');
          setMealsData({matin: [], midi: [], soir: []});
          return;
        }

        const formattedDate = new Date(date)
          .toISOString()
          .replace('.000Z', '+00:00');
        console.log('MealsByDay - formattedDate:', formattedDate);

        const planning = userDetail.plannings.find(
          p => p.date === formattedDate,
        );
        console.log('MealsByDay - planning trouvé:', planning);

        if (!planning?.meals) {
          console.log('MealsByDay - Pas de meals dans le planning');
          setMealsData({matin: [], midi: [], soir: []});
          return;
        }

        // Récupérer tous les repas en parallèle
        const mealsPromises = planning.meals.map(mealId =>
          fetchMealById(mealId),
        );
        const mealsDetails = await Promise.all(mealsPromises);
        console.log('MealsByDay - détails des repas:', mealsDetails);

        // Organiser les repas par moment de la journée
        const organizedMeals = {matin: [], midi: [], soir: []};
        mealsDetails.forEach(meal => {
          if (meal?.type?.labeltype && meal?.label) {
            const timeOfDay = meal.type.labeltype.toLowerCase();
            if (timeOfDay.includes('matin')) {
              organizedMeals.matin.push(meal);
            } else if (timeOfDay.includes('midi')) {
              organizedMeals.midi.push(meal);
            } else if (timeOfDay.includes('soir')) {
              organizedMeals.soir.push(meal);
            }
          }
        });

        console.log('MealsByDay - repas organisés:', organizedMeals);
        setMealsData(organizedMeals);
      } catch (error) {
        console.error('Erreur lors de la récupération des repas:', error);
        Alert.alert('Erreur', 'Impossible de charger les repas');
      } finally {
        setIsLoading(false);
      }
    };

    getMealsForDay();
  }, [date, userDetail]);

  const handleDeleteMeal = async (timeOfDay, meal) => {
    try {
      const response = await fetch(`${API_URL}/meals/${meal.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      Alert.alert('Succès', 'Repas supprimé avec succès');

      // Mettre à jour les données localement
      setMealsData(prev => ({
        ...prev,
        [timeOfDay]: prev[timeOfDay].filter(m => m.id !== meal.id),
      }));

      if (userDetail?.id) {
        dispatch(fetchUserDetail(userDetail.id));
      }
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        stack: error.stack,
      });
      Alert.alert('Erreur', `Erreur de suppression: ${error.message}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.mainContainer}>
      {Object.values(mealsData).every(meals => meals.length === 0) ? (
        <Text style={styles.noMealsText}>Pas de repas prévu</Text>
      ) : (
        <View style={styles.container}>
          {['matin', 'midi', 'soir'].map(timeOfDay => (
            <View key={timeOfDay} style={styles.mealSection}>
              <Text style={styles.mealTitle}>
                {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
              </Text>
              {mealsData[timeOfDay]?.map(meal => {
                if (!meal?.id || !meal?.label) return null;

                return (
                  <View key={meal.id} style={styles.mealRow}>
                    <Text style={styles.mealText}>{meal.label}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteMeal(timeOfDay, meal)}
                      style={styles.deleteButton}>
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  noMealsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
    padding: 15,
  },
  mealSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#639067',
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  mealText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
});

export default MealsByDay;
