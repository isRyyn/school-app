import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { StudentModel } from '../../../services/models';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-student-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './student-select.component.html',
  styleUrl: './student-select.component.scss'
})
export class StudentSelectComponent implements OnInit {
    studentsList: StudentModel[] = [];    
    
    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        readonly parentForm: FormGroupDirective
    ){}

    ngOnInit(): void {
        this.apiService.getAllStudents().subscribe(response => this.studentsList = response);
    }

    isFieldInvalid(): boolean {
        return this.utilService.isFieldInvalid(this.parentForm.form, 'student');
    }
}
