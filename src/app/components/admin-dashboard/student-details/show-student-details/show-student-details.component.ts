import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { StandardModel, StudentModel } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { DirectiveModule } from '../../../../directives/directive.module';
import { ScrollPageToSectionDirective } from '../../../../directives/scroll-page-to-section.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-student-details',
  standalone: true,
  imports: [CommonModule, NgSelectModule, DirectiveModule, FormsModule],
  providers: [ApiService],
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.scss'
})
export class ShowStudentDetailsComponent implements OnInit {
    @Output() emitStudentForView: EventEmitter<StudentModel> = new EventEmitter();
    @Output() emitStudentForEdit: EventEmitter<StudentModel> = new EventEmitter();

    standardsList: StandardModel[] = [];
    filteredStudentsList: StudentModel[] = [];

    isDataLoaded: boolean = false;
    isDataFiltered: boolean = false;
    
    classValue?: string;

    constructor(
        private readonly router: Router,
        private readonly apiService: ApiService
    ) {

    } 

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(r => {
            this.standardsList = r;
            this.isDataLoaded = true;
        });
    }

    onStandardChange(event?: StandardModel): void {
        const id = event?.id;
        this.isDataFiltered = false;
        if(id) {
            this.apiService.getStudentsByStandard(id).subscribe(r => {
                this.filteredStudentsList = r;
                this.isDataFiltered = true;
            });
        }
    }

    onSelect(student: StudentModel, isEdit: boolean): void {
        isEdit ? this.emitStudentForEdit.emit(student) : this.emitStudentForView.emit(student);
    }
}
