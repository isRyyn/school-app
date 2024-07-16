import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fee, Marks, Parent, Student, Transaction, User } from './models';

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

    getAllStudents(): Observable<Student[]> {
        return this.httpClient.get<Student[]>(`${this.baseUrl}/students`);
    }

    saveStudent(payload: Student): Observable<Student> {
        return this.httpClient.post<Student>(`${this.baseUrl}/students`, payload);
    }

    saveParent(payload: Parent): Observable<Parent> {
        return this.httpClient.post<Parent>(`${this.baseUrl}/parents`, payload);
    }

    getAllTransactions(): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>(`${this.baseUrl}/transactions`);
    }

    saveTransaction(payload: Transaction): Observable<Transaction> {
        return this.httpClient.post<Transaction>(`${this.baseUrl}/transactions`, payload);
    }

    getAllMarks(): Observable<Marks[]> {
        return this.httpClient.get<Marks[]>(`${this.baseUrl}/marks`);
    }

    saveMarks(payload: Marks): Observable<Marks> {
        return this.httpClient.post<Marks>(`${this.baseUrl}/marks`, payload);
    }

    getAllFee(): Observable<Fee[]> {
        return this.httpClient.get<Fee[]>(`${this.baseUrl}/fee`);
    }

    saveFee(payload: Fee): Observable<Fee> {
        return this.httpClient.post<Fee>(`${this.baseUrl}/fee`, payload);
    }
 
}
