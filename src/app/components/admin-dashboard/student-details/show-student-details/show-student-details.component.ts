import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { StandardModel, StudentModel } from '../../../../services/models';
import { utcAsLocal } from 'ngx-bootstrap/chronos';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-show-student-details',
  standalone: true,
  imports: [CommonModule, NgSelectModule],
  providers: [ApiService],
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.scss'
})
export class ShowStudentDetailsComponent implements OnInit {

    standardsList: StandardModel[] = [];
    filteredStudentsList: StudentModel[] = [];

    isDataLoaded: boolean = false;
    isDataFiltered: boolean = false;

    constructor(
        private readonly apiService: ApiService
    ) {

    } 

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(r => {
            this.standardsList = r;
            this.isDataLoaded = true;
        });
    }

    onStandardChange(event: StandardModel): void {
        const id = event?.id;
        this.isDataFiltered = false;
        if(id) {
            this.apiService.getStudentsByStandard(id).subscribe(r => {
                this.filteredStudentsList = r;
                this.isDataFiltered = true;
            });
        }
    }
}
