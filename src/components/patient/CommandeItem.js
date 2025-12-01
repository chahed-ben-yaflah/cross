import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const statusMap = {
  en_attente: { text: "En Attente", color: '#FF9500' }, // Orange
  en_preparation: { text: "En Préparation", color: '#007AFF' }, // Bleu
  prete: { text: "Prête / Disponible", color: '#34C759' }, // Vert
};

const CommandeItem = ({ commande, onPress }) => {
  const statusInfo = statusMap[commande.status] || statusMap.en_attente;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(commande)}>
      <View style={styles.header}>
        <Text style={styles.idText}>Commande n°{commande.id.substring(0, 8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
      </View>
      
      <Text style={styles.pharmacieText}>Pharmacie : {commande.pharmacieNom}</Text>
      <Text style={styles.dateText}>Créée le : {commande.dateCreation}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  idText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  pharmacieText: {
    fontSize: 14,
    color: '#555',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  }
});

export default CommandeItem;