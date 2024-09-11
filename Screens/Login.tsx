import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { useUser } from '../UserContext';
import { getDBConnection, getUserByEmailAndPassword } from '../db.service';

type LoginScreenProp = StackNavigationProp<StackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginScreenProp;
  onLogin: (userId:number) => void; 
}

const Login: React.FC<LoginProps> = ({ navigation, onLogin }) => {
  const { setEmail } = useUser();  // Access the setEmail function from the context
  const [email, setEmailInput] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'You must enter both email and password.');
      return;
    } else {
      setEmail(email);
    }

    try {
      const db = await getDBConnection();
      const user = await getUserByEmailAndPassword(db, email, password);
      const userId = await getUserByEmailAndPassword(db,email, password);

      if(user){
        if (userId) {
          onLogin(userId); // Update login state
          navigation.navigate('Summary');
        } else {
          Alert.alert('Error', 'Email or password is incorrect.');
        }
      }    
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmailInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Do not have an account?{' '}
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Register')}
            >
              Register here.
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Login;
