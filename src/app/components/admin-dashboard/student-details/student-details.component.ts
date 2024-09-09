import { ApiService } from './../../../services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArrayObject, ParentModel, StandardModel, StudentModel, VehicleModel } from '../../../services/models';
import { Action, BannerType, Relation } from "../../../services/enums";
import { CommonModule, DatePipe } from '@angular/common';
import { Gender } from '../../../services/enums';
import { UtilService } from '../../../services/util.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { ShowStudentDetailsComponent } from "./show-student-details/show-student-details.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';
import { ViewStudentComponent } from "./view-student/view-student.component";
import { DirectiveModule } from '../../../directives/directive.module';
import { SharedService } from '../../../services/shared.service';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

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
    DirectiveModule,
    LoaderLineComponent
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
    loginDetailsForm!: FormGroup;

    isLoaded: boolean = false;
    isExpanded: boolean = false;
    showParentForm: boolean = false;
    showLoginForm: boolean = true;
    importClicked: boolean = false;
    isImporting: boolean = false;

    parentFormCounter: number = 0;
    isViewMode: boolean = false;

    selectedStudent!: StudentModel;
    fileToImport!: File;

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
        private readonly datePipe: DatePipe,
        private readonly sharedService: SharedService
    ) { }

    ngOnInit() {
        this.initializeArrays();
        this.loadForm();
        this.loadParentForm();
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
            userId: new FormControl(),
            uDiasCode: new FormControl('', Validators.required),
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

        this.loadLoginDetailsForm();
    }

    loadParentForm(): void {
        this.parentForm = new FormGroup({
            items: new FormArray([])
        });
    }

    loadLoginDetailsForm(): void {
        this.loginDetailsForm = new FormGroup({
            id: new FormControl(''),
            username: new FormControl(''),
            password: new FormControl(''),
            userId: new FormControl()
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
        if (this.parentFormCounter <= 1) {
            this.showParentForm = true;
            this.items.push(this.loadSubParentForm(parent));
        }
    }


    loginDetailChanged(event: any, control: string): void {
        if(event.target.value) {
            this.loginDetailsForm.get(control)?.setValidators([Validators.required]);
        } else {
            this.loginDetailsForm.get(control)?.removeValidators([Validators.required]);
        }
        this.loginDetailsForm.get(control)?.updateValueAndValidity();
    }


    onSave(): void {
        if(this.studentForm.valid && this.loginDetailsForm.valid) {
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
                formData.append('picture', this.studentForm.get('picture')?.value);
            }
    
            this.apiService.saveStudent(formData).subscribe(response => {
                this.registerStudent(response.id);
               
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
            this.loginDetailsForm.markAllAsTouched();
        }
    }

    registerStudent(studentId: number): void {
        if(this.showLoginForm && this.loginDetailsForm.value.username) {
            
            const payload = {
                ...this.loginDetailsForm.value,
                role: 'STUDENT',
                userId: studentId
            }

            if(this.loginDetailsForm.value.id) {
                this.apiService.updateCredentials(payload).subscribe();
            } else {
                this.apiService.register(payload).subscribe((r) => {}, (error) => {
                    if(error.status == 417) {
                        const error = 'Email or mobile number is already in use. Please edit student';
                        this.sharedService.showBanner(BannerType.ERROR, error);
                    }  
                });
            }    
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

        parentForms.forEach((form: ParentModel) => {
            this.apiService.saveParent(form).subscribe(r => {
                this.onCancel();
                this.showStudentDetailsComponent.classValue = undefined;
                this.showStudentDetailsComponent.isDataFiltered = false;
            });
        });
    }

    onCancel(): void {
        this.studentForm.reset();
        this.parentForm.reset();
        this.loginDetailsForm.reset();
        this.isExpanded = false;
    }

    onEdit(student: StudentModel): void {
        this.studentForm.reset();
        this.parentForm.reset();
        this.loginDetailsForm.reset();
        this.isExpanded = true;
        this.showLoginForm = true;
        this.studentForm.patchValue(student);
        
        if(student.parentsIds.length) {
            student.parentsIds.forEach((id, index) => {
                this.apiService.getParentById(id).subscribe(r => {
                    this.addParent(r);
                });
            });
        }
        if(student.userId) {
            this.showLoginForm = false;
            this.apiService.getUserById(student.userId).subscribe(r => {
                this.loginDetailsForm.get('id')?.patchValue(r.id);
                this.loginDetailsForm.get('username')?.patchValue(r.username);
            });
        }
    }

    
    isFieldInvalid(field: string, form = this.studentForm): boolean {
        return this.utilService.isFieldInvalid(form, field);
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

        let pictureUrl: string;
        if(student.picture) {
            pictureUrl = this.apiService.getStudentPicture(student.picture.split('/').pop());
            student.picture = pictureUrl;
        }
        this.selectedStudent = student;
    }

    onImportFileChange(event: any): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fileToImport = file;
        }
    }

    importData(): void {
        const fileUrl = '../../../../assets/files/sample_students.xlsx'; 
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = 'sample-students.xlsx';
        anchor.click();
        this.sharedService.showBanner(BannerType.INFO, 'Add data in the downloaded file and upload it', 8000);
        this.importClicked = true;
    }

    importFile(): void {
        if(this.fileToImport) {
            this.isImporting = true;
            const formData = new FormData();
            formData.append('file', this.fileToImport);
            this.apiService.importStudentData(formData).subscribe(() => {
                this.isImporting = false;
                this.importClicked = false;
                location.reload();
            });
        }
    }
}
