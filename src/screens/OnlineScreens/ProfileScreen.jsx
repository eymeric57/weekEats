import React from 'react';
import { Text, View, Button, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../redux/user/UserSelector';
import { useAuthContext } from '../../contexts/AuthContext';

function ProfileScreen({ setIsSignedIn }) {
  
  const { userDetail } = useSelector(selectUserData);

  const nickname = userDetail?.name ?? 'Pas de pseudo';
  const email = userDetail?.email ?? "Pas d'email";
  const userName = userDetail?.name || 'Nom non disponible';
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();

    setIsSignedIn(false);
      Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès.');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message);
    }
  }

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      <Text className="text-2xl text-[#639067] font-bold  mb-4">Profile</Text>
      <Text className="text-lg text-[#639067] mb-2">Pseudo : {userName}</Text>
      <Text className="text-lg text-[#639067] mb-2">Adresse email : {email}</Text>
      <Text className="text-lg text-[#639067] mb-4">Nom : {nickname}</Text>
      
      <Button 
        title="Déconnexion" 
        onPress={handleLogout} 
        color="#FF5733" 
        className="rounded-lg p-2.5 mt-4"
      />

      {/* Logo et nom de l'application */}
      <View className="items-center mt-8">
        <Image
          className="w-[150px] h-[120px]"
          source={require('../../assets/images/logo.png')}
        />
        <Text className="font-kaushanScript-regular text-4xl text-[#639067] mt-2">WeekEats</Text>
      </View>
    </View>
  );
}

export default ProfileScreen;