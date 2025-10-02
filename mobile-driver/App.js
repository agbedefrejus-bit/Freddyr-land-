import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('livreur@freddyland.com');
  const [password, setPassword] = useState('livreur123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    if (email === 'livreur@freddyland.com' && password === 'livreur123') {
      setIsLoggedIn(true);
      Alert.alert('Succès', 'Bienvenue Livreur Jean !');
    } else {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('livreur@freddyland.com');
    setPassword('livreur123');
  };

  if (isLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>🛵 Freddy Land</Text>
        <Text style={styles.welcome}>Bonjour Livreur Jean !</Text>
        
        <View style={styles.deliveryCard}>
          <Text style={styles.cardTitle}>Livraison #FL001</Text>
          <Text>📦 Pizza Royale</Text>
          <Text>🏠 123 Avenue des Champs-Élysées</Text>
          <Text>📞 +33123456789</Text>
          <Text>🟡 Statut: En attente</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Commencer la livraison</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.deliveryCard}>
          <Text style={styles.cardTitle}>Livraison #FL002</Text>
          <Text>📦 Burger Deluxe</Text>
          <Text>🏠 456 Rue de la Paix</Text>
          <Text>📞 +33987654321</Text>
          <Text>🟢 Statut: En cours</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Marquer comme livré</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.loginContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>🛵</Text>
        <Text style={styles.title}>Freddy Land</Text>
        <Text style={styles.subtitle}>Application Livreur</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <Text style={styles.demoText}>
          Compte démo pré-rempli :{'\n'}
          Email: livreur@freddyland.com{'\n'}
          Mot de passe: livreur123
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  loginContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  header: { alignItems: 'center', marginBottom: 50 },
  logo: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  subtitle: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  form: { width: '100%' },
  input: { 
    height: 50, 
    backgroundColor: 'white', 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 15, 
    paddingHorizontal: 15, 
    borderRadius: 10,
    fontSize: 16
  },
  loginButton: { 
    backgroundColor: '#3498db', 
    height: 50, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  demoText: { 
    textAlign: 'center', 
    marginTop: 30, 
    color: '#7f8c8d',
    lineHeight: 20
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50'
  },
  deliveryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50'
  },
  actionButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius
