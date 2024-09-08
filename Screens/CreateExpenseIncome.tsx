import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, createIncomes, createExpenses } from '../db.service';
 
type CreateExpenseIncomeNavigationProp = StackNavigationProp<StackParamList, 'CreateExpenseIncome'>;
type CreateExpenseIncomeRouteProp = RouteProp<StackParamList, 'CreateExpenseIncome'>;
 
const CreateExpenseIncome = ({ route }: { route: CreateExpenseIncomeRouteProp }) => {
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const navigation = useNavigation<CreateExpenseIncomeNavigationProp>();
    const { type } = route.params;
 
    const handleSubmit = async () => {
        if (!name || !value) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }
 
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            Alert.alert('Validation Error', 'Value must be a valid number.');
            return;
        }
 
        try {
            const db = await getDBConnection();
            if (type === 'expense') {
                await createExpenses(db, name, parsedValue.toString());
                Alert.alert('Success', 'Expense added successfully!');
            } else if (type === 'income') {
                await createIncomes(db, name, parsedValue.toString());
                Alert.alert('Success', 'Income added successfully!');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Failed to add record:', error);
            Alert.alert('Error', 'Failed to add record.');
        }
    };
 
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{type === 'expense' ? 'Add Expense' : 'Add Income'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Value"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
            />
            <Button title="Save" onPress={handleSubmit} />
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center'
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8
    }
});
 
export default CreateExpenseIncome;