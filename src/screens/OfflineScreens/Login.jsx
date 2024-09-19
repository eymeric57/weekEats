import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setUserDetail} from '../../redux/user/UserSlice';
import api from '../../axiosConfig';

const Login = ({navigation, setIsSignedIn}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', {email, password});
      console.log('Réponse du serveur:', response.data);

      if (response.data.id) {
        dispatch(
          setUserDetail({
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            surname: response.data.surname,
            meals: response.data.meals,
          }),
        );

        setIsSignedIn(true);
      } else {
        console.log(`Erreur: Pas d'ID dans la réponse du serveur`);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la connexion de l'utilisateur:",
        error.message,
      );
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <Text
        style={{fontFamily: 'KaushanScript-Regular'}}
        className="font-kaushan text-4xl text-[#639067] text-center mt-8 mb-5">
        Connexion
      </Text>

      <View className="mb-5">
        <Text
          style={{fontFamily: 'KaushanScript-Regular'}}
          className="text-[#639067] text-xl font-bold mb-1">
          Adresse email
        </Text>
        <TextInput
          className="bg-[#d9d9d9] rounded-lg h-10 px-2.5"
          placeholder="Votre email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View className="mb-5">
        <Text
          style={{fontFamily: 'KaushanScript-Regular'}}
          className="text-[#639067] text-xl font-bold mb-1">
          Mot de passe
        </Text>
        <TextInput
          className="bg-[#d9d9d9] rounded-lg h-10 px-2.5"
          placeholder="Votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error && (
        <Text className="text-red-500 text-center mb-2.5">{error}</Text>
      )}

      {isLoading ? (
        <ActivityIndicator size="small" color="#639067" />
      ) : (
        <TouchableOpacity
          className="bg-[#639067] rounded-lg p-2.5 items-center mt-5"
          onPress={handleSubmit}>
          <Text className="text-[#ffffff] text-xl font-bold">C'est parti</Text>
        </TouchableOpacity>
      )}

      <Text className="text-center font-bold mt-5 text-sm">
        Pas encore de compte ?{' '}
        <Text
          className="text-[#639067] font-bold"
          onPress={() => navigation.navigate('Register')}>
          S'inscrire
        </Text>
      </Text>

      <View className="items-center mt-4.5">
        <Image
          className="w-[150px] h-[120px]"
          source={require('../../assets/images/logo.png')}
        />
        <Text
          style={{fontFamily: 'KaushanScript-Regular'}}
          className="font-kaushan text-4xl text-[#639067]">
          WeekEats
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
