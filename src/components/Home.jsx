import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import {selectPlanningData} from '../redux/planing/PlaningSelector';
import {selectUserData} from '../redux/user/UserSelector';
import {API_ROOT, API_URL} from '../constants/apiConstants';

export const Home = ({userDetail}) => {
  const {planningDetail, loading, error} = useSelector(selectPlanningData);
  const [mealsData, setMealsData] = useState([]); // Utilisation de useState pour gérer les repas

  console.log('userDetail ici', userDetail);
  const date = new Date().toISOString().slice(0, 10);

  const fetchMealById = async mealId => {
    try {
      const response = await fetch(`${API_ROOT}${mealId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche du plat:', error);
    }
  };

  // Utilisation de useEffect pour gérer l'appel API au montage du composant
  useEffect(() => {
    const fetchMeals = async () => {
      if (userDetail && userDetail.plannings) {
        const todayPlanning = userDetail.plannings.find(
          planning => planning.date.slice(0, 10) === date,
        );

        console.log('todayPlanning', todayPlanning);

        if (todayPlanning) {
          const meals = [];
          for (const mealId of todayPlanning.meals) {
            const mealData = await fetchMealById(mealId); // Attente de la réponse
            meals.push(mealData); // Ajout des données dans le tableau
          }

          setMealsData(meals); // Mettre à jour l'état avec les données des repas
        }
      }
    };

    fetchMeals();
  }, [userDetail]); // L'appel API se déclenche quand userDetail change

  // Vérifier si le planning existe et est chargé
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Une erreur est survenue lors du chargement
        </Text>
      </View>
    );
  }

  // Définir les repas du matin, midi, et soir
  let mealMatin = '';
  let mealMidi = '';
  let mealSoir = '';

  if (mealsData.length > 0) {
    const morningMeal = mealsData.find(meal => meal.type.labeltype === 'matin');
    const lunchMeal = mealsData.find(meal => meal.type.labeltype === 'midi');
    const dinnerMeal = mealsData.find(meal => meal.type.labeltype === 'soir');

    if (morningMeal) mealMatin = morningMeal.label;
    if (lunchMeal) mealMidi = lunchMeal.label;
    if (dinnerMeal) mealSoir = dinnerMeal.label;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.centerContainer}>
          <View style={styles.monthContainer}>
            <View style={styles.monthPadding} />
            <View style={styles.monthTextContainer}>
              <Text style={styles.monthText}>Aujourd'hui</Text>
            </View>
            <View style={styles.monthPadding} />
          </View>
        </View>

        {/* Carte pour le repas du matin */}
        <View style={styles.cardContainer}>
          <Text style={styles.mealTitle}>Repas du Matin</Text>
          <View style={styles.mealCard}>
            <Text style={styles.mealText}>
              {mealMatin || 'Aucun repas prévu'}
            </Text>
          </View>
        </View>

        {/* Carte pour le repas du midi */}
        <View style={styles.cardContainer}>
          <Text style={styles.mealTitle}>Repas du Midi</Text>
          <View style={styles.mealCard}>
            <Text style={styles.mealText}>
              {mealMidi || 'Aucun repas prévu'}
            </Text>
          </View>
        </View>

        {/* Carte pour le repas du soir */}
        <View style={styles.cardContainer}>
          <Text style={styles.mealTitle}>Repas du Soir</Text>
          <View style={styles.mealCard}>
            <Text style={styles.mealText}>
              {mealSoir || 'Aucun repas prévu'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  monthContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#639067',
    borderRadius: 40,
    paddingVertical: 3,
    width: '70%',
    marginHorizontal: '15%', // Ajout d'espace à gauche et à droite
  },
  monthTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 9,
  },
  monthPadding: {
    width: 24,
    padding: 9,
  },
  monthText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1, // Espacement des lettres pour un effet plus élégant
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#639067',
    marginBottom: 10,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal: 15, // Ajout du padding gauche/droite pour espacer du bord
  },
  mealText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#639067',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default Home;
