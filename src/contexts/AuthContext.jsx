import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthContextProvider');
  }
  return context;
};

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error(
          'Erreur lors du chargement des données utilisateur:',
          error,
        );
      }
    };

    loadUserData();
  }, []);

  const signIn = async userData => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      throw new Error(`Erreur lors de la connexion : ${error}`);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion : ${error}`);
    }
  };

  return (
    <AuthContext.Provider value={{user, setUser, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext};
