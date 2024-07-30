import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements Resolve<Observable<any>> {
  constructor(private apiService: ApiService) {}

  resolve(): Observable<any> {
    return forkJoin({
      students: this.apiService.getAllStudents()
    });
  }
}
