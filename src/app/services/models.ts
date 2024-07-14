import { Month, TransactionType } from "./enums";

export type ModalConfig = {
    data?: object
}; 


export type ArrayObject = {
    name: string;
    value: any;
}




// DB entities
export interface Student {
    id: number;
    firstName: string
    lastName: string;
    totalFees: number;
}

export interface Transaction {
    id: number;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
}

export interface Fee {
    id: number;
    student: Student;
    amount: number;
    month: Month;
    date: string;
}