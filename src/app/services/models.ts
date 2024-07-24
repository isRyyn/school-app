import { ExamType, Gender, Month, Relation, Role, TransactionType } from './enums';

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


export interface StudentModel {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dob: string;
    gender: Gender;
    session: string;
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

    standardId: number;
    subjectIds: number[];
    marksIds: number[];
    parentsIds: number[];
    feeIds: number[];
}

export interface TransactionModel {
    id: number;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
}

export interface FeeModel {
    id: number;
    studentId: number;
    amount: number;
    month: Month;
    date: string;
}

export interface SubjectModel {
    id: number;
    name: string;
    standardIds: number[];
    studentIds: number[];
    marksIds: number[];
}

export interface StandardModel {
    id: number;
    name: string;
    studentIds: number[];
    subjectIds: number[];
    marksIds: number[];
}

export interface MarksModel {
    id: number;
    studentId: number;
    examName: ExamType;
    subjectId: number;
    standardId: number;
    marks: number;
    totalMarks: number;
}

export interface ParentModel {
    firstName: string;
    middleName: string;
    lastName: string;
    mobile: number;
    gender: Gender;
    relation: Relation;   
    studentIds: number[];
}