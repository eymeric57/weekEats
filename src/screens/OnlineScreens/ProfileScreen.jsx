import React from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserData } from '../../redux/user/UserSelector';
import { logout } from '../../redux/user/UserSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProfileScreen() {
  const dispatch = useDispatch();
  const { userDetail } = useSelector(selectUserData);

  const nickname = userDetail?.name ?? "Pas de pseudo";
  const email = userDetail?.email ?? "Pas d'email";
  const userName = userDetail?.name || "Nom non disponible";

  const handleLogout = async () => {
    try {
      // Suppression du token de AsyncStorage
      await AsyncStorage.removeItem('userToken');
      // Réinitialisation de l'état utilisateur dans Redux
      dispatch(logout());
      // Optionnel: rediriger l'utilisateur vers l'écran de connexion
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
      // Vous pouvez utiliser une navigation ici pour rediriger l'utilisateur si nécessaire
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Pseudo : {userName}</Text>
      <Text>Adresse email : {email}</Text>
      <Text>Nom : {nickname}</Text>
      <Button title="Déconnexion" onPress={handleLogout} color="#FF5733" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default ProfileScreen;
