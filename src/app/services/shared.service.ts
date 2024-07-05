import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private isLoggedInSubject = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() { }

  updateLogStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }
}
