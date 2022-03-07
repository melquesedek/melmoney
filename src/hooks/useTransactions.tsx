import {createContext, useEffect, useState, ReactNode, useContext} from 'react';
import { api } from '../services/api';

interface Transaction{
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionsProviderProps{
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

 const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
    );

export function TransactionsProviver({children} : TransactionsProviderProps){
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    useEffect(() => {
        api.get('transactions')
        .then(response => setTransactions(response.data.transactions))
    },[]);

    //Função assincrona para ter como aguardar ela finalizar antes
    //await para esperar
    //Trocado nome da variável da função para melhorar campos internos
    async function createTransaction(transactionInput: TransactionInput){
        //const response para ter resposta da requisição
        const response = await api.post('/transactions', {
            //Manter valor do TransactionInput
            ...transactionInput,
            //Incluindo o createdAt
            createdAt: new Date(),
        });
        //pegando a transação de response.data
        const {transaction} = response.data;
        //Colocando transação no setTransactions
        setTransactions([
            //Mantendo informações com ... e adicionando mais uma transaction
            ...transactions,
            transaction,
        ]);
    }

    return(
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions(){
    const context = useContext(TransactionsContext);
    return context;
}