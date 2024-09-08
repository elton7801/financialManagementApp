import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getDBConnection, getIncomes, getExpenses } from '../db.service';
import { StackParamList } from '../types';
 
type SummaryScreenNavigationProp = StackNavigationProp<StackParamList, 'CreateExpenseIncome'>;
 
type Transaction = {
    id: number;
    name: string;
    value: number;
};
 
const Summary: React.FC = () => {
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);
 
    const navigation = useNavigation<SummaryScreenNavigationProp>();
    const isFocused = useIsFocused(); // Hook to determine if the screen is focused
 
    const fetchData = useCallback(async () => {
        try {
            const db = await getDBConnection();
            const fetchedIncomes = await getIncomes(db);
            const fetchedExpenses = await getExpenses(db);
 
            setIncomes(fetchedIncomes);
            setExpenses(fetchedExpenses);
 
            const totalIncomeAmount = fetchedIncomes.reduce((sum: number, item: Transaction) => sum + item.value, 0);
            const totalExpenseAmount = fetchedExpenses.reduce((sum: number, item: Transaction) => sum + item.value, 0);
            
            setTotalIncomes(totalIncomeAmount);
            setTotalExpenses(totalExpenseAmount);
            setBalance(totalIncomeAmount - totalExpenseAmount);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }, []);
 
    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused, fetchData]);
 
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Monthly Summary</Text>
 
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View>
                        <View style={styles.summaryBox}>
                            <Text style={styles.subtitle}>Total Incomes</Text>
                            <Text style={styles.totalAmount}>${totalIncomes.toFixed(2)}</Text>
 
                            <Text style={styles.subtitle}>Total Expenses</Text>
                            <Text style={styles.totalAmount}>${totalExpenses.toFixed(2)}</Text>
                        </View>
 
                        <TouchableOpacity
                            style={[styles.balanceBox, { backgroundColor: balance >= 0 ? 'green' : 'red' }]}
                            onPress={() => navigation.navigate('ViewExpenseIncome')}
                        >
                            <Text style={styles.balanceText}>
                                Total Balance: ${balance.toFixed(2)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateExpenseIncome', { type: 'expense' })}
                >
                    <Text style={styles.buttonText}>Add Expense</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateExpenseIncome', { type: 'income' })}
                >
                    <Text style={styles.buttonText}>Add Income</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 8,
    },
    summaryBox: {
        marginBottom: 16,
    },
    totalAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    balanceBox: {
        marginVertical: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});
 
export default Summary;