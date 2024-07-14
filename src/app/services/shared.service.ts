import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Transaction } from './models';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private isLoggedInSubject = new Subject<boolean>();
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private transactionsList: Transaction[] = [];

    constructor() { }

    updateLogStatus(isLoggedIn: boolean): void {
        this.isLoggedInSubject.next(isLoggedIn);
    }

    setTransactionsList(list: Transaction[]): void {
        this.transactionsList = list;
    }

    getTransactionsList(): Transaction[] {
        return this.transactionsList;
    }
}
