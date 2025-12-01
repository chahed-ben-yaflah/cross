import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMedicamentStore } from '../../store/medicamentStore';
import MedicamentItem from '../../components/pharmacien/MedicamentItem';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

const MedicamentListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { medicaments, loadMedicaments, deleteMedicament } = useMedicamentStore();
  const logout = useAuthStore((state) => state.logout);

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        setLoading(true);
        // Le chargement synchronise l'état avec AsyncStorage
        await loadMedicaments(); 
        setLoading(false);
      };
      initialize();
    }, [loadMedicaments])
  );

  const handleEdit = (medicament) => {
    // Naviguer vers l'écran de formulaire pour modification (avec les données existantes)
    navigation.navigate('MedicamentForm', { medicament: medicament });
  };

  const handleCreate = () => {
    // Naviguer vers l'écran de formulaire pour création (sans données)
    navigation.navigate('MedicamentForm', {});
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce médicament du stock ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: async () => {
            try {
              await deleteMedicament(id);
              Alert.alert("Succès", "Médicament supprimé.");
            } catch (e) {
              Alert.alert("Erreur", "Échec de la suppression.");
            }
          },
          style: 'destructive'
        }
      ]
    );
  };
  
  const handleLogout = () => {
    logout(); 
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestion du Stock ({medicaments.length})</Text>
      
      <Button 
        title="Ajouter un Nouveau Médicament" 
        onPress={handleCreate} 
        style={styles.addButton}
      />
      
      {medicaments.length === 0 ? (
        <Text style={styles.emptyText}>Aucun médicament en stock.</Text>
      ) : (
        <FlatList
          data={medicaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicamentItem 
              medicament={item} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          )}
        />
      )}
      
      <Button 
        title="Se déconnecter" 
        onPress={handleLogout} 
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    color: '#333',
  },
  addButton: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#34C759', // Vert pour Ajouter
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#FF3B30',
  }
});

export default MedicamentListScreen;