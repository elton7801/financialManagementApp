import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Summary from '../Screens/Summary';
import Login from '../Screens/Login';
import Logout from '../Screens/Logout';
import Register from '../Screens/Register';
import ViewExpenseIncome from '../Screens/ViewExpenseIncome';
import CreateExpenseIncome from '../Screens/CreateExpenseIncome';
import EditExpenseIncome from '../Screens/EditExpenseIncome';

const Drawer = createDrawerNavigator();

const MainDrawerNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login">
        {isLoggedIn ? (
          <>
            <Drawer.Screen name="Summary">
              {props => <Summary {...props} isLoggedIn={isLoggedIn} />}
            </Drawer.Screen>
            <Drawer.Screen name="View Expense Income" component={ViewExpenseIncome} />
            <Drawer.Screen name="Create Expense" component={CreateExpenseIncome} initialParams={{ type: 'expense' }} />
            <Drawer.Screen name="Create Income" component={CreateExpenseIncome} initialParams={{ type: 'income' }} />
            <Drawer.Screen name="Logout">
              {props => <Logout {...props} onLogout={handleLogout} />}
            </Drawer.Screen>
          </>
        ) : (
          <>
            <Drawer.Screen name="Login">
              {props => <Login {...props} onLogin={handleLogin} />}
            </Drawer.Screen>
            <Drawer.Screen name="Register" component={Register} />
            <Drawer.Screen name="Summary">
              {props => <Summary {...props} isLoggedIn={isLoggedIn} />}
            </Drawer.Screen>
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainDrawerNavigator;