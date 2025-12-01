import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

// Import des navigateurs par rôle
import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import PharmacienNavigator from './PharmacienNavigator';

const AppNavigator = () => {
  const { currentUser, isLoading, isInitialized } = useAuthStore();
  
  // Logs pour débogage
  useEffect(() => {
    console.log("🚀 AppNavigator - État actuel:");
    console.log("   isLoading:", isLoading);
    console.log("   isInitialized:", isInitialized);
    console.log("   currentUser:", currentUser ? 
      `${currentUser.email} (${currentUser.role})` : 
      "null"
    );
  }, [currentUser, isLoading, isInitialized]);

  // Écran de chargement initial
  if (isLoading && !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si l'utilisateur n'est pas connecté
  if (!currentUser) {
    console.log("🔐 AppNavigator: Affichage écran de connexion");
    return <AuthNavigator />;
  }

  // Si l'utilisateur est connecté, naviguer selon son rôle
  console.log(`🎯 AppNavigator: Redirection vers ${currentUser.role}`);
  
  switch (currentUser.role) {
    case 'patient':
      return <PatientNavigator />;
    case 'pharmacien':
      return <PharmacienNavigator />;
    case 'medecin':
      // Redirection temporaire vers patient pour les médecins
      return <PatientNavigator />; 
    default:
      console.warn(`⚠️ AppNavigator: Rôle inconnu "${currentUser.role}"`);
      return <AuthNavigator />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator;