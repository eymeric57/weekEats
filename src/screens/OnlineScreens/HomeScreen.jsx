import {useRoute} from '@react-navigation/native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {selectUserData} from '../../redux/user/UserSelector';

function HomeScreen() {
  const route = useRoute();
  const {userId} = route.params || {};

  const {userDetail} = useSelector(selectUserData);
  const nickname = userDetail?.name ?? 'Pas de pseudo';

  return (
    <View className="flex-1 bg-white rounded-lg shadow-lg">
      {/* En-tête avec logo et salutation */}
      <View className="flex-row items-center justify-center gap-4 mb-2">
        <Image
          source={require('../../assets/images/logo.png')}
          style={{width: 100, height: 100}}
        />
        <Text className="text-2xl font-bold text-[#639067]">
          Bonjour, {nickname} !
        </Text>
      </View>

      {/* Bordure supérieure */}
      <View className="border-4 border-[#639067] mb-4" />

      {/* Conteneur principa fd avec message */}
      <View className="flex-row items-center justify-center w-full rounded-lg p-4">
        <View className="mt-2 w-20 h-20 flex justify-center items-center">
          <Text className="text-2xl text-[#639067]">lu</Text>
          <View className="bg-[#639067] rounded-full w-12 h-12 flex items-center justify-center">
            <Text className="text-2xl font-bold text-white text-center">1</Text>
          </View>
        </View>

        <Text className="text-xl border-4 border-gray-300 text-center rounded-full bg-gray-300 flex-1 ml-4 p-4 text-gray-600">
          Pas de repas prévu !
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;
