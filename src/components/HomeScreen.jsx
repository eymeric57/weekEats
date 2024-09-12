import React from "react";
import { Image, Text, View } from "react-native";
import Icon from "react-native-ionicons";
// import { StyleSheet, Platform } from 'react-native';

function HomeScreen() {







    

    return (
        <View>
            {/* <View style={{ flexDirection: 'row' , alignItems: 'center'}}> */}
            <View className="flex-row items-center" >
                <Image source={require('../assets/images/logo.png')}></Image>
                {/* <Text style={styles.logoText}>WeekEats</Text> */}
                <Text >WeekEats</Text>
            </View>
            <Text className="mt-2 text-lg text-red-500 dark:text-white">Home philig -boss</Text>
           
            <Icon name="ios-home" size={50} color="red" />
        </View>
    );


}

export default HomeScreen