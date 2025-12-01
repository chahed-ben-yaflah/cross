import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen'; 

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ title: "Connexion", headerShown: false }} 
    />
    {/* Optionnel : Écrans d'inscription, de mot de passe oublié... */}
  </Stack.Navigator>
);

export default AuthNavigator;