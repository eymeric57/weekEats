import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import {PanGestureHandler, RefreshControl} from 'react-native-gesture-handler';
import {selectPlanningData} from '../redux/planing/PlaningSelector';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {API_URL} from '../constants/apiConstants';


//TODO: faire les loaders
const AutoGeneratedCalendar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userId} = route.params || {};
  const {planningDetail} = useSelector(selectPlanningData);
  const [items, setItems] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [gestureHandled, setGestureHandled] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const itemsArray = Object.entries(items);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    loadItems(currentDate);
  }, [loadItems, currentDate]);

  const loadItems = useCallback(
    async date => {
    
      const newItems = {};
      const startDate = new Date(date);
      for (let i = 0; i < 8; i++) {
        const time = startDate.getTime() + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        newItems[strTime] = {
          mealsByTimeOfDay: {
            matin: [],
            midi: [],
            soir: [],
          },
          id: null, // Initialiser avec null
          name: 'Pas de repas prévu', // Nom par défaut
        };

        for (const planning of planningDetail['hydra:member']) {
          if (isSameDay(new Date(strTime), new Date(planning.date))) {
            const typeIds = planning.types.map(type => type.split('/').pop());
            const mealIds = planning.meals.map(meal => meal.split('/').pop());

            const typeLabels = await fetchTypeDetails(typeIds);
            const mealLabelsFetched = await fetchMealDetails(mealIds);

            typeLabels.forEach((type, index) => {
              if (type.toLowerCase().includes('matin')) {
                newItems[strTime].mealsByTimeOfDay.matin.push(
                  mealLabelsFetched[index],
                );
              } else if (type.toLowerCase().includes('midi')) {
                newItems[strTime].mealsByTimeOfDay.midi.push(
                  mealLabelsFetched[index],
                );
              } else if (type.toLowerCase().includes('soir')) {
                newItems[strTime].mealsByTimeOfDay.soir.push(
                  mealLabelsFetched[index],
                );
              }
            });

            newItems[strTime].id = planning.id; // Assigner l'ID ici
            newItems[strTime].name = 'Repas prévu'; // Changer le nom si des repas sont prévus
          }
        }
      }

      setItems(newItems);
      console.log('Items remplis', newItems);
    },
    [planningDetail],
  );

  const changeDays = increment => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + increment * 8);
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 7);
    return `${formatDateMonth(startDate)} - ${formatDateDay(endDate)}`;
  };

  const timeToString = time => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = {weekday: 'short', day: 'numeric'};
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatDateMonth = date => {
    const options = {day: 'numeric', month: 'short'};
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatDateDay = dateDay => {
    const options = {day: 'numeric', month: 'short'};
    return dateDay.toLocaleDateString('fr-FR', options);
  };

  const fetchTypeDetails = async ids => {
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

  const fetchMealDetails = async ids => {
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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
 
  //--------------- Gestes de balayage-------------

  const handleGestureEvent = ({ nativeEvent }) => {
    if (!gestureHandled) {
      // Vérifiez si le geste est principalement horizontal
      if (Math.abs(nativeEvent.translationX) > Math.abs(nativeEvent.translationY)) {
        if (nativeEvent.translationX > 50) {
          changeDays(-1); // Balayage vers la droite
          setGestureHandled(true);
        } else if (nativeEvent.translationX < -50) {
          changeDays(1); // Balayage vers la gauche
          setGestureHandled(true);
        }
      } else { // Geste principalement vertical
        if (nativeEvent.translationY > 50) {
          onRefresh(); // Rafraîchissement vers le bas
          setGestureHandled(true);
        }
      }
    }
  };

  const handleGestureEnd = ({nativeEvent}) => {
    // Si le geste est terminé (ex: STATE.END), on réinitialise le blocage
    if (nativeEvent.state === 5) {
      // 5 correspond à "State.END" dans react-native-gesture-handler
      setGestureHandled(false); // Réinitialise l'état après la fin du geste
    }
  };

 
  const renderItem = (item, date) => {
    const noMealPlanned =
      !item.mealsByTimeOfDay.matin.length &&
      !item.mealsByTimeOfDay.midi.length &&
      !item.mealsByTimeOfDay.soir.length;
    return (
      <Pressable
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('MealPlannerScreen', {userId, date})
        }>
        {noMealPlanned ? (
          <View style={styles.item}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text style={styles.itemText}></Text>
            <View style={styles.border} />
            <Text style={styles.timeText}>Pas de repas prévu</Text>
            <View style={styles.border} />
            <Text style={styles.timeText}></Text>
          </View>
        ) : (
          <View style={styles.item}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text style={styles.itemText}>
              {item.mealsByTimeOfDay.matin.join(', ')}
            </Text>
            <View style={styles.border} />
            <Text style={styles.timeText}>
              {item.mealsByTimeOfDay.midi.join(', ')}
            </Text>
            <View style={styles.border} />
            <Text style={styles.timeText}>
              {item.mealsByTimeOfDay.soir.join(', ')}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };
 const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const today = new Date();
      setCurrentDate(today);
      loadItems(today);
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <PanGestureHandler
    onGestureEvent={handleGestureEvent}
    onHandlerStateChange={handleGestureEnd}

  >
    <View style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing}  />
        }
      >
        <Text className="font-kaushan text-3xl text-[#639067] text-center p-5">
          Calendrier
        </Text>
        <View style={styles.centerContainer}>
          <View style={styles.monthContainer}>
            <TouchableOpacity
              onPress={() => changeDays(-1)}
              style={styles.monthButton}
            >
              <Icon name="triangle-left" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.monthTextContainer}>
              <Text style={styles.monthText}>{formatDateRange()}</Text>
            </View>
            <TouchableOpacity
              onPress={() => changeDays(1)}
              style={styles.monthButton}
            >
              <Icon name="triangle-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
  
        <View style={styles.grid}>
          {itemsArray.map(([dateKey, dateItems]) => (
            <View key={dateKey} style={styles.column}>
              {renderItem(dateItems, dateKey)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  </PanGestureHandler>
  
  );
};
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  monthContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#639067',
    borderRadius: 40,
    paddingHorizontal: 2,
    paddingVertical: 3,
    width: '65%',
  },
  monthTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthButton: {
    padding: 9,
  },
  border: {
    width: '80%',
    alignSelf: 'center',
    height: 2,
    backgroundColor: '#639067',
    marginTop: 5,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  column: {
    width: '50%',
    paddingHorizontal: 10,
  },
  cardContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  item: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexGrow: 1,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#639067',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#639067',
    marginBottom: 5,
    position: 'absolute',
    top: -20,
    left: 40,
  },

  itemText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    flexWrap: 'wrap', // Permet au texte de passer à la ligne
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    marginVertical: 5,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  centerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#639067',
    marginBottom: 10,
  },
};

export default AutoGeneratedCalendar;
