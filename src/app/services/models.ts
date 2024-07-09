export type ModalConfig = {
    data?: object
}; 

export interface Student {
    id: number;
    name: string
    totalFees: number;
}

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE'
}

export interface Transaction {
    id: number;
    amount: number;
    category: string;
    time: string;
    type: TransactionType;
}