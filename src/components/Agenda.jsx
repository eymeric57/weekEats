import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';

// Configuration de la locale française
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

const AutoGeneratedAgenda = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params || {};
  const [items, setItems] = useState({});

  const loadItems = useCallback(day => {
    const newItems = {};
    for (let i = -15; i < 85; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const strTime = timeToString(time);

      if (!newItems[strTime]) {
        newItems[strTime] = [
          {
            name: 'Pas de repas prévue !',
            timestamp: time, // Ajout du timestamp pour l'affichage
          },
        ];
      }
    }
    setItems(newItems);
  }, []);

  const renderItem = item => {
    const date = new Date(item.timestamp); // Obtenir la date à partir de l'élément
    const dayNumber = date.getDate(); // Obtenir le numéro du jour
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }); // Obtenir le nom du jour en français

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('MealPlannerScreen', { userId: userId, date: date.toISOString() })
        }>
        <View style={styles.item}>
          <View style={styles.row}>
         
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyDate = () => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('MealPlannerScreen', { userId: userId })
        }>
        <View style={styles.emptyDate}>
          <Text style={styles.emptyDateText}></Text>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    loadItems({ timestamp: Date.now() });
  }, [loadItems]);

  // Obtenir la date actuelle pour minDate
  const today = new Date();

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={(r1, r2) => r1.name !== r2.name}
      showClosingKnob={true}
      pastScrollRange={50}
      futureScrollRange={50}
      hideKnob={true}
      minDate={today.toISOString().split('T')[0]} // Définir la date minimale
      theme={{
        agendaDayNumColor: '#639067',
        agendaDayTextColor: '#639067',
        agendaTodayColor: '#639067',
        agendaKnobColor: '#4ac4f7',
        agendaDayBackgroundColor: '#f1f3f4',
        agendaDayHeaderRightBorderColor: '#dadce0',
        agendaDayHeaderRightBorderWidth: 1,
      }}
    />
  );
};

const timeToString = time => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  row: {
    flexDirection: 'row', // Alignement horizontal
    alignItems: 'center', // Centrer verticalement tous les éléments
  },
  dateContainer: {
    marginRight: 10, // Espace entre la date et le texte
   flexDirection:'column' // Alignement vertical pour numéro et nom du jour
   },
   itemTextContainer:{
     flexDirection:'row', 
     alignItems:'center'
   },
   itemText:{
     color:'#888', 
     fontSize:19 
   },
   dayNumber:{
     fontSize:24, // Ajuster la taille si nécessaire
     fontWeight:'bold', 
     color:'#639067' // Changer la couleur si nécessaire
   },
   dayName:{
     fontSize:16, // Ajuster la taille si nécessaire
     color:'#888' 
   },
   emptyDate:{
     height:15,
     flex:1,
     paddingTop:30 
   },
});

export default AutoGeneratedAgenda;