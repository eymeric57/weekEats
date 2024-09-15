import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/OnlineScreens/HomeScreen';
import CalendarScreen from './src/screens/OnlineScreens/CalendarScreen';
import CartScreen from './src/screens/OnlineScreens/CartScreen';
import Register from './src/screens/OfflineScreens/Register';
import { View } from 'react-native';
import Login from './src/screens/OfflineScreens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

function MainTabs() {
  const TabNav = createBottomTabNavigator();

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
        component={CartScreen}
        options={{
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
    </TabNav.Navigator>
  );
}

function App() {
  const Stack = createNativeStackNavigator();
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setIsSignedIn(true);
      }
    };
    checkToken();
  }, []);

  return (
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
              <Stack.Screen name="MainTabs" component={MainTabs} />
            ) : (
              <>   
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
  );
}

export default App;