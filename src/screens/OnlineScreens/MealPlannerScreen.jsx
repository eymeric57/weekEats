import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator} from 'react-native';
import {API_ROOT, API_URL} from '../../constants/apiConstants';
import {useAuthContext} from '../../contexts/AuthContext';

const TIME_PERIODS = [
  {id: 1, title: 'Matin'},
  {id: 2, title: 'Midi'},
  {id: 3, title: 'Soir'},
];

const MEAL_TYPES = [
  {id: 1, title: 'Entrée'},
  {id: 2, title: 'Plat'},
  {id: 3, title: 'Dessert'},
];

const MealPlannerScreen = () => {
  const [selectedTime, setSelectedTime] = useState(TIME_PERIODS[0]);
  const [selectedMeal, setSelectedMeal] = useState(MEAL_TYPES[0]);
  const [mealName, setMealName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  const {user} = useAuthContext();
  const userId = user.id;

  const date = route.params?.date || new Date();

  // Convertir la date ISO en objet Date
  const selectedDate = new Date(date);

  // Obtenir le nom du jour
  const dayName = selectedDate.toLocaleDateString('fr-FR', {weekday: 'long'});

  const TimeButton = ({id, title}) => (
    <TouchableOpacity
      className={`w-[90px] h-[22px] ${
        selectedTime.id === id ? 'bg-[#1d9913]' : 'bg-[#efefef]'
      } rounded-[25px] justify-center items-center mr-4`}
      onPress={() => setSelectedTime({id, title})}>
      <Text className="text-black text-[15px]">{title}</Text>
    </TouchableOpacity>
  );

  const MealButton = ({id, title}) => (
    <TouchableOpacity
      className={`w-[59px] h-3 ${
        selectedMeal.id === id ? 'bg-[#1d9913]' : 'bg-[#d9d9d9]'
      } rounded-[11px] justify-center items-center ${
        title !== 'Dessert' ? 'mr-[41px]' : ''
      }`}
      onPress={() => setSelectedMeal({id, title})}>
      <Text
        className={`text-[10px] ${
          selectedMeal.id === id ? 'text-white' : 'text-black'
        }`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!mealName) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du plat.');
      return;
    }

    try {
      // 1. Ajouter le repas
      const mealData = {
        label: mealName,
        isActive: true,
        utilisateur: `${API_URL}/users/${userId}`,
        planings: [],
      };

      const mealResponse = await fetch(`${API_URL}/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
        },
        body: JSON.stringify(mealData),
      });

      if (!mealResponse.ok) {
        const errorText = await mealResponse.text();
        console.error("Erreur de l'API lors de l'ajout du repas:", errorText);
        throw new Error(
          `Erreur lors de l'ajout du repas: ${mealResponse.status} ${mealResponse.statusText}`,
        );
      }

      const mealResult = await mealResponse.json();
      const mealId = mealResult['@id'];
      console.log(mealId);
      

      // 2. Ajouter le planning
      const planingData = {
        date: selectedDate.toISOString(),
        note: '',
        utilisateur: `${API_URL}/users/${userId}`,
        types: [`${API_URL}/types/${selectedTime.id}`],
        meals: [mealId],
      };

      try {
        const planingResponse = await fetch(`${API_URL}/planings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/ld+json',
          },
          body: JSON.stringify(planingData),
        });

        if (!planingResponse.ok) {
          throw new Error(
            `Erreur lors de la création du planning: ${planingResponse.statusText}`,
          );
        }

        const planingResult = await planingResponse.json();
        const planingId = planingResult['@id'];

        const updateMealResponse = await fetch(`${API_ROOT}${mealId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
          body: JSON.stringify({
            planings: [planingId],
          }),
          
        });

        if (!updateMealResponse.ok) {
          throw new Error(
            `Erreur lors de la mise à jour du repas: ${updateMealResponse.statusText}`,
          );
        }
      } catch (error) {
        console.error('Erreur:', error.message);
      }
      Alert.alert('Succès', 'Le repas a été ajouté avec succès');
      setIsLoading(false);

      // Réinitialiser les champs après l'enregistrement
      setMealName('');
      setSelectedTime(TIME_PERIODS[0]);
      setSelectedMeal(MEAL_TYPES[0]);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert(
        'Erreur',
        error.message || "Une erreur s'est produite lors de l'ajout du repas",
      );
    }
  };

  return (
  
    <View className="flex-1 bg-white items-center p-4">
      <View className="w-full">
        <Text className="text-[#639067] text-[21px] font-bold text-center mb-8">
          {dayName +
            ' ' +
            selectedDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
            })}
        </Text>

        <View className="flex-row justify-center mb-6">
          {TIME_PERIODS.map(period => (
            <TimeButton key={period.id} id={period.id} title={period.title} />
          ))}
        </View>

        <Text className="text-center text-[#d9d9d9] text-[10px] mb-4">
          Sélectionner le moment de la journée
        </Text>

        <View className="flex-row justify-center mb-6">
          {MEAL_TYPES.map(type => (
            <MealButton key={type.id} id={type.id} title={type.title} />
          ))}
        </View>

        <Text className="text-center text-[#d9d9d9] text-[10px] mb-4">
          Sélectionner le type de plat
        </Text>

        <View className="w-full h-[49px] bg-[#efefef] rounded-[15px] justify-center items-center mb-6">
          <TextInput
            placeholder="Entrez votre plat ici !"
            placeholderTextColor="#a7a5a5"
            className="text-[15px] text-center w-full"
            value={mealName}
            onChangeText={setMealName}
          />
        </View>
       { isLoading ? (
      <ActivityIndicator size="small" color="#639067" />
    ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          className="w-[86px] h-[86px] bg-[#639067] rounded-full justify-center items-center self-center mb-6">
          <Text className="text-[#efefef] text-xl">Ajouter</Text>
        </TouchableOpacity>
)}
      </View>
    </View>
  );
};

export default MealPlannerScreen;
