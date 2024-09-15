import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button} from 'react-native';



import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstants';


const Login = ({ setIsSignedIn }) => {
  //on va déclarer nos states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 
  //méthode qui receptionne les données du formulaire
  const handleSubmit = () => {
  //empeche le fonctionnement par défaut du formulaire
    setIsLoading(true); //on met le loader en marche
    axios.post(`${API_ROOT}/login`, {
      email, password
    }).then((response) => {
      
      //si l'utilisateur a bien été enregistré en bdd l'api nous retourne un objet user (dans response.data)
      if (response.data.email) {
        //on reconstruit un objet user pour notre context d'authentification
        const user = {
          userId: response.data.id,
          email: response.data.email,
          
        }
        //on appelle la méthode signIn pour enrtegistrer notre utilisateur dans le context
        setIsSignedIn(true);
        try {
          
          setIsLoading(false);
           //on redirige l'utilisateur vers la page d'accueil du router Online
        } catch (error) {
          setIsLoading(false);
          console.log(`Erreur lors de la création de la session: ${error}`);
        }
      } else {
        setIsLoading(false);
        console.log(`Erreur lors de la réponse du serveur: ${response}`);
      }
    }).catch((error) => {
      setIsLoading(false);
    
      console.log(`Erreur lors de la connexion de l'user': ${error}`);
    })

  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Connexion
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.label}>
            Adresse email
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Entrez votre email"
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text style={styles.label}>
            Mot de passe
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
          />
        </View>
        <Button
          title="C'est parti"
          color="#639067"
          onPress={handleSubmit}
        />
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