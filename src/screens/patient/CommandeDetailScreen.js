import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useCommandeStore } from '../../store/commandeStore';
import { getOrdonnanceById } from '../../api/ordonnanceService';
import Button from '../../components/common/Button';

const statusMap = {
  en_attente: { text: "En Attente de Traitement", color: '#FF9500' },
  en_preparation: { text: "En Préparation", color: '#007AFF' },
  prete: { text: "Prête / Disponible", color: '#34C759' },
};

const CommandeDetailScreen = ({ route }) => {
  const { commandeId } = route.params;
  const commandes = useCommandeStore((state) => state.commandes);
  const commande = commandes.find(c => c.id === commandeId);
  
  const [ordonnance, setOrdonnance] = useState(null);

  useEffect(() => {
    if (commande) {
      const fetchOrdonnance = async () => {
        const data = await getOrdonnanceById(commande.ordonnanceId);
        setOrdonnance(data);
      };
      fetchOrdonnance();
    }
  }, [commande]);

  if (!commande) {
    return <View style={styles.centered}><Text>Commande non trouvée.</Text></View>;
  }

  const statusInfo = statusMap[commande.status] || statusMap.en_attente;
  const isReady = commande.status === 'prete';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Détail de la Commande n°{commande.id.substring(0, 8)}</Text>

      {/* Statut actuel */}
      <View style={[styles.statusCard, { backgroundColor: statusInfo.color }]}>
        <Text style={styles.statusCardText}>Statut Actuel : {statusInfo.text}</Text>
      </View>

      {/* Informations Pharmacie */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pharmacie</Text>
        <Text style={styles.infoText}>{commande.pharmacieNom}</Text>
      </View>

      {/* Informations Livraison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de Livraison</Text>
        <Text style={styles.infoText}>Adresse : {commande.detailsLivraison.adresse || 'Non spécifiée'}</Text>
        <Text style={styles.infoText}>Remarques : {commande.detailsLivraison.remarques || 'Aucune'}</Text>
      </View>
      
      {/* Détail Ordonnance (aperçu) */}
      {ordonnance && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contenu de l'Ordonnance ({ordonnance.date})</Text>
          {ordonnance.medicaments.map((med, index) => (
            <Text key={index} style={styles.medText}>
              • {med.nom} ({med.quantiteParJour}x / {med.duree}j)
            </Text>
          ))}
        </View>
      )}

      {isReady && (
        <View style={styles.readyBox}>
          <Text style={styles.readyText}>✅ Votre commande est prête. Vous pouvez la retirer ou attendre la livraison.</Text>
        </View>
      )}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statusCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusCardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  medText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  readyBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E6FFE9', // Vert très pâle
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  readyText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default CommandeDetailScreen;