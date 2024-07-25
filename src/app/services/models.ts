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
    vehicleId: number;

    standardId: number;
    marksIds: number[];
    parentsIds: number[];
    feeIds: number[];

    docTC: boolean;
    docMarksheet: boolean;
    docAadhaar: boolean;
    docParentAadhaar: boolean;
    docPhotograph: boolean;
    docDobCertificate: boolean;
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
    amount: number;
    month: Month;
    date: string;
    studentId: number;
    sessionId: number;
}

export interface SubjectModel {
    id: number;
    name: string;
    standardIds: number[];
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
    sessionId: number;
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