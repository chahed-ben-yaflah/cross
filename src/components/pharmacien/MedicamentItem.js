import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MedicamentItem = ({ medicament, onEdit, onDelete }) => {
  const stockCritique = medicament.quantiteStock < 30; // Seuil arbitraire

  return (
    <View style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.nom}>{medicament.nom}</Text>
        <Text style={styles.subtitle}>{medicament.dosage} - {medicament.forme}</Text>
        <Text style={[styles.stock, stockCritique && styles.stockCritique]}>
          Stock : {medicament.quantiteStock} unités
          {stockCritique && <Text style={styles.critiqueWarning}> (Critique!)</Text>}
        </Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit(medicament)} style={[styles.actionButton, styles.editButton]}>
          <Icon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(medicament.id)} style={[styles.actionButton, styles.deleteButton]}>
          <Icon name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  stock: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34C759',
  },
  stockCritique: {
    color: '#FF3B30',
  },
  critiqueWarning: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    backgroundColor: '#f5f5f5',
  },
  editButton: {
    //
  },
  deleteButton: {
    //
  }
});

export default MedicamentItem;