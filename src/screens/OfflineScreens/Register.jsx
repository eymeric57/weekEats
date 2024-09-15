import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, TextInput, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register =  ({ setIsSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      // Enregistrement de l'utilisateur
      const registerResponse = await axios.post(`${API_ROOT}/register`, { name, surname, email, password });
      console.log('Utilisateur enregistré avec succès:', registerResponse.data);
  
      // Connexion automatique après l'enregistrement
      const loginResponse = await axios.post(`${API_ROOT}/login_check`, { username: email, password });
      const token = loginResponse.data.token;
  
      // Stockage du token
      await AsyncStorage.setItem('userToken', token);
  
      // Mettre à jour l'état d'authentification
      setIsSignedIn(true);
  
      // La navigation vers MainScreen n'est plus nécessaire ici, car elle sera gérée par App.js
    } catch (error) {
      console.log('Erreur:', error.response?.data || error.message);
      setError('Erreur lors de l\'enregistrement ou de la connexion, veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Adresse Mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre nom"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Prenom</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre prénom"
          value={surname}
          onChangeText={setSurname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {isLoading ? (
        <ActivityIndicator size="small" color="#639067" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.loginText}>
        Déjà un compte, <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Connectez-vous !</Text>
      </Text>

      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo.png')}
        />
        <Text style={styles.logoText}>WeekEats</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'KaushanScript-Regular',
    fontSize: 30,
    color: '#639067',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#639067',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#639067',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#efefef',
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
  loginLink: {
    color: '#639067',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 150,
    height: 120,
  },
  logoText: {
    fontFamily: 'KaushanScript-Regular',
    fontSize: 35,
    color: '#639067',
  },
  });
    
  

export default Register;



