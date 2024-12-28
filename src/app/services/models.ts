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
    picture: string;
    uDiasCode: string;
    previousSchool: string;
    userId: number;
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
    monthly: number;
    deposited: number;
    total: number;
    registration: number;
    course: number;
    copies: number;
    dress: number;
    shoes: number;
    tieBelt: number;
    socks: number;
    van: number;
    diary: number;
    other: number;
    other2: number;
    other3: number;
    discount: number;
    foc: boolean;
    uniqueId: string;
    notes: string;
    month: Month;
    date: string;
    studentId: number;
    standardId: number;
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
    userId: number;
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

export interface SessionStandardMapping {
    id: number;
    sessionId: number;
    standardId: number;
    studentId: number;
}

export interface TransferCertificateModel {
    id: number;
    studentId: number;
    number: string;
    district: string;
    name: string;
    aadhar: string;
    dob: string;
    ageYears: string;
    ageMonths: string;
    mother: string;
    father: string;
    religion: string;
    place: string;
    tehsil: string;
    studentDistrict: string;
    livingInStateSince: string;
    dateOfAdmission: string;
    numberOfEntryRegister: string;
    lastDateOfSchool: string;
    dateOfLeaving: string;
    reason: string;
    conduct: string;
    lastClassPassed: string;
    dateOfPassing: string;
    lastClassAttended: string;
    language: string;
    freeOfCost: string;
    freeOfCostClass: string;
    daysSchoolOpened: string;
    daysAttended: string;
    absentDays: string;
    fatherBusiness: string;
    day: string;
    month: string;
    year: string;
    principal: string;
}

export interface TransferCertificateRegisterClassModel {
    className: string;
    dateOfAdmission: string;
    dateOfPromotion: string;
    dateOfRemoval: string;
    causeOfRemoval: string;
    year: string;
    conduct: string;
    work: string;
    sign: string;
}

export interface TransferCertificateRegisterModel {
    id: number;
    studentId: number;
    admissionFileNo: string;
    withdrawlFileNo: string;
    transferCertificateNo: string;
    scholarNameAndAadhaar: string;
    occupationAndAddress: string;
    dob: string;
    lastInstitution: string;
    religion: string;
    mother: string;
    father: string;
    lengthOfResidence: string;
    bankName: string;
    bankAccount: string;
    classDetails: any; 
    dated: string;
    headOfInstitution: string;
}