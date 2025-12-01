import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getOrdonnances } from '../../api/ordonnanceService';
import { useAuthStore } from '../../store/authStore';
import OrdonnanceItem from '../../components/patient/OrdonnanceItem';
import Button from '../../components/common/Button'; // Import du composant Button

const OrdonnanceListScreen = ({ navigation }) => {
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  const fetchOrdonnances = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Récupérer toutes les ordonnances
      const allOrdonnances = await getOrdonnances();
      
      // Filtrer celles qui appartiennent au patient actuel
      const patientOrdonnances = allOrdonnances.filter(
        (o) => o.patientId === currentUser.id
      );
      setOrdonnances(patientOrdonnances);
    } catch (error) {
      console.error("Erreur de chargement des ordonnances:", error);
      // Gérer l'erreur utilisateur ici
    } finally {
      setLoading(false);
    }
  };

  // Se recharge lorsque l'écran est focalisé (utile après la création d'une commande)
  useFocusEffect(
    useCallback(() => {
      fetchOrdonnances();
    }, [currentUser])
  );

  const handlePressOrdonnance = (ordonnance) => {
    navigation.navigate('OrdonnanceDetail', { ordonnanceId: ordonnance.id });
  };
  
  const handleLogout = () => {
    logout(); // Appel de la fonction de déconnexion du store
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
      <Text style={styles.header}>Bonjour {currentUser.name} !</Text>
      
      {ordonnances.length === 0 ? (
        <Text style={styles.emptyText}>Aucune ordonnance trouvée.</Text>
      ) : (
        <FlatList
          data={ordonnances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrdonnanceItem 
              ordonnance={item} 
              onPress={handlePressOrdonnance} 
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
    backgroundColor: '#FF3B30', // Rouge pour déconnexion
  }
});

export default OrdonnanceListScreen;