import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BannerObject } from './models';
import { BannerType } from './enums';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private updateLogStatusSubject = new Subject<void>();
    updateLogStatus$ = this.updateLogStatusSubject.asObservable();

    private showBannerSubject = new Subject<BannerObject>();
    showBanner$ = this.showBannerSubject.asObservable();

    constructor() { }

    updateLogStatus(): void {
        this.updateLogStatusSubject.next();
    }

    showBanner(type: BannerType, message?: string, timer?: number): void {
        const obj: BannerObject = {
            type: type,
            message: message,
            timer: timer
        }
        this.showBannerSubject.next(obj);
    }
}
