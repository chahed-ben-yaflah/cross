import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons'; 

// Import des écrans Pharmacien
import CommandeListScreen from '../screens/pharmacien/CommandeListScreen';
import CommandeDetailScreen from '../screens/pharmacien/CommandeDetailScreen'; 
import MedicamentListScreen from '../screens/pharmacien/MedicamentListScreen';
import MedicamentFormScreen from '../screens/pharmacien/MedicamentFormScreen'; 

const Tab = createBottomTabNavigator();
const CommandeStack = createNativeStackNavigator();
const MedicamentStack = createNativeStackNavigator();

// Stack pour la gestion des commandes (Liste -> Détail/Modification Statut)
const CommandeStackScreen = () => (
  <CommandeStack.Navigator>
    <CommandeStack.Screen 
      name="CommandeList" 
      component={CommandeListScreen} 
      options={{ title: "Commandes à Traiter" }} 
    />
    <CommandeStack.Screen 
      name="CommandeDetail" 
      component={CommandeDetailScreen} 
      options={{ title: "Détail Commande" }} 
    />
  </CommandeStack.Navigator>
);

// Stack pour la gestion des médicaments (Liste -> Formulaire CRUD)
const MedicamentStackScreen = () => (
  <MedicamentStack.Navigator>
    <MedicamentStack.Screen 
      name="MedicamentList" 
      component={MedicamentListScreen} 
      options={{ title: "Gestion du Stock" }} 
    />
    <MedicamentStack.Screen 
      name="MedicamentForm" 
      component={MedicamentFormScreen} 
      options={{ title: "Fiche Médicament" }} 
    />
  </MedicamentStack.Navigator>
);


const PharmacienNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // On utilise les headers des Stacks
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'CommandeFlow') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'MedicamentFlow') {
            iconName = focused ? 'pill' : 'pill-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="CommandeFlow" 
        component={CommandeStackScreen} 
        options={{ title: "Commandes" }} 
      />
      <Tab.Screen 
        name="MedicamentFlow" 
        component={MedicamentStackScreen} 
        options={{ title: "Stock Médicaments" }} 
      />
    </Tab.Navigator>
  );
};

export default PharmacienNavigator;