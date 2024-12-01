import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useAuthContext} from '../../contexts/AuthContext';
import {ActivityIndicator, Text, View} from 'react-native';
import {Image} from 'react-native-svg';

import {Home} from '../../components/Home';
import {selectUserData} from '../../redux/user/UserSelector';
import {fetchUserDetail} from '../../redux/user/UserSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {user} = useAuthContext();
  const userId = user ? user.id : null; // Vérifie que user est défini
  const {loading, userDetail} = useSelector(selectUserData);
  const date = new Date();

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetail(userId));
      console.log('====================================');
      console.log('userId', userId);
      console.log('planningDetail', userDetail);
      console.log('====================================');
    }
  }, [dispatch, userId]);

  if (loading) {
    return <ActivityIndicator size="medium" color="#639067" />;
  }

  if (!user) {
    return <Text>Erreur: utilisateur non trouvé.</Text>; // Message d'erreur si user est undefined
  }

  return (
    <View className="flex-1  bg-white rounded-lg shadow-lg">
      {/* En-tête avec logo et salutation */}
      <View className="flex-row items-center  justify-center gap-4 mb-2">
        <Image
          source={require('../../assets/images/logo.png')}
          style={{width: 100, height: 100}}
        />
        <Text className="text-2xl pt-4 font-bold mb-3 text-[#639067]">
          Bonjour {user.nom} !
        </Text>
      </View>

      {/* Bordure supérieure */}
      <View className="border-4 border-[#639067] mb-4" />

      {/* Conteneur principal avec message */}
      <Home userDetail={userDetail} />
    </View>
  );
};

export default HomeScreen;
