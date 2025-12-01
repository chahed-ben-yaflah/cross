import { getItem, saveItem } from "./asyncStorage";
import initialMedicaments from "../screens/data/medicamentPresetList.json";

const MEDICAMENT_KEY = "medicaments";

// Fonction d'initialisation des médicaments
export const initializeMedicaments = async () => {
  try {
    const existing = await getItem(MEDICAMENT_KEY);
    if (!existing) {
      await saveItem(MEDICAMENT_KEY, initialMedicaments);
      console.log("Médicaments initialisés avec les données de démo");
    }
    return await getMedicaments();
  } catch (error) {
    console.error("Erreur initialisation médicaments:", error);
    throw error;
  }
};

export const getMedicaments = async () => {
  const medicaments = await getItem(MEDICAMENT_KEY);
  return medicaments || [];
};

export const addMedicament = async (medicament) => {
  const medicaments = await getMedicaments();
  const updated = [...medicaments, medicament];
  await saveItem(MEDICAMENT_KEY, updated);
  return updated;
};

export const updateMedicament = async (id, updatedMedicament) => {
  const medicaments = await getMedicaments();
  const updated = medicaments.map(m => m.id === id ? { ...m, ...updatedMedicament } : m);
  await saveItem(MEDICAMENT_KEY, updated);
  return updated;
};

export const deleteMedicament = async (id) => {
  const medicaments = await getMedicaments();
  const updated = medicaments.filter(m => m.id !== id);
  await saveItem(MEDICAMENT_KEY, updated);
  return updated;
};