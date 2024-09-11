import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Summary from '../Screens/Summary';
import Login from '../Screens/Login';
import Logout from '../Screens/Logout';
import Register from '../Screens/Register';
import ViewExpenseIncome from '../Screens/ViewExpenseIncome';
import CreateExpenseIncome from '../Screens/CreateExpenseIncome';
import EditExpenseIncome from '../Screens/EditExpenseIncome';

const Stack = createStackNavigator();

const MainStackNavigator: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Stack.Navigator initialRouteName="Login">
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Summary">
            {props => <Summary {...props} isLoggedIn={isLoggedIn} />}
          </Stack.Screen>
          <Stack.Screen name="ViewExpenseIncome" component={ViewExpenseIncome} />
          <Stack.Screen name="CreateExpenseIncome" component={CreateExpenseIncome} />
          <Stack.Screen name="EditExpenseIncome" component={EditExpenseIncome} />
          <Stack.Screen name="Logout">
            {props => <Logout {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Login">
            {props => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Summary">
            {props => <Summary {...props} isLoggedIn={isLoggedIn} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
