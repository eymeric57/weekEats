import React, {useState, useEffect} from 'react';
import {Text, View, Button, Alert, Image} from 'react-native';
import {useAuthContext} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';

function ProfileScreen({setIsSignedIn}) {
  const {user, signOut} = useAuthContext();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      if (user && user.id) {
        await signOut();
        setIsSignedIn(false);
        Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès.');
      } else {
        console.error('Erreur lors de la déconnexion : user.id est null');
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.',
        );
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.',
      );
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl text-[#639067] font-bold  mb-4">Profile</Text>
      <Text className="text-lg text-[#639067] mb-2">
        Pseudo : {user.nom || 'Non défini'}
      </Text>
      <Text className="text-lg text-[#639067] mb-2">
        Adresse email : {user.email || 'Non défini'}
      </Text>
      <Text className="text-lg text-[#639067] mb-4">
        Nom : {user.prenom || 'Non défini'}
      </Text>

      <Button
        title="Déconnexion"
        onPress={handleLogout}
        color="#FF5733"
        className="rounded-lg p-2.5 mt-4"
      />

      <View className="items-center mt-8">
        <Image
          className="w-[150px] h-[120px]"
          source={require('../../assets/images/logo.png')}
        />
        <Text className="font-kaushanScript-regular text-4xl text-[#639067] mt-2">
          WeekEats
        </Text>
      </View>
    </View>
  );
}

export default ProfileScreen;
