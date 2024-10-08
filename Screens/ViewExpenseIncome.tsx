import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { getDBConnection, getIncomes, getExpenses, deleteExpense, deleteIncome } from '../db.service';
import { useUser } from '../UserContext';
 
type ViewExpenseIncomeNavigationProp = StackNavigationProp<StackParamList, 'ViewExpenseIncome'>;
 
interface Transaction {
    id: number;
    name: string;
    value: number;
    date: string; // Date as a string
}
 
// Function to format date to YYYY-MM-DD
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return ''; // Return empty string if date is invalid
    }
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
};
 
// Function to sort transactions by date
const sortByDate = (transactions: Transaction[]) => {
    return transactions.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
 
const ViewExpenseIncome: React.FC = () => {
    const { email } = useUser(); 
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<ViewExpenseIncomeNavigationProp>();
    const isFocused = useIsFocused();
 
    const fetchData = useCallback(async () => {
        try {
            const db = await getDBConnection();
            const fetchedIncomes = await getIncomes(db,email);
            const fetchedExpenses = await getExpenses(db,email);
 
            // Sort transactions by date
            const sortedIncomes = sortByDate(fetchedIncomes);
            const sortedExpenses = sortByDate(fetchedExpenses);
 
            setIncomes(sortedIncomes);
            setExpenses(sortedExpenses);
        } catch (error) {
            console.error('Failed to load data:', error);
            Alert.alert('Error', 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);
 
    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused, fetchData]);
 
    const handleEdit = (type: 'income' | 'expense', id: number) => {
        navigation.navigate('EditExpenseIncome', { type, id });
    };
 
    const handleDelete = async (type: 'income' | 'expense', id: number) => {
        try {
            const db = await getDBConnection();
            if (type === 'expense') {
                await deleteExpense(db, id,email);
                setExpenses(expenses.filter(expense => expense.id !== id));
            } else if (type === 'income') {
                await deleteIncome(db, id,email);
                setIncomes(incomes.filter(income => income.id !== id));
            }
            Alert.alert('Success', 'Record deleted successfully!');
        } catch (error) {
            console.error('Failed to delete record:', error);
            Alert.alert('Error', 'Failed to delete record.');
        }
    };
 
    const renderItem = ({ item, type }: { item: Transaction; type: 'income' | 'expense' }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemContent}>
                <Text style={styles.itemText}>
                    {item.name} - ${item.value.toFixed(2)}{'\n'}
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text> {/* Format the date */}
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.editButton]}
                        onPress={() => handleEdit(type, item.id)}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDelete(type, item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
 
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.listContainer}>
                    <Text style={styles.title}>Incomes</Text>
                    <FlatList
                        data={incomes}
                        renderItem={(props) => renderItem({ ...props, type: 'income' })}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <Text style={styles.title}>Expenses</Text>
                    <FlatList
                        data={expenses}
                        renderItem={(props) => renderItem({ ...props, type: 'expense' })}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            )}
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#007bff',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
 
export default ViewExpenseIncome;