import React, { createContext, useState, useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Summary from './Screens/Summary';
import Login from './Screens/Login';
import Logout from './Screens/Logout';
import Register from './Screens/Register';
import ViewExpenseIncome from './Screens/ViewExpenseIncome';
import CreateExpenseIncome from './Screens/CreateExpenseIncome';
import EditExpenseIncome from './Screens/EditExpenseIncome';
import CustomDrawerContent from './CustomDrawerContent';

// Define navigators
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Auth context
export const AuthContext = createContext({
  isLoggedIn: false,
  email: null as string | null,
  username: null as string | null,
  login: (email: string, username: string) => {},
  logout: () => {},
});

// Stack Navigator for Logged-In State
const LoggedInStackNavigator: React.FC = () => {
  const { logout } = useContext(AuthContext);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Summary" component={Summary} />
      <Stack.Screen name="ViewExpenseIncome" component={ViewExpenseIncome} />
      <Stack.Screen name="CreateExpenseIncome" component={CreateExpenseIncome} />
      <Stack.Screen name="EditExpenseIncome" component={EditExpenseIncome} />
      <Stack.Screen name="Logout">
        {props => <Logout {...props} onLogout={logout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

// Drawer Navigator for Logged-In State
const LoggedInDrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    initialRouteName="Summary"
    drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Summary" component={LoggedInStackNavigator} />
    <Drawer.Screen name="View Expense Income" component={ViewExpenseIncome} />
    <Drawer.Screen name="Create Expense" component={CreateExpenseIncome} initialParams={{ type: 'expense' }} />
    <Drawer.Screen name="Create Income" component={CreateExpenseIncome} initialParams={{ type: 'income' }} />
  </Drawer.Navigator>
);

// Stack Navigator for Not Logged-In State
const NotLoggedInStackNavigator: React.FC = () => {
  const { login } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {props => <Login {...props} onLogin={login} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Summary" component={Summary} />
    </Stack.Navigator>
  );
};

// Main App Component
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = (email: string, username: string) => {
    setIsLoggedIn(true);
    setEmail(email);
    setUsername(username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn,email ,username, login, logout }}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInDrawerNavigator /> : <NotLoggedInStackNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;