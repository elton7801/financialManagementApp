import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, updateExpense, updateIncome, getExpenseById, getIncomeById } from '../db.service';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '../UserContext';

type EditExpenseIncomeNavigationProp = StackNavigationProp<StackParamList, 'EditExpenseIncome'>;
type EditExpenseIncomeRouteProp = RouteProp<StackParamList, 'EditExpenseIncome'>;

const EditExpenseIncome = ({ route }: { route: EditExpenseIncomeRouteProp }) => {
    const { email } = useUser(); 
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState(new Date()); // Initialize with current date
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigation = useNavigation<EditExpenseIncomeNavigationProp>();
    const { type, id } = route.params;

    useEffect(() => {
        const loadItem = async () => {
            try {
                const db = await getDBConnection();
                let item;
                if (type === 'expense') {
                    item = await getExpenseById(db, id, email);
                } else if (type === 'income') {
                    item = await getIncomeById(db, id, email);
                }

                if (item) {
                    setName(item.name);
                    setValue(item.value.toString());

                    // Check if the date is valid before setting it
                    const itemDate = item.date ? new Date(item.date) : null;

                    if (itemDate && !isNaN(itemDate.getTime())) {
                        setDate(itemDate); // If valid date, set it
                    } else {
                        console.warn('Invalid or null date found, using current date');
                        setDate(new Date()); // Use current date if invalid or null
                    }
                } else {
                    throw new Error('Item not found');
                }
            } catch (error) {
                console.error('Failed to load item:', error);
                Alert.alert('Error', 'Failed to load item.');
            }
        };

        loadItem();
    }, [type, id]);

    const handleUpdate = async () => {
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
            const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
            if (type === 'expense') {
                await updateExpense(db, id, name, email, parsedValue, formattedDate);
            } else if (type === 'income') {
                await updateIncome(db, id, name, email, parsedValue, formattedDate);
            }
            Alert.alert('Success', 'Record updated successfully!');
            navigation.goBack(); // Navigate back to the previous screen
        } catch (error) {
            console.error('Failed to update record:', error);
            Alert.alert('Error', 'Failed to update record.');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{type === 'expense' ? 'Edit Expense' : 'Edit Income'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Value"
                value={value}
                onChangeText={setValue}
                keyboardType="numeric"
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateButtonText}>Select Date</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{date.toISOString().split('T')[0]}</Text>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                />
            )}
            <TouchableOpacity style={styles.createButton} onPress={handleUpdate}>
                <Text style={styles.createButtonText}>Update</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    dateButton: {
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    datePicker: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 20,
    },
    createButton: {
        height: 50,
        backgroundColor: '#28a745',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditExpenseIncome;