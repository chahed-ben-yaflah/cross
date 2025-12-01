import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isLoading: authLoading } = useAuthStore();

  // Observateur pour le chargement
  useEffect(() => {
    console.log("📊 État authLoading:", authLoading);
  }, [authLoading]);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email.");
      return;
    }

    console.log("🖱️ Bouton connexion cliqué pour:", email);
    setIsLoading(true);
    
    try {
      // Appeler la fonction login du store
      console.log("📞 Appel de login() dans le store...");
      await login(email);
      
      // Note: Pas besoin de navigation manuelle ici
      // AppNavigator détectera automatiquement le changement de currentUser
      console.log("✅ LoginScreen: Connexion réussie, redirection via AppNavigator");
      
    } catch (error) {
      console.error("❌ LoginScreen: Erreur de connexion:", error);
      Alert.alert(
        "Échec de la connexion", 
        error.message || "Email incorrect ou problème de service."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (role) => {
    if (role === 'patient') {
      setEmail('alice.patient@app.com');
      setPassword('pass');
    } else if (role === 'pharmacien') {
      setEmail('mme.lefevre@app.com');
      setPassword('pass');
    }
  };

  // Afficher le spinner pendant le chargement
  if (isLoading || authLoading) {
    return <LoadingSpinner text="Connexion en cours..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Pharmacie en Ligne</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Email :</Text>
          <Input
            placeholder="Entrez votre email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Mot de passe :</Text>
          <Input
            placeholder="Mot de passe (démo: 'pass')"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button 
            title="Se Connecter" 
            onPress={handleLogin} 
            disabled={!email || !password || isLoading}
            style={styles.loginButton}
          />
        </View>

        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Connexions de démo rapides :</Text>
          <View style={styles.demoButtons}>
            <Button 
              title="Patient (alice.patient@app.com)" 
              onPress={() => handleAutoFill('patient')} 
              style={styles.demoButton}
              textStyle={styles.demoButtonText}
            />
            <Button 
              title="Pharmacien (mme.lefevre@app.com)" 
              onPress={() => handleAutoFill('pharmacien')} 
              style={styles.demoButton}
              textStyle={styles.demoButtonText}
            />
          </View>
          <Text style={styles.demoHint}>Mot de passe pour tous les comptes : "pass"</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  loginButton: {
    marginTop: 25,
    backgroundColor: '#007AFF',
  },
  demoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  demoButtons: {
    gap: 10,
  },
  demoButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  demoButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  demoHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  }
});

export default LoginScreen;