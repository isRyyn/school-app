import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private isLoggedInSubject = new Subject<boolean>();
    isLoggedIn$ = this.isLoggedInSubject.asObservable();

    private updateSideNavSubject = new BehaviorSubject<boolean>(true);
    updateSideNav$ = this.updateSideNavSubject.asObservable();

    constructor() { }

    updateLogStatus(isLoggedIn: boolean): void {
        this.isLoggedInSubject.next(isLoggedIn);
    }

    updateSideNav(): void {
        this.updateSideNavSubject.next(!this.updateSideNavSubject.getValue());
    }
}
