import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
    const [balance, setBalance] = useState<number>(0);

    const navigation = useNavigation<SummaryScreenNavigationProp>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = await getDBConnection();
                const fetchedIncomes = await getIncomes(db);
                const fetchedExpenses = await getExpenses(db);

                setIncomes(fetchedIncomes);
                setExpenses(fetchedExpenses);

                calculateBalance(fetchedIncomes, fetchedExpenses);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateBalance = (incomes: Transaction[], expenses: Transaction[]) => {
        const totalIncomes = incomes.reduce((sum, item) => sum + item.value, 0);
        const totalExpenses = expenses.reduce((sum, item) => sum + item.value, 0);
        setBalance(totalIncomes - totalExpenses);
    };

    const renderItem = ({ item }: { item: Transaction }) => (
        <View style={styles.item}>
            <Text>{item.name}</Text>
            <Text>${item.value.toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Monthly Summary</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <Text style={styles.subtitle}>Incomes</Text>
                    <FlatList
                        data={incomes}
                        renderItem={renderItem}
                        keyExtractor={(item) => `income-${item.id}`}
                    />

                    <Text style={styles.subtitle}>Expenses</Text>
                    <FlatList
                        data={expenses}
                        renderItem={renderItem}
                        keyExtractor={(item) => `expense-${item.id}`}
                    />
                </View>
            )}

            <TouchableOpacity
                style={[styles.balanceBox, { backgroundColor: balance >= 0 ? 'green' : 'red' }]}
                onPress={() => navigation.navigate('ViewExpenseIncome')}
            >
                <Text style={styles.balanceText}>
                    Total Balance: ${balance.toFixed(2)}
                </Text>
            </TouchableOpacity>

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
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
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
