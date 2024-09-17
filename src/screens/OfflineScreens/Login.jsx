import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserDetail } from '../../redux/user/UserSlice';
import api from '../../axiosConfig';

const Login = ({ navigation, setIsSignedIn }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      console.log('Réponse du serveur:', response.data);

      if (response.data.id) {
        dispatch(setUserDetail({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          surname: response.data.surname,
        }));
        setIsSignedIn(true);
      } else {
        console.log(`Erreur: Pas d'ID dans la réponse du serveur`);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion de l\'utilisateur:', error.message);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Entrez votre email"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
          />
        </View>
        <Button
          title={isLoading ? 'Connexion en cours...' : "C'est parti"}
          color="#639067"
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </View>

      <View>
        <Text>
          Pas encore de compte ?{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: 'blue' }}>S'inscrire</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 100,
  },
  title: {
    fontFamily: 'KaushanScript-Regular',
    fontSize: 50,
    color: '#639067',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#639067',
    marginBottom: 5,
  },
  input: {
    height: 40,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
});

export default Login;
