import {createContext, useEffect, useState, ReactNode} from 'react';
import { api } from './services/api';

interface Transaction{
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionsProvierProps{
    children: ReactNode;
}
//Forma básica de fazer.
/*interface TransactionInput{
    title: string;
    amount: number;
    type: string;
    category: string;
}*/
//O TransactionInput herda todos os campos do Transaction, exceto id e createdAt
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
//Daria para usar o Pick e escolher os campos

interface TransactionsContextData{
    transactions: Transaction[];
    //Toda função assincrona retorna uma Promise
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    );

export function TransactionsProviver({children} : TransactionsProvierProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        api.get('transactions')
        .then(response => setTransactions(response.data.transactions))
    },[]);

    //Função assincrona para ter como aguardar ela finalizar antes
    //await para esperar
    async function createTransaction(transaction: TransactionInput){
        await api.post('/transactions', transaction);
    }

    return(
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    );
}