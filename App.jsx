/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/components/HomeScreen';
import CalendarScreen from './src/components/CalendarScreen';
import CartScreen from './src/components/CartScreen';
import {SafeAreaFrameContext} from 'react-native-safe-area-context';
import { View } from 'react-native';
import ProfileScreen from './src/components/ProfileScreen';

function App() {
  const TabNav = createBottomTabNavigator();

  return (
           
    <View style={{flex: 1}}>
  <NavigationContainer>
    <TabNav.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          flexDirection: 'row',
          height: 50,
          paddingHorizontal: 10,
        },
      }}>
      <TabNav.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
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
          tabBarIcon: ({focused}) => (
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
          tabBarIcon: ({focused}) => (
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
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              name="person"
              size={30}
              color={focused ? '#639068' : 'grey'}
            />
          ),
          tabBarItemStyle: { flex: 1, marginLeft: 'auto' },
        }}
      />
    </TabNav.Navigator>
  </NavigationContainer>
</View>
       
  );
}

export default App;
