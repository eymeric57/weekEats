import {createContext, useContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_INFOS} from '../constants/appConstants';

//création du context d'authentification
const AuthContext = createContext({
  user: '', //state
  setUser: () => {}, //méthode pour modifier le state userId
  signIn: async () => {}, //méthode pour se connecter
  signOut: async () => {}, //méthode pour se déconnecter
});

//on définit toute la mécanique de notre context
const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState('');

  //on définit la méthode signIn
  const signIn = async user => {
    console.log('====================================');
    console.log('coucou ça marche ', user);
    console.log('====================================');
    try {
      console.log("Connexion de l'utilisateur :", user);
      setUser(user);
      await AsyncStorage.setItem(USER_INFOS, JSON.stringify(user)); //enregistrement des informations de l'utilisateur dans le AsyncStorageuser);
      console.log('====================================');
    

      const value = await AsyncStorage.getItem(USER_INFOS);
      console.log('await', value);
    } catch (error) {
      throw new Error(`Erreur lors de la connexion : ${error}`);
    }
  };
  //on définit la méthode signOut
  const signOut = async () => {
    try {
      setUser('');
      await AsyncStorage.removeItem(USER_INFOS);
      const remainingData = await AsyncStorage.getItem(USER_INFOS);
      console.log('Données restantes après suppression:', remainingData);
      if (remainingData === null) {
        console.log(
          'Les informations utilisateur ont été correctement effacées.',
        );
      } else {
        console.log(
          "Attention : Les informations utilisateur n'ont pas été complètement effacées.",
        );
      }
    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion : ${error}`);
    }
  };

  const value = {
    user,
    setUser,
    signIn,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//création de notre propre hook pour utiliser notre context
const useAuthContext = () => useContext(AuthContext);

export {AuthContext, AuthContextProvider, useAuthContext};
