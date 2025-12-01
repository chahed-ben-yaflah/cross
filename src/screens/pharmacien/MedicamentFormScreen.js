import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useMedicamentStore } from '../../store/medicamentStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

const MedicamentFormScreen = ({ route, navigation }) => {
  // Récupérer le médicament existant s'il y en a un (pour la modification)
  const existingMedicament = route.params?.medicament;
  
  const isEditing = !!existingMedicament;
  
  const [nom, setNom] = useState(existingMedicament?.nom || '');
  const [dosage, setDosage] = useState(existingMedicament?.dosage || '');
  const [forme, setForme] = useState(existingMedicament?.forme || '');
  const [quantiteStock, setQuantiteStock] = useState(String(existingMedicament?.quantiteStock || '0'));
  const [loading, setLoading] = useState(false);

  const { addMedicament, updateMedicament } = useMedicamentStore();

  const handleSave = async () => {
    if (!nom || !dosage || !forme || isNaN(parseInt(quantiteStock))) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs correctement.");
      return;
    }

    setLoading(true);
    
    const medicamentData = {
      nom,
      dosage,
      forme,
      quantiteStock: parseInt(quantiteStock, 10),
    };

    try {
      if (isEditing) {
        // Modification
        await updateMedicament(existingMedicament.id, medicamentData);
        Alert.alert("Succès", "Médicament mis à jour.");
      } else {
        // Création
        const newMedicament = {
          ...medicamentData,
          id: 'm' + uuidv4().substring(0, 7),
        };
        await addMedicament(newMedicament);
        Alert.alert("Succès", "Nouveau médicament ajouté au stock.");
      }
      
      navigation.goBack();

    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      Alert.alert("Erreur", "Échec de l'enregistrement du médicament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{isEditing ? 'Modifier le Médicament' : 'Ajouter un Médicament'}</Text>

      <Text style={styles.label}>Nom Commercial :</Text>
      <Input
        placeholder="Ex: Doliprane"
        value={nom}
        onChangeText={setNom}
      />
      
      <Text style={styles.label}>Dosage :</Text>
      <Input
        placeholder="Ex: 500 mg"
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Forme :</Text>
      <Input
        placeholder="Ex: Comprimé, Gélule, Sirop..."
        value={forme}
        onChangeText={setForme}
      />

      <Text style={styles.label}>Quantité en Stock :</Text>
      <Input
        placeholder="Ex: 120"
        value={quantiteStock}
        onChangeText={setQuantiteStock}
        keyboardType="numeric"
      />

      <Button 
        title={loading ? "Enregistrement..." : (isEditing ? "Enregistrer les Modifications" : "Ajouter au Stock")}
        onPress={handleSave}
        disabled={loading}
        style={styles.saveButton}
      />

      {isEditing && (
        <Button 
          title="Annuler"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 5,
    color: '#333',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#FF3B30',
  }
});

export default MedicamentFormScreen;