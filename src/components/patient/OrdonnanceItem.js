import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const OrdonnanceItem = ({ ordonnance, onPress }) => {
  const totalMedicaments = ordonnance.medicaments.length;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(ordonnance)}>
      <Text style={styles.title}>Ordonnance n° {ordonnance.id.toUpperCase()}</Text>
      <Text style={styles.date}>Date : {ordonnance.date}</Text>
      <Text style={styles.details}>Prescriptions : {totalMedicaments} {totalMedicaments > 1 ? 'médicaments' : 'médicament'}</Text>
      
      <View style={styles.actionContainer}>
        <Text style={styles.actionText}>Détails & Commander</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  actionContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 5,
  },
  actionText: {
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'right',
    fontSize: 14,
  }
});

export default OrdonnanceItem;