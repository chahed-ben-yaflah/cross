import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, LogBox } from 'react-native';
import { useAuthStore } from './src/store/authStore';
import { initializeMedicaments } from './src/api/medicamentService';
import { initializeOrdonnances } from './src/api/ordonnanceService';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorer certains warnings pour plus de clarté
LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
]);

const App = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    console.log("🚀 Lancement de l'application...");
    
    const initApp = async () => {
      try {
        // Initialiser les données de démo
        console.log("📦 Initialisation des données médicamenteuses...");
        await initializeMedicaments();
        
        console.log("📋 Initialisation des ordonnances...");
        await initializeOrdonnances();
        
        // Initialiser l'authentification
        console.log("🔐 Initialisation de l'authentification...");
        await initializeAuth();
        
        console.log("✅ Application initialisée avec succès");
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
      }
    };

    initApp();
  }, [initializeAuth]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;