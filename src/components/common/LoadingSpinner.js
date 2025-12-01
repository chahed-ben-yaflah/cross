import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingSpinner = ({ text = "Chargement en cours...", size = "large" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  }
});

export default LoadingSpinner;