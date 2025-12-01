import { create } from "zustand";
import { loginUser, getCurrentUser, saveCurrentUser, logoutUser, initializeUsers } from "../api/userService";

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isLoading: false,
  isInitialized: false,

  // Charge l'utilisateur actuel au démarrage de l'application
  initializeAuth: async () => {
    try {
      console.log("🔄 Initialisation de l'authentification...");
      set({ isLoading: true });
      
      // 1. Assure que les utilisateurs de démo sont présents dans AsyncStorage
      await initializeUsers(); 
      
      // 2. Tente de récupérer l'utilisateur connecté
      const user = await getCurrentUser();
      
      console.log("✅ Initialisation terminée. Utilisateur:", user ? user.email : "aucun");
      set({ 
        currentUser: user, 
        isLoading: false,
        isInitialized: true 
      });
    } catch (error) {
      console.error("❌ Erreur dans initializeAuth:", error);
      set({ 
        isLoading: false,
        isInitialized: true 
      });
    }
  },

  // Logique de connexion
  login: async (email) => {
    try {
      console.log("🔐 Tentative de connexion pour:", email);
      set({ isLoading: true });
      
      // 1. Vérifier l'utilisateur
      const user = await loginUser(email);
      
      // 2. Sauvegarder l'utilisateur dans AsyncStorage
      await saveCurrentUser(user);
      
      // 3. Mettre à jour le state
      console.log("✅ Connexion réussie, mise à jour du state");
      set({ 
        currentUser: user, 
        isLoading: false 
      });
      
      return user;
    } catch (error) {
      console.error("❌ Erreur dans login:", error);
      set({ 
        isLoading: false,
        currentUser: null 
      });
      throw error;
    }
  },

  // Logique de déconnexion
  logout: async () => {
    try {
      console.log("🚪 Déconnexion en cours...");
      set({ isLoading: true });
      await logoutUser();
      set({ 
        currentUser: null, 
        isLoading: false 
      });
      console.log("✅ Déconnexion réussie");
    } catch (error) {
      console.error("❌ Erreur dans logout:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Getter simple pour le rôle
  isPatient: () => {
    const user = get().currentUser;
    return user?.role === 'patient';
  },
  
  isPharmacien: () => {
    const user = get().currentUser;
    return user?.role === 'pharmacien';
  },
  
  isAuthenticated: () => {
    return !!get().currentUser;
  }
}));