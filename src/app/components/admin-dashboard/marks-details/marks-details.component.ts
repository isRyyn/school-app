import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ArrayObject, MarksModel, StandardModel, StudentModel, SubjectModel } from '../../../services/models';
import { Action, MaxMarks } from "../../../services/enums";
import { UtilService } from '../../../services/util.service';
import { ExamType } from '../../../services/enums';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

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

    isDataLoaded: boolean = false;
    isDataFiltered: boolean = false;

    showBtn: boolean = true;
    editBtn: boolean = false;
    saveBtn: boolean = false;

    totalMarksMap: Map<number, number> = new Map();
    percentageMap: Map<number, number> = new Map();

    sortMap = new Map<string, boolean>([
        ['total', false],
        ['percent', false]
    ]);

    constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly fb: FormBuilder,
        private readonly authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loadData();
        this.examsList = this.utilService.intializeArrayWithEnums(this.examType);
        this.loadForm();
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
            id: [],
            exam: [],
            marksArray: this.fb.array([])
        });
    }

    private updateMarksArray(totalMarks: number) {
        const marksArray = this.marksForm.get('marksArray') as FormArray;
        marksArray.clear();

        this.studentsList.forEach((student, i) => {
            this.subjectsList.forEach((subject, j) => {
                
                const group = this.groupName(i, j);
                const formGroup = this.fb.group({
                    id: [this.marksList[group]?.id ?? null],
                    examName: [this.marksForm.value?.exam],
                    marks: [this.marksList[group]?.marks ?? null],
                    totalMarks: [totalMarks],
                    standardId: [this.marksForm.value?.id],
                    subjectId: [subject?.id],
                    studentId: [student?.id]
                });
                marksArray.push(formGroup);
            });
        });
        this.showBtn = false;
        this.editBtn = true;
        this.isDataFiltered = true;
        this.marksForm.get('marksArray')?.disable();
    }

    groupName(row: number, col: number): number {
        return (row * this.subjectsList.length) + col;
    }

    onInputChange(): void {
        this.editBtn = this.saveBtn = false;
        this.showBtn = true;
        this.isDataFiltered = false;
        forkJoin({
            students: this.apiService.getAllStudents(),
            subjects: this.apiService.getAllSubjects()
        }).subscribe(r => {
            this.studentsList = r.students;
            this.subjectsList = r.subjects;
        });
    }

    onSubmit() {    
        const payload = this.marksForm.value.marksArray.map((x: MarksModel) => {
            return {
                ...x,
                sessionId: this.authService.getSessionId()
            }
        });

        this.apiService.saveMarks(payload).subscribe(() => {
            this.isDataFiltered = false;
            this.saveBtn = false;
            this.showBtn = true;
            this.marksForm.reset();
        });
    }

    onEdit(): void {
        this.marksForm.get('marksArray')?.enable();
        this.editBtn = false;
        this.saveBtn = true;
    }

    onShow(): void { 
        this.isDataFiltered = false;
        const standardId = this.marksForm.get('id')?.value;
        const exam = this.marksForm.get('exam')?.value;
        const totalMarks = exam == 'FA_1' || exam == 'FA_2' ? MaxMarks.TEST : MaxMarks.EXAM;
        if (standardId && exam) {
            this.studentsList = this.studentsList.filter(x => x.standardId == standardId);
            this.subjectsList = this.subjectsList.filter(x => x.standardIds.includes(standardId));
            this.apiService.getMarksForStandardAndExamName(standardId, exam).subscribe(r => {
                this.marksList = r;
                this.setTotalAndPercentageMaps(totalMarks)
                this.updateMarksArray(totalMarks);
            });
        }
    }

    setTotalAndPercentageMaps(maxMarks: number): void {
        this.studentsList.forEach(student => {
            let sum = 0;
            this.marksList.filter(x => x.studentId == student.id).forEach(y => {
                sum += y.marks;
            });
            this.totalMarksMap.set(student.id, sum);

            const percent = (sum / (this.subjectsList.length * maxMarks)) * 100;
            this.percentageMap.set(student.id, percent);
        });
    }

    getTotalMarks(id: number): number {
        return this.totalMarksMap.get(id) ?? 0;
    }

    getPercentage(id: number): number {
        return this.percentageMap.get(id) ?? 0;
    }

    
    sortTable(key: string) {
        const order = this.sortMap.get(key);
        // apply sorting logic
        this.sortMap.set(key, !order);
    }


    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.marksForm, field);
    }

    get saveBtnDisabled(): boolean {
        return !(this.marksForm.value.id && this.marksForm.value.exam);
    }

    print(): void {

    }

    download(): void {
        
    }
}
