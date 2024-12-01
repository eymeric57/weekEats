import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Share,
  StyleSheet,
  Alert,
} from 'react-native';

import {KeyboardAvoidingView, Platform} from 'react-native';
import {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import {API_URL} from '../../constants/apiConstants';
import {useAuthContext} from '../../contexts/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React from 'react';

export default function CartScreen() {
  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [needsSave, setNeedsSave] = useState(false);
  const [listId, setListId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingIndicator, setSavingIndicator] = useState(false);
  const userId = useAuthContext().user?.id;
  const navigation = useNavigation();

  const loadCheckedState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(`checkedItems-${userId}`);
      if (savedState) {
        setCheckedItems(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des états:', error);
    }
  };

  const saveCheckedState = async newState => {
    try {
      await AsyncStorage.setItem(
        `checkedItems-${userId}`,
        JSON.stringify(newState),
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des états:', error);
    }
  };

  const clearCheckedItems = async () => {
    try {
      const uncheckedItems = shoppingList.filter(
        (_, index) => !checkedItems[index],
      );
      setShoppingList(uncheckedItems);

      const newCheckedState = {};
      uncheckedItems.forEach((_, index) => {
        newCheckedState[index] = false;
      });
      setCheckedItems(newCheckedState);
      saveCheckedState(newCheckedState);

      if (listId) {
        await axios.put(`${API_URL}/shopping_lists/${listId}`, {
          content: uncheckedItems.join(', '),
          user: `/api/users/${userId}`,
        });
      }
      Alert.alert('Succès', 'Articles cochés supprimés');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Impossible de supprimer les articles');
    }
  };

  useEffect(() => {
    if (shoppingList.length > 0 && needsSave) {
      saveList();
      setNeedsSave(false);
    }
  }, [shoppingList, needsSave]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (needsSave && shoppingList.length > 0) {
          saveList();
        }
      };
    }, [shoppingList, needsSave]),
  );

  const loadShoppingList = async () => {
    try {
      const response = await axios.get(`${API_URL}/shopping_lists`, {
        params: {
          'user.id': userId,
        },
      });

      const userList = response.data['hydra:member'].find(
        list => list.user === `/api/users/${userId}`,
      );

      if (userList) {
        setListId(userList.id);
        const content = userList.content;
        const items = content.split(', ').filter(item => item.length > 0);
        setShoppingList(items);
        await loadCheckedState();
      } else {
        setShoppingList([]);
      }
    } catch (error) {
      console.error('Error:', error.response?.data);
      Alert.alert('Erreur', 'Impossible de charger la liste');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadShoppingList();
  }, [userId]);

  const addItem = async () => {
    if (item.trim()) {
      const newList = [...shoppingList, item.trim()];
      setShoppingList(newList);
      const newCheckedState = {
        ...checkedItems,
        [newList.length - 1]: false,
      };
      setCheckedItems(newCheckedState);
      saveCheckedState(newCheckedState);
      setItem('');

      try {
        if (listId) {
          await axios.put(`${API_URL}/shopping_lists/${listId}`, {
            content: newList.join(', '),
            user: `/api/users/${userId}`,
          });
        } else {
          const response = await axios.post(`${API_URL}/shopping_lists`, {
            content: newList.join(', '),
            user: `/api/users/${userId}`,
          });
          setListId(response.data.id);
        }
      } catch (error) {
        console.error('Error:', error.response?.data);
        Alert.alert('Erreur', 'Impossible de sauvegarder la liste');
      }
    }
  };

  const toggleItem = index => {
    const newCheckedState = {
      ...checkedItems,
      [index]: !checkedItems[index],
    };
    setCheckedItems(newCheckedState);
    saveCheckedState(newCheckedState);
  };

  const saveList = async () => {
    try {
      setIsSaving(true);
      setSavingIndicator(true);
      if (listId) {
        await axios.put(`${API_URL}/shopping_lists/${listId}`, {
          content: shoppingList.join(', '),
          user: `/api/users/${userId}`,
        });
      } else {
        const response = await axios.post(`${API_URL}/shopping_lists`, {
          content: shoppingList.join(', '),
          user: `/api/users/${userId}`,
        });
        setListId(response.data.id);
      }
    } catch (error) {
      console.error('Error:', error.response?.data);
      Alert.alert('Erreur', 'Impossible de sauvegarder la liste');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSavingIndicator(false), 1000);
    }
  };

  const shareList = async () => {
    try {
      const uncheckedItems = shoppingList.filter(
        (_, index) => !checkedItems[index],
      );
      await Share.share({message: uncheckedItems.join('\n')});
    } catch (error) {
      console.error(error);
    }
  };

  const renderGrid = () => {
    let rows = [];
    for (let i = 0; i < shoppingList.length; i += 2) {
      rows.push(
        <View key={i} style={styles.row}>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={[styles.item, checkedItems[i] && styles.itemChecked]}
              onPress={() => toggleItem(i)}>
              <Icon
                name={
                  checkedItems[i] ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={24}
                color={checkedItems[i] ? '#a5a5a5' : '#639067'}
              />
              <Text
                style={[
                  styles.itemText,
                  checkedItems[i] && styles.itemTextChecked,
                ]}>
                {shoppingList[i]}
              </Text>
            </TouchableOpacity>
          </View>
          {i + 1 < shoppingList.length && (
            <View style={styles.itemContainer}>
              <TouchableOpacity
                style={[styles.item, checkedItems[i + 1] && styles.itemChecked]}
                onPress={() => toggleItem(i + 1)}>
                <Icon
                  name={
                    checkedItems[i + 1]
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={24}
                  color={checkedItems[i + 1] ? '#a5a5a5' : '#639067'}
                />
                <Text
                  style={[
                    styles.itemText,
                    checkedItems[i + 1] && styles.itemTextChecked,
                  ]}>
                  {shoppingList[i + 1]}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>,
      );
    }
    return rows;
  };
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <Text>Chargement...</Text>
            </View>
          ) : (
            <>
              {shoppingList.length === 0 ? (
                <View style={styles.centerContainer}>
                  <Text>Aucun article dans la liste</Text>
                </View>
              ) : (
                renderGrid()
              )}
            </>
          )}

          {shoppingList.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.shareButton} onPress={shareList}>
                <Text style={styles.buttonText}>Partager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shareButton, styles.clearButton]}
                onPress={() => {
                  Alert.alert(
                    'Confirmation',
                    'Voulez-vous supprimer les articles cochés ?',
                    [
                      {
                        text: 'Annuler',
                        style: 'cancel',
                      },
                      {
                        text: 'Confirmer',
                        onPress: clearCheckedItems,
                      },
                    ],
                  );
                }}>
                <Text style={styles.buttonText}>Supprimer les cochés</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {savingIndicator && (
          <View style={styles.savingIndicator}>
            <Text style={styles.savingText}>Sauvegarde...</Text>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.select({
            ios: 125,
            android: 0,
          })}>
          <View style={styles.bottomInputContainer}>
            <TextInput
              style={styles.input}
              value={item}
              onChangeText={setItem}
              placeholder="Ajouter un article"
              returnKeyType="done"
              onSubmitEditing={addItem}
            />
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: Platform.select({
      ios: 0,
      android: 60,
    }),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
  },
  bottomInputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
  },
  addButton: {
    padding: 10,
    backgroundColor: '#639067',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    marginHorizontal: 5,
    width: '48%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemChecked: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: '#639067',
  },
  itemTextChecked: {
    color: '#a5a5a5',
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#639067',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: 'white',
  },
  savingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(99, 144, 103, 0.9)',
    padding: 8,
    borderRadius: 5,
  },
  savingText: {
    color: 'white',
    fontSize: 12,
  },
});
