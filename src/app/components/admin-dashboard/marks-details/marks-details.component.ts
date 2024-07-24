import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ArrayObject, MarksModel, StandardModel, StudentModel, SubjectModel } from '../../../services/models';
import { Action } from "../../../services/enums";
import { UtilService } from '../../../services/util.service';
import { ExamType } from '../../../services/enums';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { forkJoin } from 'rxjs';

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

    studentsList: StudentModel[] = [];
    subjectsList: SubjectModel[] = [];
    standardsList: StandardModel[] = [];
    examsList: ArrayObject[] = [];
    marksList: MarksModel[] = [];

    marksForm!: FormGroup;

    isViewMode?: boolean;
    isDataLoaded: boolean = false;
    isDataFiltered: boolean = false;
    showMarks: boolean = true;
    totalMarks!: number;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly router: Router,
        private readonly fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.loadData();
        this.examsList = this.utilService.intializeArrayWithEnums(this.examType);
        this.loadForm();
        this.route.queryParams.subscribe((params) => {
            this.isViewMode = params['action'] === this.action.SECONDARY;
        });
    }

    loadData(): void {
        forkJoin({
            data1: this.apiService.getAllStandards(),
            data2: this.apiService.getAllStudents(),
            data3: this.apiService.getAllSubjects()
        }).subscribe(r => {
            this.standardsList = r.data1;
            this.studentsList = r.data2;
            this.subjectsList = r.data3;
            this.isDataLoaded = true;
        });
    }

    loadForm(): void {
        this.marksForm = this.fb.group({
            id: [''],
            exam: [''],
            marksArray: this.fb.array([])
        });
    }

    private updateMarksArray() {
        const marksArray = this.marksForm.get('marksArray') as FormArray;
        marksArray.clear();

        this.studentsList.forEach((student, i) => {
            this.subjectsList.forEach((subject, j) => {
            
                
                const group = this.groupName(i, j);
                console.log('list', this.marksList[group]?.marks);
                const formGroup = this.fb.group({
                    id: [this.marksList[group]?.id ?? null],
                    examName: [this.marksForm.value?.exam],
                    marks: [this.marksList[group]?.marks ?? null],
                    totalMarks: [this.totalMarks],
                    standardId: [this.marksForm.value?.id],
                    subjectId: [subject?.id],
                    studentId: [student?.id]
                });
                marksArray.push(formGroup);
                this.isDataFiltered = true;
            });
        });
    }

    groupName(row: number, col: number): number {
        return (row * this.subjectsList.length) + col;
    }

    saveMarks() {    
        this.apiService.saveMarks(this.marksForm.value.marksArray).subscribe(() => {
            this.isDataFiltered = false;
            this.marksForm.reset();
            this.showMarks = true;
        });
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.marksForm, field);
    }

    onShow(): void { 
        this.isDataFiltered = false;
        const standardId = this.marksForm.get('id')?.value;
        const exam = this.marksForm.get('exam')?.value;
        this.totalMarks = (exam == 'FA_1' || exam == 'FA_2') ? 20 : 100;

        if (standardId && exam) {
            this.showMarks = false;
            this.studentsList = this.studentsList.filter(x => x.standardId == standardId);
            this.subjectsList = this.subjectsList.filter(x => x.standardIds.includes(standardId));
            this.apiService.getMarksForStandardAndExamName(standardId, exam).subscribe(r => {
                this.marksList = r;
                this.updateMarksArray();
            });
        }
    }
}
