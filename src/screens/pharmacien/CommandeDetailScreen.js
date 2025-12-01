import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useCommandeStore } from '../../store/commandeStore';
import { getOrdonnanceById } from '../../api/ordonnanceService';
import { getMedicaments } from '../../api/medicamentService';
import CommandeStatusBadge from '../../components/pharmacien/CommandeStatusBadge';
import Button from '../../components/common/Button';

const statusMap = {
  en_attente: { text: "En Attente", next: 'en_preparation', nextText: 'Mettre en Préparation' },
  en_preparation: { text: "En Préparation", next: 'prete', nextText: 'Marquer comme Prête' },
  prete: { text: "Prête", next: null, nextText: 'Commande Terminée' },
};

const CommandeDetailScreen = ({ route, navigation }) => {
  const { commandeId } = route.params;
  const { commandes, updateCommandeStatus } = useCommandeStore();
  
  const commande = commandes.find(c => c.id === commandeId);
  
  const [ordonnance, setOrdonnance] = useState(null);
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!commande) return;
      
      const ord = await getOrdonnanceById(commande.ordonnanceId);
      setOrdonnance(ord);
      
      const meds = await getMedicaments();
      // Transformer la liste en map pour un accès facile par ID
      const stockMap = meds.reduce((acc, m) => ({ ...acc, [m.id]: m }), {});
      setStock(stockMap);
      
      setLoading(false);
    };
    fetchData();
  }, [commande]);

  const handleUpdateStatus = async () => {
    if (!commande) return;

    const currentStatusInfo = statusMap[commande.status];
    if (!currentStatusInfo || !currentStatusInfo.next) return;
    
    setLoading(true);
    try {
      await updateCommandeStatus(commande.id, currentStatusInfo.next);
      Alert.alert("Succès", `Le statut est maintenant "${statusMap[currentStatusInfo.next].text}".`);
      // Revenir à la liste après mise à jour (ou rester, au choix)
      // navigation.goBack(); 
    } catch (error) {
      Alert.alert("Erreur", "Échec de la mise à jour du statut.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !commande) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  const currentStatusInfo = statusMap[commande.status];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Commande Patient n°{commande.id.substring(0, 8)}</Text>
        
        {/* Statut actuel */}
        <View style={styles.statusBox}>
          <Text style={styles.label}>Statut Actuel :</Text>
          <CommandeStatusBadge status={commande.status} />
        </View>

        {/* Détails Ordonnance */}
        {ordonnance && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordonnance ({ordonnance.date})</Text>
            {ordonnance.medicaments.map((med, index) => {
              const stockInfo = stock[med.idMedicament];
              const isAvailable = stockInfo && stockInfo.quantiteStock >= (med.quantiteParJour * med.duree);
              
              return (
                <View key={index} style={styles.medItem}>
                  <Text style={[styles.medName, !isAvailable && styles.medUnavailable]}>
                    {med.nom}
                  </Text>
                  <Text style={styles.medDose}>
                    Quantité requise : {med.quantiteParJour * med.duree} unités
                  </Text>
                  <Text style={isAvailable ? styles.stockOK : styles.stockKO}>
                    Stock en Pharmacie : {stockInfo ? stockInfo.quantiteStock : 'N/A'} {stockInfo && stockInfo.quantiteStock}
                    {!isAvailable && ' (Stock insuffisant!)'}
                  </Text>
                </View>
              );
            })}
            <Text style={styles.notes}>Notes Médecin: {ordonnance.notesMedecin}</Text>
          </View>
        )}
        
        {/* Détails Livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails Patient & Livraison</Text>
          <Text style={styles.infoText}>Patient ID: {commande.patientId}</Text>
          <Text style={styles.infoText}>Adresse de livraison : {commande.detailsLivraison.adresse || 'Non spécifiée'}</Text>
          <Text style={styles.infoText}>Remarques du patient : {commande.detailsLivraison.remarques || 'Aucune'}</Text>
        </View>

      </ScrollView>
      
      {/* Footer Bouton de Statut */}
      <View style={styles.footer}>
        {currentStatusInfo?.next ? (
          <Button 
            title={loading ? 'Mise à jour...' : currentStatusInfo.nextText}
            onPress={handleUpdateStatus}
            disabled={loading}
          />
        ) : (
          <Text style={styles.finishedText}>Cette commande est terminée.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, 
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
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: '#555',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
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
  medItem: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  medName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  medUnavailable: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  medDose: {
    fontSize: 14,
    color: '#555',
  },
  stockOK: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
  },
  stockKO: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '600',
  },
  notes: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
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
    paddingBottom: 20, 
  },
  finishedText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
    paddingVertical: 5,
  }
});

export default CommandeDetailScreen;