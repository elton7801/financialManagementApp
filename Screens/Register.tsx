import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, createUser } from '../db.service';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

type RegisterScreenProp = StackNavigationProp<StackParamList, 'Register'>;

const Register: React.FC<{ navigation: RegisterScreenProp }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !dob || !phoneNumber || !address) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      const db = await getDBConnection();
      await createUser(db, username, email, password, dob.toISOString().split('T')[0], phoneNumber, address);
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(false);
    setDob(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Date of Birth"
          value={dob.toISOString().split('T')[0]}
          editable={false}
        />
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar-today" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={handleDateChange}
          style={styles.datePicker}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login here</Text>
          </TouchableOpacity>
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
    fontSize: 30, 
    fontFamily: 'Poppins', 
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
  dateInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  dateButton: {
    height: 40,
    backgroundColor: 'transparent',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dateButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
  },
  registerButton: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Register;
