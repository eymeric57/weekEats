import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import {PanGestureHandler, RefreshControl} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import {selectPlanningData} from '../redux/planing/PlaningSelector';
import {fetchPlanningDetail} from '../redux/planing/PlaningSlice';
import {useFetchMealDetails} from '../hooks/useFetchMealDetails';
import {useFetchTypeDetails} from '../hooks/useFetchTypeDetails';
import {useAuthContext} from '../contexts/AuthContext';
import {fetchUserDetail} from '../redux/user/UserSlice';
import {API_ROOT} from '../constants/apiConstants';

const CalendarRecap = ({userDetail}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useAuthContext();
  const [items, setItems] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [gestureHandled, setGestureHandled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('userDetail de calendar recap', userDetail);

  const loadItems = useCallback(
    async date => {
      console.log('DEBUG - loadItems called with date:', date);
      setIsLoading(true);
      try {
        const startDate = new Date(date);
        const newItems = {};

        // Fonction pour récupérer un repas par son ID
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

        for (let i = 0; i < 8; i++) {
          const currentDate = new Date(
            startDate.getTime() + i * 24 * 60 * 60 * 1000,
          );
          const strTime = timeToString(currentDate);

          const dayData = {
            mealsByTimeOfDay: {matin: [], midi: [], soir: []},
            id: null,
            name: 'Pas de repas prévu',
          };

          if (userDetail && userDetail.plannings) {
            const planningForDay = userDetail.plannings.find(p =>
              isSameDay(new Date(strTime), new Date(p.date)),
            );

            if (planningForDay) {
              dayData.id = planningForDay.id;
              dayData.name = 'Repas prévu';

              // Récupérer les détails de chaque repas
              if (planningForDay.meals && planningForDay.meals.length > 0) {
                const mealPromises = planningForDay.meals.map(mealId =>
                  fetchMealById(mealId),
                );
                const mealsData = await Promise.all(mealPromises);

                // Trier les repas par type
                mealsData.forEach(meal => {
                  if (meal && meal.type && meal.label) {
                    const typeLabel = meal.type.labeltype.toLowerCase();
                    if (typeLabel.includes('matin')) {
                      dayData.mealsByTimeOfDay.matin.push(meal.label);
                    } else if (typeLabel.includes('midi')) {
                      dayData.mealsByTimeOfDay.midi.push(meal.label);
                    } else if (typeLabel.includes('soir')) {
                      dayData.mealsByTimeOfDay.soir.push(meal.label);
                    }
                  }
                });
              }
            }
          }

          newItems[strTime] = dayData;
        }

        setItems(newItems);
      } catch (error) {
        console.error('DEBUG - Error loading items:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userDetail],
  );
  React.useEffect(() => {
    loadItems(currentDate);
  }, [loadItems, currentDate]);

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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleGestureEvent = ({nativeEvent}) => {
    if (!gestureHandled) {
      if (
        Math.abs(nativeEvent.translationX) > Math.abs(nativeEvent.translationY)
      ) {
        if (nativeEvent.translationX > 50) {
          changeDays(-1);
          setGestureHandled(true);
        } else if (nativeEvent.translationX < -50) {
          changeDays(1);
          setGestureHandled(true);
        }
      }
    }
  };

  const handleGestureEnd = () => {
    setGestureHandled(false);
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
          navigation.navigate('MealPlannerScreen', {
            date,
            item,
          })
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
      if (user?.id) {
        dispatch(fetchUserDetail(user.id))
          .then(() => loadItems(currentDate))
          .finally(() => setRefreshing(false));
      } else {
        setRefreshing(false);
      }
    }, 1000);
  }, [dispatch, user, loadItems, currentDate]);

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleGestureEnd}>
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text className="font-kaushan text-3xl text-[#639067] text-center p-5">
            Calendrier
          </Text>

          <View style={styles.centerContainer}>
            <View style={styles.monthContainer}>
              <TouchableOpacity
                onPress={() => changeDays(-1)}
                style={styles.monthButton}>
                <Icon name="triangle-left" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.monthTextContainer}>
                <Text style={styles.monthText}>{formatDateRange()}</Text>
              </View>
              <TouchableOpacity
                onPress={() => changeDays(1)}
                style={styles.monthButton}>
                <Icon name="triangle-right" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#639067" />
            </View>
          ) : (
            <View style={styles.grid}>
              {Object.entries(items).map(([dateKey, dateItems]) => (
                <View key={dateKey} style={styles.column}>
                  {renderItem(dateItems, dateKey)}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 5,
    position: 'absolute',
    top: -20,
    left: 40,
  },
  itemText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default CalendarRecap;
