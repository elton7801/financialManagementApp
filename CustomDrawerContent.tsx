import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from './App';
import { getDBConnection, getUserData } from './db.service'; 

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { userId } = useContext(AuthContext);
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // State to track the selected item

  useEffect(() => {
    if (userId !== null) {
      const fetchData = async () => {
        try {
          const db = await getDBConnection();
          const data = await getUserData(db, userId); // Pass userId here
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchData();
    }
  }, [userId]);

  const handlePress = (routeName: string) => {
    setSelectedItem(routeName); // Set the selected item to update the background color
    props.navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Icon name="account-circle" size={80} color="#007bff" style={styles.profilePic} />
        <View style={styles.profileInfo}>
          {userData ? (
            <>
              <Text style={styles.username}>{userData.username}</Text>
              <Text style={styles.email}>{userData.email}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
      <View style={styles.drawerItems}>
        {props.state.routeNames.map((routeName, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.drawerItem,
              selectedItem === routeName ? styles.selectedDrawerItem : null, // Apply different style when selected
            ]}
            onPress={() => handlePress(routeName)}
          >
            <Text style={styles.drawerItemText}>{routeName}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout button */}
      <TouchableOpacity
        style={[
          styles.drawerItem,
          selectedItem === 'Logout' ? styles.selectedDrawerItem : null,
        ]}
        onPress={() => handlePress('Logout')}
      >
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' 
  },
  profilePic: { 
    borderRadius: 40 
  },
  profileInfo: { 
    marginLeft: 15 
  },
  username: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  email: { 
    fontSize: 14, 
    color: '#666' 
  },
  drawerItems: { 
    flex: 1, 
    paddingTop: 10 
  },
  drawerItem: { 
    padding: 15,
    paddingLeft: 20,
    borderRadius: 10, 
    marginVertical: 5, 
    backgroundColor: 'transparent',
    width: '90%', 
    alignSelf: 'center', 
  },
  selectedDrawerItem: { 
    backgroundColor: '#d0e0ff' // Background color when selected
  },
  drawerItemText: { 
    fontSize: 18 
  },
});

export default CustomDrawerContent;
