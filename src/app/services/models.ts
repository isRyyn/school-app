import { ExamType, Gender, Month, Relation, Role, Standard, Subject, TransactionType } from './enums';

export type ModalConfig = {
    data?: object
};


export type ArrayObject = {
    name: string;
    value: any;
}




// DB entities
export interface User {
    id: number;
    email: string;
    password: string;
    mobile: string;
    role: Role;
}


export interface Student {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    gender: Gender;
    session: string;
    standard: Standard;
    rollNo: number
    picture: File;
    uDiasCode: string;
    previousSchool: string;
    mobile: number;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    uniform: boolean;
    course: boolean;
    vehicleName: string;
    vehicleNumber: string;
    vehicleRoute: string;
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

export interface Marks {
    id: number;
    student: Student;
    examType: ExamType;
    subject: Subject;
    marksObtained: number;
    totalMarks: number;
}

export interface Parent {
    firstName: string;
    middleName: string;
    lastName: string;
    mobile: number;
    gender: Gender;
    relation: Relation;   
}