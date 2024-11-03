import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MealCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Matin</Text>
        {/* Ajoutez vos repas ici */}
      </View>

      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Midi</Text>
        <Text>Repas 1</Text>
      </View>

      <View style={styles.mealSection}>
        <Text style={styles.mealTitle}>Soir</Text>
        {/* Ajoutez vos repas ici */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFEFEF',
  },
  mealSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#639067',
  },
});

export default MealCard;
