import React, {useState, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_ROOT} from '../../constants/apiConstants';
import {useAuthContext} from '../../contexts/AuthContext';

const Register = ({ setIsSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {signIn} = useAuthContext();
  // const [isSignedIn, setIsSignedIn] = React.useState(false);

  const navigation = useNavigation();

  const validatePasswords = useCallback(() => {
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    setPasswordError('');
    return true;
  }, [password, confirmPassword]);

  const validateForm = useCallback(() => {
    if (!email || !password || !name || !surname) {
      setError('Tous les champs sont obligatoires');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Adresse email invalide');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setError(null);
    return validatePasswords();
  }, [email, password, name, surname, validatePasswords]);

  const isFormValid = useMemo(() => validateForm(), [validateForm]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const registerResponse = await axios.post(`${API_ROOT}/register`, {
        name,
        surname,
        email,
        password,
      });  
  setIsSignedIn(true);
      console.log('Utilisateur enregistré avec succès:', registerResponse.data);

      // Supposons que la réponse contient les informations de l'utilisateur
      const userData = registerResponse.data;

      const user = {
        userId: userData.id, // Assurez-vous que ces champs correspondent à votre réponse API
        email: userData.email,
        name: userData.name,
      };

      // Utiliser signIn du contexte pour connecter l'utilisateur
     await signIn(user);

    } catch (error) {
      console.log('Erreur:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Erreur lors de l'enregistrement, veuillez réessayer.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView className="flex-1 p-4 bg-white">
        <Text className="font-kaushan text-3xl text-[#639067] text-center mt-8 mb-5">
          Inscription
        </Text>

        <View className="mb-5">
          <Text className="text-[#639067] text-base font-bold mb-1">Nom</Text>
          <TextInput
            className="bg-[#d9d9d9] rounded-lg h-10 px-2.5"
            placeholder="Votre nom"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-5">
          <Text className="text-[#639067] text-base font-bold mb-1">
            Prenom
          </Text>
          <TextInput
            className="bg-[#d9d9d9] rounded-lg h-10 px-2.5"
            placeholder="Votre prénom"
            value={surname}
            onChangeText={setSurname}
          />
        </View>

        <View className="mb-5">
          <Text className="text-[#639067] text-base font-bold mb-1">
            Adresse Mail
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
          <Text className="text-[#639067] text-base font-bold mb-1">
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
        <View className="mb-5">
          <Text className="text-[#639067] text-base font-bold mb-1">
            Confirmer votre mot de passe
          </Text>
          <TextInput
            className="bg-[#d9d9d9] rounded-lg h-10 px-2.5"
            placeholder="Confirmer votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {passwordError ? (
            <Text className="text-red-500 text-sm mt-1">{passwordError}</Text>
          ) : null}
        </View>

        {error && (
          <Text className="text-red-500 text-center mb-2.5">{error}</Text>
        )}

        {isLoading ? (
          <ActivityIndicator size="small" color="#639067" />
        ) : (
          <TouchableOpacity
            className={`bg-[#639067] rounded-lg p-2.5 items-center mt-5 ${
              isLoading || !isFormValid ? 'opacity-50' : ''
            }`}
            onPress={handleSubmit}
            disabled={isLoading || !isFormValid}>
            <Text className="text-[#efefef] text-base font-bold">
              {isLoading ? 'Chargement...' : 'Commencer'}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-center mt-5 text-sm">
          Déjà un compte,{' '}
          <Text
            className="text-[#639067] font-bold"
            onPress={() => navigation.navigate('Login')}>
            Connectez-vous !
          </Text>
        </Text>

        <View className="items-center mt-2.5">
          <Image
            className="w-[150px] h-[120px]"
            source={require('../../assets/images/logo.png')}
          />
          <Text className="font-kaushan text-4xl text-[#639067]">WeekEats</Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Register;
