import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getDBConnection, getIncomes, getExpenses } from '../db.service'; // Adjust the import path as necessary

const ViewExpenseIncome = () => {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = await getDBConnection();

                // Fetch incomes and expenses
                const fetchedIncomes = await getIncomes(db);
                const fetchedExpenses = await getExpenses(db);

                // Update state with fetched data
                setIncomes(fetchedIncomes);
                setExpenses(fetchedExpenses);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>Value: {item.value}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Incomes</Text>
            <FlatList
                data={incomes}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Text style={styles.header}>Expenses</Text>
            <FlatList
                data={expenses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    itemContainer: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
});

export default ViewExpenseIncome;
