import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCommandeStore } from '../../store/commandeStore';
import { useAuthStore } from '../../store/authStore';
import CommandeStatusBadge from '../../components/pharmacien/CommandeStatusBadge';
import Button from '../../components/common/Button';

// Composant pour l'item de la liste (similaire au patient, mais adapté au pharmacien)
const PharmacienCommandeItem = ({ commande, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(commande)}>
    <View style={styles.header}>
      <Text style={styles.idText}>Commande n°{commande.id.substring(0, 8)}</Text>
      <CommandeStatusBadge status={commande.status} />
    </View>
    <Text style={styles.infoText}>Patient ID: {commande.patientId}</Text>
    <Text style={styles.infoText}>Date : {commande.dateCreation}</Text>
    <Text style={styles.actionText}>Taper pour gérer le statut</Text>
  </TouchableOpacity>
);


const CommandeListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { commandes, loadCommandes } = useCommandeStore();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  
  // Filtrer les commandes destinées à ce pharmacien
  const pharmacistCommandes = commandes.filter(
    (c) => c.pharmacienId === currentUser?.id
  );

  useFocusEffect(
    useCallback(() => {
      const initialize = async () => {
        setLoading(true);
        await loadCommandes();
        setLoading(false);
      };
      initialize();
    }, [loadCommandes, currentUser])
  );
  
  const handlePressCommande = (commande) => {
    navigation.navigate('CommandeDetail', { commandeId: commande.id });
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
      <Text style={styles.header}>Commandes à Traiter ({pharmacistCommandes.length})</Text>
      
      {pharmacistCommandes.length === 0 ? (
        <Text style={styles.emptyText}>Aucune nouvelle commande à traiter.</Text>
      ) : (
        <FlatList
          data={pharmacistCommandes.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PharmacienCommandeItem 
              commande={item} 
              onPress={handlePressCommande} 
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
    paddingBottom: 5,
    color: '#333',
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
  },
  // Styles pour PharmacienCommandeItem
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
  infoText: {
    fontSize: 14,
    color: '#555',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    textAlign: 'right',
  }
});

export default CommandeListScreen;