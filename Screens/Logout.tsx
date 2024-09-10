// Logout.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';

type LogoutScreenProp = StackNavigationProp<StackParamList>;

interface LogoutProps {
  navigation: LogoutScreenProp;
  onLogout: () => void; // Prop to handle logout state change
}

const Logout: React.FC<LogoutProps> = ({ navigation, onLogout }) => {
  const handleLogout = () => {
    // Clear user data or reset the state
    onLogout(); // Update logout state
    navigation.navigate('Summary', { resetData: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to logout?</Text>
      <Button title="Logout" onPress={handleLogout} />
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
    fontSize: 18,
    marginBottom: 20,
  },
});

export default Logout;
