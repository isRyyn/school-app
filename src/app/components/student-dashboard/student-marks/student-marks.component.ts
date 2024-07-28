import { Component, OnInit } from '@angular/core';
import { MarksModel, SubjectModel } from '../../../services/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import { ExamType, MaxMarks } from '../../../services/enums';

@Component({
  selector: 'app-student-marks',
  templateUrl: './student-marks.component.html',
  styleUrl: './student-marks.component.scss'
})
export class StudentMarksComponent implements OnInit {
    isDataLoaded: boolean = false;

    validSubjectArr: string[] = [];
    examList: string[] = [];
    totalArr: number[] = [];

    marksMap: Map<string, number[]> = new Map();

    examType = ExamType;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.examList = Object.values(this.examType);
        this.activatedRoute.queryParams.subscribe(params => {
            const studentId = params['id'];
            forkJoin({
                marks: this.apiService.getAllMarksOfStudentForSession(studentId),
                subjects: this.apiService.getAllSubjects()   
            }).subscribe(r => {
                    this.setMarksMap(r.marks);
                    this.setSubjectArr(r.subjects, r.marks);
            });
        });
    }

    setMarksMap(marksData: MarksModel[]): void {
        Object.keys(this.examType).forEach(exam => {
            let examMarks = marksData.filter(x => x.examName == exam);
            examMarks.sort((a, b) => a.subjectId - b.subjectId); 
            this.marksMap.set(exam, examMarks.map(x => x.marks));
        });        
        this.calculateTotal();
    }

    setSubjectArr(subjects: SubjectModel[], marksData: MarksModel[]): void {
        const validSubjectIds = new Set(marksData.map(x => x.subjectId));
        const validSubjectIdsArr = Array.from(validSubjectIds).sort((a, b) => a - b);

        validSubjectIdsArr.forEach(id => {
            this.validSubjectArr.push(subjects.find(x => x.id == id)?.name ?? '');
        });
    }

    calculateTotal(): void {
        Array.from(this.marksMap.values()).forEach(marksRow => {
            const sum = marksRow.reduce((a, b) => {
                return a + b;
            }, 0);
            this.totalArr.push(sum);
        });
    }

    getMarks(examName: string, index: number): number | undefined {
        const marksRow = this.marksMap.get(examName.split(' ').join('_').toUpperCase());
        return marksRow?.[index];
    }

    getPercentage(total: number, exam: string): number {
        const maxMarks = exam == 'FA 1' || exam == 'FA 2' ? MaxMarks.TEST : MaxMarks.EXAM;
        return (total / (maxMarks * this.validSubjectArr.length)) * 100;
    }

    goBack(): void {
        this.router.navigate(['/private/student-dashboard']);
    }
}
