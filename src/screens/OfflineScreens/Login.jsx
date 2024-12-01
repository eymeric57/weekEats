import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import api from '../../axiosConfig';
import {useAuthContext} from '../../contexts/AuthContext';

const Login = ({navigation, setIsSignedIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {signIn} = useAuthContext();

  const validateInputs = () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Adresse email invalide');
      return false;
    }
    return true;
  };

  // Login.js
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/login_check', {
        email: email.trim(),
        password: password,
      });

      if (response.data.userId) {
        const userData = {
          id: response.data.userId,
          nom: response.data.nom,
          prenom: response.data.prenom,
          email: response.data.email,
        };
        await signIn(userData);
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Erreur:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Erreur de connexion');
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

      <Text className="text-center mt-5 text-sm text-[#639067]">
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
