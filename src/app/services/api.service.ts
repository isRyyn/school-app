import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FeeModel, MarksModel, ParentModel, StandardModel, StudentModel, SubjectModel, TransactionModel, User } from './models';
import { ExamType } from './enums';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:8080/api';

    constructor(private httpClient: HttpClient) { }

    login(identifier: string, password: string): Observable<string> {
        return this.httpClient.post<string>(`${this.baseUrl}/auth/login`, {
            params: {
                identifier: identifier,
                password: password
            }
        });
    }

    register(payload: User): Observable<string> {
        return this.httpClient.post<string>(`${this.baseUrl}/api/auth/register`, payload);
    }


    /**
     * 
     * Students api
     * 
     */
    getAllStudents(): Observable<StudentModel[]> {
        return this.httpClient.get<StudentModel[]>(`${this.baseUrl}/students`);
    }

    saveStudent(payload: FormData): Observable<StudentModel> {
        return this.httpClient.post<StudentModel>(`${this.baseUrl}/students`, payload);
    }

    saveParent(payload: ParentModel): Observable<ParentModel> {
        return this.httpClient.post<ParentModel>(`${this.baseUrl}/parents`, payload);
    }

    getAllTransactions(): Observable<TransactionModel[]> {
        return this.httpClient.get<TransactionModel[]>(`${this.baseUrl}/transactions`);
    }


    /**
     * 
     * Transactions api
     * 
     */
    saveTransaction(payload: TransactionModel): Observable<TransactionModel> {
        return this.httpClient.post<TransactionModel>(`${this.baseUrl}/transactions`, payload);
    }

    getAllFee(): Observable<FeeModel[]> {
        return this.httpClient.get<FeeModel[]>(`${this.baseUrl}/fee`);
    }

    saveFee(payload: FeeModel): Observable<FeeModel> {
        return this.httpClient.post<FeeModel>(`${this.baseUrl}/fee`, payload);
    }

    /**
     * 
     * Marks api 
     *  
     */
    saveMarks(marks: MarksModel[]): Observable<void> {
        return this.httpClient.post<void>(`${this.baseUrl}/marks/save`, marks);
    }

    getMarksForStandardAndExamName(standardId: number, examName: ExamType): Observable<MarksModel[]> {
        return this.httpClient.get<MarksModel[]>(`${this.baseUrl}/marks/get/${standardId}/${examName}`);
    }


    /**
     * 
     * Subjects api
     * 
     */
    getAllSubjects(): Observable<SubjectModel[]> {
        return this.httpClient.get<SubjectModel[]>(`${this.baseUrl}/subject`);
    }

    saveSubject(payload: SubjectModel): Observable<SubjectModel> {
        return this.httpClient.post<SubjectModel>(`${this.baseUrl}/subject`, payload);
    }


    /**
     * 
     * Standard api
     * 
     */
    getAllStandards(): Observable<StandardModel[]> {
        return this.httpClient.get<StandardModel[]>(`${this.baseUrl}/standard`);
    }

    saveStandard(payload: StandardModel): Observable<StandardModel> {
        return this.httpClient.post<StandardModel>(`${this.baseUrl}/standard`, payload);
    }
}
