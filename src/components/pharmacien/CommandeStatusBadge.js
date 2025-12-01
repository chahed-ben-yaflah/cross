import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const statusMap = {
  en_attente: { text: "En Attente", color: '#FF9500' }, 
  en_preparation: { text: "En Préparation", color: '#007AFF' }, 
  prete: { text: "Prête / Disponible", color: '#34C759' }, 
};

const CommandeStatusBadge = ({ status }) => {
  const statusInfo = statusMap[status] || statusMap.en_attente;
  
  return (
    <View style={[styles.badge, { backgroundColor: statusInfo.color }]}>
      <Text style={styles.text}>{statusInfo.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start', // Important pour ne pas prendre toute la largeur
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default CommandeStatusBadge;