import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons'; 

// Import des écrans Patient avec chemins relatifs corrects
import OrdonnanceListScreen from '../screens/patient/OrdonnanceListScreen';
import OrdonnanceDetailScreen from '../screens/patient/OrdonnanceDetailScreen';
import CommandeCreateScreen from '../screens/patient/CommandeCreateScreen';
import CommandeListScreen from '../screens/patient/CommandeListScreen';
import CommandeDetailScreen from '../screens/patient/CommandeDetailScreen';

const Tab = createBottomTabNavigator();
const OrdonnanceStack = createNativeStackNavigator();
const CommandeStack = createNativeStackNavigator();

// Stack pour les ordonnances (Liste -> Détail -> Création Commande)
const OrdonnanceStackScreen = () => (
  <OrdonnanceStack.Navigator>
    <OrdonnanceStack.Screen 
      name="OrdonnanceList" 
      component={OrdonnanceListScreen} 
      options={{ title: "Mes Ordonnances" }} 
    />
    <OrdonnanceStack.Screen 
      name="OrdonnanceDetail" 
      component={OrdonnanceDetailScreen} 
      options={{ title: "Détail Ordonnance" }} 
    />
    <OrdonnanceStack.Screen 
      name="CommandeCreate" 
      component={CommandeCreateScreen} 
      options={{ title: "Créer une Commande" }} 
    />
  </OrdonnanceStack.Navigator>
);

// Stack pour le suivi des commandes (Liste -> Détail)
const CommandeStackScreen = () => (
  <CommandeStack.Navigator>
    <CommandeStack.Screen 
      name="CommandeList" 
      component={CommandeListScreen} 
      options={{ title: "Suivi des Commandes" }} 
    />
    <CommandeStack.Screen 
      name="CommandeDetail" 
      component={CommandeDetailScreen} 
      options={{ title: "Détail Commande" }} 
    />
  </CommandeStack.Navigator>
);


const PatientNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // On utilise les headers des Stacks
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'OrdonnanceFlow') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'CommandeFlow') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="OrdonnanceFlow" 
        component={OrdonnanceStackScreen} 
        options={{ title: "Ordonnances" }} 
      />
      <Tab.Screen 
        name="CommandeFlow" 
        component={CommandeStackScreen} 
        options={{ title: "Commandes" }} 
      />
    </Tab.Navigator>
  );
};

export default PatientNavigator;