import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuthStore } from '../../store/authStore';
import { useCommandeStore } from '../../store/commandeStore';
import { getOrdonnanceById } from '../../api/ordonnanceService';
import { default as pharmacies } from '../data/pharmacieList.json'; 
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { v4 as uuidv4 } from 'uuid';

const CommandeCreateScreen = ({ route, navigation }) => {
  const { ordonnanceId } = route.params;
  const currentUser = useAuthStore((state) => state.currentUser);
  const addCommande = useCommandeStore((state) => state.addCommande);
  
  const [ordonnance, setOrdonnance] = useState(null);
  const [selectedPharmacieId, setSelectedPharmacieId] = useState(pharmacies[0]?.id || '');
  const [livraisonAddress, setLivraisonAddress] = useState('');
  const [remarques, setRemarques] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrdonnance = async () => {
      const data = await getOrdonnanceById(ordonnanceId);
      if (data) {
        setOrdonnance(data);
        // Utiliser l'adresse par défaut du patient ici si elle était disponible, sinon laisser vide
        // setLivraisonAddress(currentUser.adresse || '');
      } else {
        Alert.alert("Erreur", "Ordonnance non trouvée.");
        navigation.goBack();
      }
    };
    fetchOrdonnance();
  }, [ordonnanceId, navigation]);

  const handleCreateCommande = async () => {
    if (!selectedPharmacieId) {
      Alert.alert("Erreur", "Veuillez choisir une pharmacie.");
      return;
    }

    setLoading(true);
    try {
      const selectedPharmacie = pharmacies.find(p => p.id === selectedPharmacieId);

      const newCommande = {
        id: uuidv4(),
        ordonnanceId: ordonnanceId,
        patientId: currentUser.id,
        pharmacienId: selectedPharmacie.pharmacienId, // Lier au pharmacien de la pharmacie
        pharmacieNom: selectedPharmacie.nom, // Ajouter le nom pour affichage facile
        status: 'en_attente', // Statut initial
        dateCreation: new Date().toISOString().split('T')[0],
        detailsLivraison: {
          adresse: livraisonAddress,
          remarques: remarques,
        },
      };

      await addCommande(newCommande);
      
      Alert.alert("Succès", "Votre commande a été envoyée à la pharmacie !");
      // Naviguer vers la liste de suivi des commandes
      navigation.navigate('CommandeFlow', { screen: 'CommandeList' });

    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      Alert.alert("Erreur", "Échec de l'envoi de la commande.");
    } finally {
      setLoading(false);
    }
  };

  if (!ordonnance) {
    return <View style={styles.centered}><Text>Chargement...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Commander l'Ordonnance n°{ordonnance.id.toUpperCase()}</Text>
        
        <Text style={styles.label}>1. Choisir une Pharmacie :</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPharmacieId}
            onValueChange={(itemValue) => setSelectedPharmacieId(itemValue)}
          >
            {pharmacies.map((pharmacie) => (
              <Picker.Item 
                key={pharmacie.id} 
                label={`${pharmacie.nom} (${pharmacie.adresse.split(',')[0]})`} 
                value={pharmacie.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>2. Adresse de Livraison :</Text>
        <Input
          placeholder="Ex: 10 rue des Lilas"
          value={livraisonAddress}
          onChangeText={setLivraisonAddress}
        />

        <Text style={styles.label}>3. Remarques (optionnel) :</Text>
        <Input
          placeholder="Ex: Contacter avant de livrer"
          value={remarques}
          onChangeText={setRemarques}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={loading ? "Envoi en cours..." : "Confirmer et Envoyer la Commande"} 
          onPress={handleCreateCommande} 
          disabled={loading || !selectedPharmacieId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});

export default CommandeCreateScreen;