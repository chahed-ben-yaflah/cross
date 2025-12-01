import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCommandeStore } from '../../store/commandeStore';
import { useAuthStore } from '../../store/authStore';
import CommandeItem from '../../components/patient/CommandeItem';
import Button from '../../components/common/Button';

const CommandeListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const { commandes, loadCommandes } = useCommandeStore();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  
  const patientCommandes = commandes.filter(
    (c) => c.patientId === currentUser?.id
  );

  useFocusEffect(
    useCallback(() => {
      // Charger les commandes au focus de l'écran
      const initialize = async () => {
        setLoading(true);
        await loadCommandes();
        setLoading(false);
      };
      initialize();
    }, [loadCommandes])
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
      <Text style={styles.header}>Suivi de vos Commandes</Text>
      
      {patientCommandes.length === 0 ? (
        <Text style={styles.emptyText}>Aucune commande en cours.</Text>
      ) : (
        <FlatList
          data={patientCommandes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommandeItem 
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
  }
});

export default CommandeListScreen;