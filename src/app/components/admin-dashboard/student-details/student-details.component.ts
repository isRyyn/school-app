import { ApiService } from './../../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArrayObject, ParentModel, StandardModel, StudentModel, VehicleModel } from '../../../services/models';
import { Action, Relation } from "../../../services/enums";
import { CommonModule, DatePipe } from '@angular/common';
import { Gender } from '../../../services/enums';
import { UtilService } from '../../../services/util.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { ShowStudentDetailsComponent } from "./show-student-details/show-student-details.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { elementAt, forkJoin } from 'rxjs';
import { ViewStudentComponent } from "./view-student/view-student.component";
import { DirectiveModule } from '../../../directives/directive.module';

@Component({
    selector: 'app-student-details',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    DatePickerComponent,
    ShowStudentDetailsComponent,
    ViewStudentComponent,
    ViewStudentComponent,
    DirectiveModule
    ],
    providers: [ApiService, DatePipe],
    templateUrl: './student-details.component.html',
    styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent implements OnInit {
    @ViewChild(ShowStudentDetailsComponent) showStudentDetailsComponent!: ShowStudentDetailsComponent;

    studentForm!: FormGroup;
    parentForm!: FormGroup;
    vehicleForm!: FormGroup;
    isLoaded: boolean = false;
    isExpanded: boolean = false;
    showParentForm: boolean = false;
    parentFormCounter: number = 0;
    isViewMode: boolean = false;
    selectedStudent!: StudentModel;

    actions = Action;
    gender = Gender;
    relation = Relation;

    classList: StandardModel[] = [];
    vehicleList: VehicleModel[] = [];
    genders!: Array<ArrayObject>;
    relations!: Array<ArrayObject>;

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly datePipe: DatePipe
    ) { }

    ngOnInit() {
        this.fetchStudentsData();
        this.initializeArrays();
        this.loadForm();
        this.loadParentForm();
    }

    fetchStudentsData(): void {
        // this.apiService.getStudentById(1).subscribe(data => {
        //     this.student = data;
        //     this.pictureUrl = `data:image/jpeg;base64,${btoa(
        //       new Uint8Array(this.student.picture).reduce((data, byte) => data + String.fromCharCode(byte), '')
        //     )}`;
        //   });

        // For HTML
        //<img *ngIf="pictureUrl" [src]="pictureUrl" alt="Student Picture" />
    }

    initializeArrays(): void {
        forkJoin({
            standards: this.apiService.getAllStandards(),
            vehicles: this.apiService.getAllVehicles()
        }).subscribe(r => {
            this.classList = r.standards;
            this.vehicleList = r.vehicles;
            this.isLoaded = true;
        });
        this.genders = this.utilService.intializeArrayWithEnums(this.gender);
        this.relations = this.utilService.intializeArrayWithEnums(this.relation);
    }

    loadForm(): void {
        this.studentForm = new FormGroup({
            id: new FormControl(),
            firstName: new FormControl(null, Validators.required),
            middleName: new FormControl(''),
            lastName: new FormControl(''),
            dob: new FormControl(),
            gender: new FormControl(),
            standardId: new FormControl(null, Validators.required),
            rollNo: new FormControl(),
            picture: new FormControl(),
            uDiasCode: new FormControl(''),
            previousSchool: new FormControl(),
            mobile: new FormControl(),
            email: new FormControl(),
            landline: new FormControl(),
            address: new FormControl(),
            city: new FormControl(),
            state: new FormControl(),
            pincode: new FormControl(),
            uniform: new FormControl(),
            course: new FormControl(),
            vehicleId: new FormControl(), 
            docTC: new FormControl(),
            docMarksheet: new FormControl(),
            docAadhar: new FormControl(),
            docParentAadhar: new FormControl,
            docPhotograph: new FormControl(),
            docDobCertificate: new FormControl()
        });
    }

    loadParentForm(): void {
        this.parentForm = new FormGroup({
            items: new FormArray([])
        });
    }

    loadSubParentForm(parent?: ParentModel): FormGroup {
        return new FormGroup({
            firstName: new FormControl(parent?.firstName),
            middleName: new FormControl(parent?.middleName),
            lastName: new FormControl(parent?.lastName),
            mobile: new FormControl(parent?.mobile),
            gender: new FormControl(parent?.gender),
            relation: new FormControl(parent?.relation),
            childIds: new FormControl(parent?.childIds)
        });
    }

    get items(): FormArray {
        return this.parentForm.get('items') as FormArray;
    }

    addParent(parent?: ParentModel): void {
        this.parentFormCounter++;
        if (this.parentFormCounter <= 3) {
            this.showParentForm = true;
            // if(!parent) {
            //      window.scrollBy({
            //          top: 400,
            //          behavior: 'smooth'
            //      });
            // }
            this.items.push(this.loadSubParentForm(parent));
        }
    }

    onSave(): void {
        if(this.studentForm.valid) {
            const formData = new FormData();
            
            const studentData = { 
                ...this.studentForm.value
            };

            if(this.studentForm.value.dob) {
                studentData['dob'] = this.datePipe.transform(this.studentForm.value.dob, 'dd-MM-yyyy');
            }
            delete studentData['picture'];
    
            formData.append('student', JSON.stringify(studentData));
            if(this.studentForm.value?.picture) {
                 //this.utilService.convertToBase64(this.studentForm.value.picture[0])
                formData.append('picture', this.studentForm.get('picture')?.value);
            }
    
            this.apiService.saveStudent(formData).subscribe(response => {
                if(this.parentFormCounter) {
                    this.saveParent(response?.id);
                } else {
                    this.onCancel();
                    this.showStudentDetailsComponent.classValue = undefined;
                    this.showStudentDetailsComponent.isDataFiltered = false;
                }
            });
        } else {
            this.studentForm.markAllAsTouched();
        }
    }

    saveParent(studentId: number): void {
        let parentForms = this.parentForm.get('items')?.value;
        parentForms = parentForms.map((x: ParentModel) => {
            const childIds = x.childIds ? x.childIds : [];
            childIds.push(studentId);
            return {
                ...x,
                childIds: childIds
            }
        });
        this.apiService.saveMultipleParents(parentForms).subscribe(r => {
            this.onCancel();
            this.showStudentDetailsComponent.classValue = undefined;
            this.showStudentDetailsComponent.isDataFiltered = false;
        });
    }

    onCancel(): void {
        this.studentForm.reset();
        this.parentForm.reset();
        this.isExpanded = false;
    }

    onEdit(student: StudentModel): void {
        this.studentForm.reset();
        this.parentForm.reset();
        this.isExpanded = true;
        this.studentForm.patchValue(student);
        
        if(student.parentsIds.length) {
            student.parentsIds.forEach((id, index) => {
                this.apiService.getParentById(id).subscribe(r => {
                    this.addParent(r);
                });
            });
        }
    }

    
    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.studentForm, field);
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.studentForm.patchValue({
                picture: file
            });
        }
    }

    expandSection(): void {
        this.isExpanded = !this.isExpanded;
    }

    showStudent(student: StudentModel): void {
        this.isViewMode = true;
        this.selectedStudent = student;
    }
}
