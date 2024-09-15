import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-ionicons";
import Loader from "../../components/loader/Loader";


function CartScreen() {
    return (
        <View style={styles.container}>
           
            <Text>List</Text>
            <Icon name="ios-home" size={50} color="red" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CartScreen;