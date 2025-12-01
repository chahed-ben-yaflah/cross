// src/api/ordonnanceService.js
import { getItem, saveItem } from "./asyncStorage";
import { default as initialOrdonnances } from "../screens/data/ordonnancePresetList.json";

const ORDONNANCE_KEY = "ordonnances";

// Fonction d'initialisation des ordonnances
export const initializeOrdonnances = async () => {
  try {
    const existing = await getItem(ORDONNANCE_KEY);
    if (!existing) {
      await saveItem(ORDONNANCE_KEY, initialOrdonnances);
      console.log("Ordonnances initialisées avec les données de démo");
    }
    return await getOrdonnances();
  } catch (error) {
    console.error("Erreur initialisation ordonnances:", error);
    throw error;
  }
};

//fonctions existantes...
export const getOrdonnances = async () => {
  const ordonnances = await getItem(ORDONNANCE_KEY);
  return ordonnances || [];
};

export const getOrdonnanceById = async (id) => {
  const ordonnances = await getOrdonnances();
  return ordonnances.find(o => o.id === id);
};

export const getOrdonnancesByPatientId = async (patientId) => {
  const ordonnances = await getOrdonnances();
  return ordonnances.filter(o => o.patientId === patientId);
};

export const addOrdonnance = async (ordonnance) => {
  const ordonnances = await getOrdonnances();
  const updated = [...ordonnances, ordonnance];
  await saveItem(ORDONNANCE_KEY, updated);
  return updated;
};