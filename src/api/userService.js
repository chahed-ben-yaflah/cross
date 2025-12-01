import { getItem, saveItem, removeItem } from "./asyncStorage";
import initialUsers from "../screens/data/userPresetList.json"; 

const USER_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

// Initialisation des utilisateurs de démo si non existants
export const initializeUsers = async () => {
  try {
    const existingUsers = await getItem(USER_KEY);
    if (!existingUsers) {
      await saveItem(USER_KEY, initialUsers);
      console.log("✅ Utilisateurs initialisés avec succès");
      return initialUsers;
    }
    return existingUsers;
  } catch (error) {
    console.error("❌ Erreur initialisation utilisateurs:", error);
    return initialUsers; // Retourner les données par défaut en cas d'erreur
  }
};

// Logique d'authentification simple basée sur email/rôle
export const loginUser = async (email) => {
  try {
    console.log("🔍 Recherche de l'utilisateur avec email:", email);
    const users = await initializeUsers();
    console.log("📋 Utilisateurs disponibles:", users.length);
    
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé");
      throw new Error("Utilisateur non trouvé.");
    }
    
    console.log("✅ Utilisateur trouvé:", user.email, "- Rôle:", user.role);
    return user; 
  } catch (error) {
    console.error("❌ Erreur dans loginUser:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await getItem(CURRENT_USER_KEY);
    console.log("📱 Utilisateur actuel récupéré:", user ? user.email : "null");
    return user;
  } catch (error) {
    console.error("❌ Erreur getCurrentUser:", error);
    return null;
  }
};

export const saveCurrentUser = async (user) => {
  try {
    console.log("💾 Sauvegarde de l'utilisateur:", user.email);
    await saveItem(CURRENT_USER_KEY, user);
    console.log("✅ Utilisateur sauvegardé avec succès");
  } catch (error) {
    console.error("❌ Erreur saveCurrentUser:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    console.log("🚪 Déconnexion de l'utilisateur");
    await removeItem(CURRENT_USER_KEY);
    console.log("✅ Utilisateur déconnecté avec succès");
  } catch (error) {
    console.error("❌ Erreur logoutUser:", error);
    throw error;
  }
};