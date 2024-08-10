import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArrayObject, StandardModel, SubjectModel, TeacherModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';
import { BannerType, Gender } from '../../../services/enums';
import { DirectiveModule } from '../../../directives/directive.module';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";
import { SharedService } from '../../../services/shared.service';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, DirectiveModule, ActionSelectComponent, LoaderLineComponent],
  providers: [ApiService],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.scss'
})
export class ManageTeachersComponent implements OnInit {
    teachersForm!: FormGroup;
    loginForm!: FormGroup;

    isDataLoaded: boolean = false;
    showLoginForm: boolean = true;

    gendersList: Array<ArrayObject> = [];
    teachersList: TeacherModel[] = [];
    subjectsList: SubjectModel[] = [];
    standardsList: StandardModel[] = [];

    constructor(
        private readonly utilService: UtilService,
        private readonly apiService: ApiService,
        private readonly sharedService: SharedService
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
            userId: new FormControl(),
            subjectIds: new FormControl(),
            standardIds: new FormControl()
        });

        this.loadLoginDetailsForm();
    }

    loadLoginDetailsForm(): void {
        this.loginForm = new FormGroup({
            id: new FormControl(''),
            username: new FormControl(''),
            password: new FormControl(''),
            userId: new FormControl()
        });
    }

    onSave(): void {
        if(this.teachersForm.valid) {
            this.isDataLoaded = false;

            this.apiService.saveTeacher(this.teachersForm.value).subscribe((response) => {
                this.registerTeacher(response.id);
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

    registerTeacher(teacherId: number): void {
        if(this.showLoginForm && this.loginForm.value.username) {
            
            const payload = {
                ...this.loginForm.value,
                role: 'TEACHER',
                userId: teacherId
            }

            if(this.loginForm.value.id) {
                this.apiService.updateCredentials(payload).subscribe();
                this.loginForm.reset();
            } else {
                this.apiService.register(payload).subscribe((r) => {
                    this.loginForm.reset();
                }, (error) => {
                    if(error.status == 417) {
                        const error = 'Email or mobile number is already in use. Please edit student';
                        this.sharedService.showBanner(BannerType.ERROR, error);
                    }  
                });
            }    
        }
    }

    onReset(): void {
        this.teachersForm.reset();
    }

    onAction(event: string, index: number) {
        const teacher = this.teachersList[index];
        if(event == 'edit') {
            this.loginForm.reset();
            this.teachersForm.reset();
            this.showLoginForm = true;
            this.teachersForm.patchValue(teacher);
            this.getUserDetails(teacher.userId);
        } else if (event == 'delete') {
            this.deleteTeacher(teacher.id);
        }
    }

    getUserDetails(userId: number): void {
        if(userId) {
            this.showLoginForm = false;
            this.apiService.getUserById(userId).subscribe(r => {
                this.loginForm.get('id')?.patchValue(r.id);
                this.loginForm.get('username')?.patchValue(r.username);
            });
        }
    }

    deleteTeacher(id: number): void {
        this.apiService.deleteTeacher(id).subscribe(() => {
            this.isDataLoaded = false;
            this.apiService.getAllTeachers().subscribe(r => {
                this.teachersList = r;
                setTimeout(() => this.isDataLoaded = true, 200); 
            });
        });
    }

    loginDetailChanged(event: any, control: string): void {
        if(event.target.value) {
            this.loginForm.get(control)?.setValidators([Validators.required]);
        } else {
            this.loginForm.get(control)?.removeValidators([Validators.required]);
        }
        this.loginForm.get(control)?.updateValueAndValidity();
    }

    isFieldInvalid(field: string, form: FormGroup = this.teachersForm): boolean {
        return this.utilService.isFieldInvalid(form, field);
    }
}
