import { __exportStar } from 'tslib';
import { BannerType, ExamType, Gender, Month, Relation, Role, TransactionType } from './enums';

export type ModalConfig = {
    data?: object
};


export type ArrayObject = {
    name: string;
    value: any;
}

export type BannerObject = {
    type: BannerType;
    message?: string;
    timer?: number;
}



// DB entities
export interface UserModel {
    id: number;
    username: string;
    password: string;
    role: Role;
    userId: number;
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
    mobile: string;
    email: string;
    landline: string;
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
    docAadhar: boolean;
    docParentAadhar: boolean;
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
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    mobile: string;
    gender: Gender;
    relation: Relation;   
    childIds: number[];
}

export interface TeacherModel {
    id: number;
    firstName: string;
    lastName: string;
    mobile: string;
    gender: Gender;
    subjectIds: number[];
    standardIds: number[];
}

export interface VehicleModel {
    id: number;
    name: string;
    number: string;
    route: string;
    driver: string;
}

export interface SessionModel {
    id: number;
    name: string;
}

export interface PageModel {
    id: number;
    content: string;
    title: string;
    author: string;
}