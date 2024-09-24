import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/OnlineScreens/HomeScreen';
import CalendarScreen from './src/screens/OnlineScreens/CalendarScreen';
 
import CartScreen from './src/screens/OnlineScreens/CartScreen';
import Register from './src/screens/OfflineScreens/Register';
import { View, ActivityIndicator } from 'react-native';
import Login from './src/screens/OfflineScreens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './src/screens/OnlineScreens/ProfileScreen';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import MealPlannerScreen from './src/screens/OnlineScreens/MealPlannerScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthContextProvider, useAuthContext } from './src/contexts/AuthContext';

function MainTabs({ setIsSignedIn } ) {
  const TabNav = createBottomTabNavigator();
  const AuthContext = React.useContext(useAuthContext);

  return (
    
    <TabNav.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          paddingHorizontal: 10,
          backgroundColor: 'white',
        },
      }}>
      <TabNav.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              size={30}
              color={focused ? '#639068' : 'grey'}
            />
          ),
          tabBarItemStyle: { flex: 1 },
        }}
      />
    
      <TabNav.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="calendar"
              size={30}
              color={focused ? '#639068' : 'grey'}
            />
          ),
          tabBarItemStyle: { flex: 1 },
        }}
      />
      
      <TabNav.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cart"
              size={30}
              color={focused ? '#639068' : 'grey'}
            />
          ),
          tabBarItemStyle: { flex: 1 },
        }}
      />
      <TabNav.Screen
        name="Profil"
        children={() => <ProfileScreen setIsSignedIn={setIsSignedIn} />}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              name="person"
              size={30}
              color={focused ? '#639068' : 'grey'}
            />
          ),
          tabBarItemStyle: { flex: 1 },
        }}
      />
    </TabNav.Navigator>
   
  );
}

function App() {
  const Stack = createNativeStackNavigator();
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const authConnexion = async () => {
      try {
        const authentification = await AsyncStorage.getItem('user');
        if (authentification) {
          setIsSignedIn(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    authConnexion();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#639067" />
      </View>
    );
  }

  return (
    <AuthContextProvider
    >
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              overflow: 'hidden',
              borderLeftWidth: 9,
              borderRightWidth: 9,
              borderLeftColor: '#639067',
              borderRightColor: '#639067',
            }}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSignedIn ? (
                  <>
                    <Stack.Screen name="MainTabs">
                      {(props) => <MainTabs {...props} setIsSignedIn={setIsSignedIn} />}
                    </Stack.Screen>
                    <Stack.Screen 
                      name="MealPlannerScreen"
                      component={MealPlannerScreen}
                      options={{ headerShown: true, title: 'Ajouter un repas' }}
                    />
                  </>
                ) : (
                  <>   
                    {/* <Stack.Screen name="Calendar">
                      {(props) => <CalendarScreen {...props} setIsSignedIn={setIsSignedIn} />}
                    </Stack.Screen>  */}
                       <Stack.Screen name="Login">
                    {(props) => <Login {...props} setIsSignedIn={setIsSignedIn} />}
                  </Stack.Screen> 
                  <Stack.Screen name="Register">
                    {(props) => <Register {...props} setIsSignedIn={setIsSignedIn} />}
                  </Stack.Screen> 
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </GestureHandlerRootView>
    </Provider>
    </AuthContextProvider>
  );
}
  

export default App;