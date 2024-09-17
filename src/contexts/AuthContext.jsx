import { createContext, useContext, useState } from "react";
import { USER_INFOS } from "../constants/appConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";


//création du context d'authentification
const AuthContext = createContext({
  userId: '', //state
  email: '', //state
  nickname: '', //state
  setUserId: () => { }, //méthode pour modifier le state userId
  setEmail: () => { }, //méthode pour modifier le state email
  setName: () => { }, //méthode pour modifier le state nickname
  signIn: async () => { }, //méthode pour se connecter
  signOut: async () => { }, //méthode pour se déconnecter

});

//on définit toute la mécanique de notre context
const AuthContextProvider = ({children}) => { 
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  //on définit la méthode signIn
  const signIn = async (user) => {
    try {
      setUserId(user.userId);
      setEmail(user.email);
      setName(user.name);
      AsyncStorage.setItem(USER_INFOS, JSON.stringify(user));
    } catch (error) {
      throw new Error(`Erreur lors de la connexion : ${error}`);
    }
  }
  //on définit la méthode signOut
  const signOut = async () => {
    try {
      setUserId('');
      setEmail('');
      setName('');
      await AsyncStorage.removeItem(USER_INFOS);

    } catch (error) {
      throw new Error(`Erreur lors de la déconnexion : ${error}`);
    }
  }

  const value = {
    userId,
    email,
    name,
    setUserId,
    setEmail,
    setName,
    signIn,
    signOut,
  }
  return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
}

//création de notre propre hook pour utiliser notre context
const useAuthContext = () => useContext(AuthContext);

export {AuthContext, AuthContextProvider, useAuthContext};