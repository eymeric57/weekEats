import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {API_ROOT, API_URL} from '../../constants/apiConstants';
import {useAuthContext} from '../../contexts/AuthContext';
import {fetchUserDetail} from '../../redux/user/UserSlice';
import {selectUserData} from '../../redux/user/UserSelector';
import MealsByDay from '../../components/MealsByDay';

const TIME_PERIODS = [
  {id: '1', title: 'Matin'},
  {id: '2', title: 'Midi'},
  {id: '3', title: 'Soir'},
];

const MealPlannerScreen = () => {
  const [selectedTime, setSelectedTime] = useState(TIME_PERIODS[0]);
  const [mealName, setMealName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();
  const {user} = useAuthContext();
  const userId = user.id;
  const dispatch = useDispatch();

  const date = route.params?.date || route.params?.item?.date || new Date();
  const selectedDate = new Date(date);

  const dayName = selectedDate.toLocaleDateString('fr-FR', {weekday: 'long'});
  const {userDetail} = useSelector(selectUserData);

  const fetchMealById = async mealId => {
    try {
      const response = await fetch(`${API_ROOT}${mealId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la recherche du plat:', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!mealName) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du plat.');
      setIsLoading(false);
      return;
    }

    try {
      const formattedDate = new Date(selectedDate).toLocaleDateString('fr-CA', {
        timeZone: 'Europe/Paris',
      });

      let planningFound = null;
      let existingMeal = null;

      // 1. Chercher le planning et le repas existant pour cette date et ce type
      if (userDetail && userDetail.plannings) {
        // Trouver le planning pour la date
        planningFound = userDetail.plannings.find(
          planning => planning.date.slice(0, 10) === formattedDate,
        );

        if (planningFound) {
          // Chercher un repas existant du même type
          for (const mealId of planningFound.meals) {
            const mealData = await fetchMealById(mealId);
            if (
              mealData.type.labeltype.toLowerCase() ===
              selectedTime.title.toLowerCase()
            ) {
              existingMeal = mealData;
              break;
            }
          }
        }
      }

      // 2. Traiter selon les cas
      if (!planningFound) {
        // Cas 3: Pas de planning → Créer planning + repas
        console.log('Création nouveau planning et repas');
        const newPlanning = await axios.post(`${API_URL}/plannings`, {
          date: formattedDate,
          user: `/api/users/${userId}`,
        });

        await axios.post(`${API_URL}/meals`, {
          label: mealName,
          type: `/api/types/${selectedTime.id}`,
          planning: `/api/plannings/${newPlanning.data.id}`,
        });
        Alert.alert('Succès', 'Nouveau planning et repas ajoutés');
      } else if (existingMeal) {
        // Cas 1: Planning existe + même type → Ajouter au repas existant
        console.log('Ajout au repas existant');
        await axios.put(`${API_URL}/meals/${existingMeal.id}`, {
          label: `${existingMeal.label}, ${mealName}`,
          type: `/api/types/${selectedTime.id}`,
          planning: `/api/plannings/${planningFound.id}`,
        });
        Alert.alert('Succès', 'Repas ajouté au menu existant');
      } else {
        // Cas 2: Planning existe + type différent → Créer nouveau repas
        console.log('Création nouveau repas dans planning existant');
        await axios.post(`${API_URL}/meals`, {
          label: mealName,
          type: `/api/types/${selectedTime.id}`,
          planning: `/api/plannings/${planningFound.id}`,
        });
        Alert.alert('Succès', 'Nouveau repas ajouté au planning');
      }

      // Rafraîchir les données et réinitialiser le formulaire
      dispatch(fetchUserDetail(userId));
      setMealName('');
      setSelectedTime(TIME_PERIODS[0]);
    } catch (error) {
      console.error('Error:', error.response?.data);
      Alert.alert('Erreur', "Erreur lors de l'ajout du repas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 16,
      }}>
      <View style={{width: '100%'}}>
        <Text
          style={{
            color: '#639067',
            fontSize: 21,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 32,
          }}>
          {dayName +
            ' ' +
            selectedDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
            })}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 24,
          }}>
          {TIME_PERIODS.map(period => (
            <TimeButton
              key={period.id}
              id={period.id}
              title={period.title}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          ))}
        </View>

        <Text
          style={{
            color: '#d9d9d9',
            fontSize: 10,
            textAlign: 'center',
            marginBottom: 16,
          }}>
          Sélectionner le moment de la journée
        </Text>

        <View
          style={{
            width: '100%',
            height: 49,
            backgroundColor: '#efefef',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
          <TextInput
            placeholder="Entrez votre plat ici !"
            placeholderTextColor="#a7a5a5"
            style={{
              color: 'black',
              fontSize: 15,
              textAlign: 'center',
              width: '100%',
            }}
            value={mealName}
            onChangeText={setMealName}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="small" color="#639067" />
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              width: 86,
              height: 86,
              backgroundColor: '#639067',
              borderRadius: 43,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginBottom: 24,
            }}>
            <Text style={{color: '#efefef', fontSize: 18}}>Ajouter</Text>
          </TouchableOpacity>
        )}
      </View>

      <MealsByDay date={selectedDate} />
    </View>
  );
};

const TimeButton = ({id, title, selectedTime, setSelectedTime}) => (
  <TouchableOpacity
    style={{
      width: 90,
      height: 22,
      backgroundColor: selectedTime.id === id ? '#1d9913' : '#efefef',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    }}
    onPress={() => setSelectedTime({id, title})}>
    <Text style={{color: 'black', fontSize: 15}}>{title}</Text>
  </TouchableOpacity>
);

export default MealPlannerScreen;
