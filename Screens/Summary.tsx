import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { getDBConnection, getIncomes, getExpenses } from '../db.service';
import { StackParamList } from '../types'; // Import your stack types
import { useUser } from '../UserContext';

type Transaction = {
    id: number;
    name: string;
    value: number;
};

type SummaryRouteProp = RouteProp<StackParamList, 'Summary'>;

const Summary: React.FC = () => {
    const { email } = useUser(); 
    const [incomes, setIncomes] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalIncomes, setTotalIncomes] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    const route = useRoute<SummaryRouteProp>(); // Use the typed route
    const isFocused = useIsFocused(); // Hook to determine if the screen is focused

    const fetchData = useCallback(async () => {
        try {
            const db = await getDBConnection();
            const fetchedIncomes = await getIncomes(db,email);
            const fetchedExpenses = await getExpenses(db,email);

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
        if (route.params?.resetData) {
            setIncomes([]); // Clear incomes
            setExpenses([]); // Clear expenses
            setTotalIncomes(0);
            setTotalExpenses(0);
            setBalance(0);
        } else if (isFocused) {
            fetchData();
        }
    }, [isFocused, fetchData, route.params?.resetData]);

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

                        <View
                            style={[styles.balanceBox, { backgroundColor: balance >= 0 ? 'green' : 'red' }]}
                        >
                            <Text style={styles.balanceText}>
                                Total Balance: ${balance.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                )}
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
});

export default Summary;
