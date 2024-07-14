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
    date: string;
    type: TransactionType;
}

export enum Action {
    PRIMARY = 'primary', 
    SECONDARY = 'secondary',
    TERTIARY = 'tertiary'
}

export type ArrayObject = {
    name: string;
    value: any;
}