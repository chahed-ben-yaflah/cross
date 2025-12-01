import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { getOrdonnanceById } from '../../api/ordonnanceService';
import Button from '../../components/common/Button';

const OrdonnanceDetailScreen = ({ route, navigation }) => {
  const { ordonnanceId } = route.params;
  const [ordonnance, setOrdonnance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const data = await getOrdonnanceById(ordonnanceId);
      setOrdonnance(data);
      setLoading(false);
    };
    fetchDetail();
  }, [ordonnanceId]);

  const handleCommander = () => {
    if (ordonnance) {
      // Naviguer vers le formulaire de création de commande
      navigation.navigate('CommandeCreate', { ordonnanceId: ordonnance.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!ordonnance) {
    return (
      <View style={styles.centered}>
        <Text>Ordonnance non trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Ordonnance du {ordonnance.date}</Text>
        <Text style={styles.subHeader}>Prescrite par Dr. Dupont (u111)</Text>

        {/* Section Médicaments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Médicaments Prescrits</Text>
          {ordonnance.medicaments.map((med, index) => (
            <View key={index} style={styles.medItem}>
              <Text style={styles.medName}>{med.nom}</Text>
              <Text style={styles.medDose}>
                {med.quantiteParJour} {med.quantiteParJour > 1 ? 'fois' : 'fois'} / jour, pendant {med.duree} jours.
              </Text>
              <Text style={styles.medNotes}>Notes : {med.notes}</Text>
            </View>
          ))}
        </View>

        {/* Section Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes du Médecin</Text>
          <Text style={styles.noteText}>{ordonnance.notesMedecin}</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Commander cette Ordonnance" 
          onPress={handleCommander} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Pour laisser de la place au bouton Commander
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  medItem: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  medDose: {
    fontSize: 14,
    color: '#555',
  },
  medNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 20, // Espace pour l'encoche
  }
});

export default OrdonnanceDetailScreen;