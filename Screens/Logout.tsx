import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type LogoutScreenProp = StackNavigationProp<StackParamList>;

interface LogoutProps {
  navigation: LogoutScreenProp;
  onLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ navigation, onLogout }) => {
  const handleLogout = () => {
    onLogout();
    navigation.navigate('Summary');
  };

  const handleCancel = () => {
    navigation.navigate('Summary');
  };

  return (
    <View style={styles.container}>
      <Icon name="exit-to-app" size={70} color="#007bff" style={styles.icon} />
      <Text style={styles.title}>Are you sure you want to logout?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.noButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
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
  icon: {
    marginBottom: 20,
    
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#66b3ff', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Logout;
