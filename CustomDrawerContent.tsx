import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from './App';
import { getDBConnection, getUserData } from './db.service'; 

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { email } = useContext(AuthContext);
  const [username, setUsername] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); 

  useEffect(() => {
    if (email !== null) {
      const fetchData = async () => {
        try {
          const db = await getDBConnection();
          const userData = await getUserData(db, email);
          setUsername(userData.username); 
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchData();
    }
  }, [email]);

  const handlePress = (routeName: string) => {
    setSelectedItem(routeName); 
    props.navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Icon name="account-circle" size={80} color="#007bff" style={styles.profilePic} />
        <View style={styles.profileInfo}>
          {username ? (
            <Text style={styles.username}>{username}</Text>
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
              selectedItem === routeName ? styles.selectedDrawerItem : null, 
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
    paddingHorizontal: 20, 
    paddingBottom:10,
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
    backgroundColor: '#d0e0ff',
  },
  drawerItemText: { 
    fontSize: 18 ,
  },
})
export default CustomDrawerContent;