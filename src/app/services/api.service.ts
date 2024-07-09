import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student, Transaction } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:8080/api';

    constructor(private httpClient: HttpClient) { }

    getAllStudents(): Observable<Student[]> {
        return this.httpClient.get<Student[]>(`${this.baseUrl}/students`);
    }

    getAllTransactions(): Observable<Transaction[]> {
        return this.httpClient.get<Transaction[]>(`${this.baseUrl}/transactions`);
    }

}
