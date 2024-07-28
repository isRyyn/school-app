import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { StudentModel } from '../../../services/models';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from '../../../services/util.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-student-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  providers: [ApiService],
  templateUrl: './student-select.component.html',
  styleUrl: './student-select.component.scss'
})
export class StudentSelectComponent implements OnInit {
    @Input() controlName: string = 'studentId';
    @Input() showLabel: boolean = true;
    @Output() emitStudent: EventEmitter<StudentModel> = new EventEmitter();

    studentsList: StudentModel[] = [];    
    
    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        readonly parentForm: FormGroupDirective
    ){}

    ngOnInit(): void {
        this.apiService.getAllStudents().subscribe(response => {
            this.studentsList = response.map(student => ({
                ...student,
                fullName: `${student.firstName} ${student.lastName} (${student.uDiasCode ?? ''})`
            }));
        });
    }

    isFieldInvalid(): boolean {
        return this.utilService.isFieldInvalid(this.parentForm.form, this.controlName);
    }

    onStudentChange(student: StudentModel): void {
        this.emitStudent.emit(student);
    }

    getStudentLabel(item: StudentModel): string {
        let label = item.firstName;
        if(item?.lastName) {
            label += ` ${item.lastName}`;
        }
        if(item.uDiasCode) {
            label += ` (${item?.uDiasCode})`;
        }
        return label;
    }
}
