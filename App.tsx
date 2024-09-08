import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import Summary from './Screens/Summary';
import Login from './Screens/Login';
import Register from './Screens/Register';
import ViewExpenseIncome from './Screens/ViewExpenseIncome';
import EditExpenseIncome from './Screens/EditExpenseIncome';
import CreateExpenseIncome from './Screens/CreateExpenseIncome';
import { StackParamList } from './types'; 
import { getDBConnection, createIncomesTable, createExpensesTable, createUsersTable, listTables } from './db.service';

const Stack = createStackNavigator<StackParamList>();

const headerOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#42f584',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold' as TextStyle['fontWeight'],
  },
  headerTitleAlign: 'center',
};


const initializeDatabase = async () => {
  try {
      const db = await getDBConnection();

      // Create tables
      await createIncomesTable(db);
      await createExpensesTable(db);
      await createUsersTable(db);

      // Verify table creation
      await listTables(db);

      // Now you can perform other operations like querying
  } catch (error: unknown) {
      if (error instanceof Error) {
          console.error('Database initialization error:', error.message);
      } else {
          console.error('Unexpected error:', error);
      }
  }
};

initializeDatabase();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={headerOptions}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={headerOptions}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={headerOptions}
        />
        <Stack.Screen
          name="ViewExpenseIncome"
          component={ViewExpenseIncome}
          options={headerOptions}
        />
        <Stack.Screen
          name="EditExpenseIncome"
          component={EditExpenseIncome}
          options={headerOptions}
        />
        <Stack.Screen
          name="CreateExpenseIncome"
          component={CreateExpenseIncome}
          options={headerOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
