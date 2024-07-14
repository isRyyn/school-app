import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ArrayObject, Student } from '../../../services/models';
import { Action } from "../../../services/enums";
import { UtilService } from '../../../services/util.service';
import { ExamType, Subject } from '../../../services/enums';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";

@Component({
    selector: 'app-marks-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule, StudentSelectComponent],
    providers: [ApiService],
    templateUrl: './marks-details.component.html',
    styleUrl: './marks-details.component.scss',
})
export class MarksDetailsComponent implements OnInit {
    action = Action;
    examType = ExamType;
    subject = Subject;

    studentsList: Student[] = [];
    examsList: ArrayObject[] = [];
    subjectsList: ArrayObject[] = [];

    marksForm!: FormGroup;

    isViewMode?: boolean;
    isActionPrimary?: boolean;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        this.fetchStudents();
        this.examsList = this.utilService.intializeArrayWithEnums(this.examType);
        this.subjectsList = this.utilService.intializeArrayWithEnums(this.subject);
        this.loadForm();
        this.route.queryParams.subscribe((params) => {
            this.isActionPrimary = params['action'] === this.action.PRIMARY;
        });
    }

    loadForm(): void {
        this.marksForm = new FormGroup({
            student: new FormControl('', Validators.required),
            examType: new FormControl('', Validators.required),
            subject: new FormControl('', Validators.required),
            marksObtained: new FormControl('', Validators.required),
            totalMarks: new FormControl('', Validators.required),
        });
    }

    fetchStudents(): void {
        this.apiService.getAllStudents().subscribe(response => this.studentsList = response);
    }

    onSave(): void {
        console.log('marksForm', this.marksForm.value);
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.marksForm, field);
    }
}
