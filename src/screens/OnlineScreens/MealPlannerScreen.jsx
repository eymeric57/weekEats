import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

const MealPlannerScreen = () => {
  const [selectedTime, setSelectedTime] = useState('Matin');
  const [selectedMeal, setSelectedMeal] = useState('Entrée');
  const [mealName, setMealName] = useState('');
  const route = useRoute();
  
  const { userId, date } = route.params || {};
  
  // Convertir la date ISO en objet Date
  const selectedDate = new Date(date);
  
  // Obtenir le nom du jour
  const dayName = selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' });

  const TimeButton = ({ title }) => (
    <TouchableOpacity 
      className={`w-[90px] h-[22px] ${selectedTime === title ? 'bg-[#1d9913]' : 'bg-[#efefef]'} rounded-[25px] justify-center items-center mr-4`}
      onPress={() => setSelectedTime(title)}
    >
      <Text className="text-black text-[15px]">{title}</Text>
    </TouchableOpacity>
  );

  const MealButton = ({ title }) => (
    <TouchableOpacity 
      className={`w-[59px] h-3 ${selectedMeal === title ? 'bg-[#1d9913]' : 'bg-[#d9d9d9]'} rounded-[11px] justify-center items-center ${title !== 'Dessert' ? 'mr-[41px]' : ''}`}
      onPress={() => setSelectedMeal(title)}
    >
      <Text className={`text-[10px] ${selectedMeal === title ? 'text-white' : 'text-black'}`}>{title}</Text>
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    console.log(selectedTime, selectedMeal, mealName);
    // Vous pouvez également ajouter ici la logique pour enregistrer les repas
  };

  return (
    <View className="flex-1 bg-white items-center p-4">
      <View className="w-full">
        <Text className="text-[#639067] text-[21px] font-bold text-center mb-8">{dayName + ' ' + selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long'})} 
        
        </Text>
      
        <View className="flex-row justify-center mb-6">
          <TimeButton title="Matin" />
          <TimeButton title="Midi" />
          <TimeButton title="Soir" />
        </View>

        <Text className="text-center text-[#d9d9d9] text-[10px] mb-4">
          Sélectionner le moment de la journée
        </Text>

        <View className="flex-row justify-center mb-6">
          <MealButton title="Entrée" />
          <MealButton title="Plat" />
          <MealButton title="Dessert" />
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

        <TouchableOpacity onPress={handleSubmit} className="w-[86px] h-[86px] bg-[#639067] rounded-full justify-center items-center self-center mb-6">
          <Text className="text-[#efefef] text-xl">Ajouter</Text>
        </TouchableOpacity>

        {/* Ajoutez ici les éléments pour les repas existants */}
      </View>
    </View>
  );
};

export default MealPlannerScreen;