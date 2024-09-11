import React from "react";
import { Image, Text, View } from "react-native";
import Icon from "react-native-ionicons";
import { StyleSheet, Platform } from 'react-native';

function HomeScreen() {




const fontFamilies = {
  KaushanScript: Platform.OS === 'ios' ? 'KaushanScript-Regular' : 'KaushanScriptRegular',
};

const styles = StyleSheet.create({
  logoText: {
    fontFamily: fontFamilies.KaushanScript,
    // Ajoutez d'autres styles si nécessaire, comme la taille de la police
    fontSize: 24,
  },
});




    

    return (
        <View>
            <View style={{ flexDirection: 'row' , alignItems: 'center'}}>
                <Image source={require('../assets/images/logo.png')}></Image>
                <Text style={styles.logoText}>WeekEats</Text>
            </View>
            <Text>Home</Text>
            <Icon name="ios-home" size={50} color="red" />
        </View>
    );


}

export default HomeScreen