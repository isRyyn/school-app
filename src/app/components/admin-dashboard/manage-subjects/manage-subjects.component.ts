import { forkJoin } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StandardModel, SubjectModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { DirectiveModule } from '../../../directives/directive.module';

@Component({
  selector: 'app-manage-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, DirectiveModule],
  providers: [ApiService],
  templateUrl: './manage-subjects.component.html',
  styleUrl: './manage-subjects.component.scss'
})
export class ManageSubjectsComponent implements OnInit {
    isDataLoaded: boolean = false;
    subjectForm!: FormGroup;

    standardsList: StandardModel[] = [];
    subjectsList: SubjectModel[] = [];

    classesMap = new Map<number, string>([]);

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.loadData();
        this.loadForm();
    }

    loadData(): void {
        forkJoin({
            data1: this.apiService.getAllStandards(),
            data2: this.apiService.getAllSubjects()
        }).subscribe(r => {
            this.standardsList = r.data1;
            this.subjectsList = r.data2;
            this.setClassesMap();
            this.isDataLoaded = true;
        });
    }

    setClassesMap(): void {
        this.standardsList.forEach(standard => {
            this.classesMap.set(standard.id, standard.name);
        });
    }

    getClasses(ids: number[]): string {
        let classesString = '';
        ids.forEach(id => {
            classesString += `${this.classesMap.get(id)}, `;
        });
        return classesString.slice(0, -2);
    }

    loadForm(): void {
        this.subjectForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl(null, Validators.required),
            standardIds: new FormControl(),
            studentIds: new FormControl(),
            marksIds: new FormControl()
        });
    }

    onSave(): void {
        if(this.subjectForm.valid) {
            this.isDataLoaded = false;
            this.apiService.saveSubject(this.subjectForm.value).subscribe(() => {
                this.apiService.getAllSubjects().subscribe(r => {
                    this.subjectsList = r;
                    this.subjectForm.reset();
                    setTimeout(() => this.isDataLoaded = true, 100);
                });
            });
        } else {
            this.subjectForm.get('name')?.markAsTouched();
        }
    }

    onReset(): void {
        this.subjectForm.reset();
    }

    editSubject(index: number): void {
        const subject = this.subjectsList[index];
        this.subjectForm.patchValue(subject);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.subjectForm, field);
    }
}
