import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArrayObject, StandardModel, SubjectModel, TeacherModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import { Gender } from '../../../services/enums';
import { DirectiveModule } from '../../../directives/directive.module';

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, DirectiveModule],
  providers: [ApiService],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.scss'
})
export class ManageTeachersComponent implements OnInit {
    teachersForm!: FormGroup;
    isDataLoaded: boolean = false;

    gendersList: Array<ArrayObject> = [];
    teachersList: TeacherModel[] = [];
    subjectsList: SubjectModel[] = [];
    standardsList: StandardModel[] = [];

    constructor(
        private readonly utilService: UtilService,
        private readonly apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.loadForm();
    }

    loadData(): void {
        this.gendersList = this.utilService.intializeArrayWithEnums(Gender);
        forkJoin({
            teachers: this.apiService.getAllTeachers(),
            subjects: this.apiService.getAllSubjects(),
            standards: this.apiService.getAllStandards()
        }).subscribe(r => {
            this.teachersList = r.teachers;
            this.subjectsList = r.subjects;
            this.standardsList = r.standards;
            this.isDataLoaded = true;
        });
    }

    loadForm(): void {
        this.teachersForm = new FormGroup({
            id: new FormControl(),
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(),
            mobile: new FormControl(),
            gender: new FormControl(),
            subjectIds: new FormControl(),
            standardIds: new FormControl()
        });
    }

    onSave(): void {
        if(this.teachersForm.valid) {
            this.isDataLoaded = false;

            this.apiService.saveTeacher(this.teachersForm.value).subscribe(() => {
                this.apiService.getAllTeachers().subscribe(r => {
                    this.teachersList = r;
                    this.teachersForm.reset();
                    setTimeout(() => this.isDataLoaded = true, 100);
                });
            });
        } else {
            this.teachersForm.get('firstName')?.markAsTouched();
        }
    }

    onReset(): void {
        this.teachersForm.reset();
    }

    editTeacher(index: number): void {
        const teacher = this.teachersList[index];
        this.teachersForm.patchValue(teacher);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.teachersForm, field);
    }
}
