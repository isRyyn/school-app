import { ApiService } from './../../../services/api.service';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayObject, StandardModel } from '../../../services/models';
import { Action, Relation } from "../../../services/enums";
import { CommonModule } from '@angular/common';
import { Gender } from '../../../services/enums';
import { UtilService } from '../../../services/util.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { ShowStudentDetailsComponent } from "./show-student-details/show-student-details.component";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-student-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NgSelectModule, DatePickerComponent, ShowStudentDetailsComponent],
    providers: [ApiService],
    templateUrl: './student-details.component.html',
    styleUrl: './student-details.component.scss'
})
export class StudentDetailsComponent implements OnInit, AfterViewInit {
    @ViewChildren('sections') sections!: QueryList<ElementRef>;

    studentForm!: FormGroup;
    parentForm!: FormGroup;
    vehicleForm!: FormGroup;
    actionType!: string;
    isLoaded: boolean = false;
    showParentForm: boolean = false;
    parentFormCounter: number = 0;

    actions = Action;
    gender = Gender;
    relation = Relation;

    classList: StandardModel[] = [];
    genders!: Array<ArrayObject>;
    relations!: Array<ArrayObject>;

    private sectionMap: Map<string, ElementRef | undefined> = new Map();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ) { }

    ngOnInit() {
        this.fetchStudentsData();
        this.initializeArrays();
        this.loadForm();
        this.loadParentForm();
        this.route.queryParams.subscribe((params) => {
            this.actionType = params['action'];
            //this.isLoaded = true;
        });
    }

    ngAfterViewInit(): void {
        const sectionNames = ['basicDetails', 'contactDetails', 'parentsDetails', 'transportationDetails', 'utilitiesDetails'];
        this.sections.forEach((section, index) => {
            this.sectionMap.set(sectionNames[index], section);
        });
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
        this.apiService.getAllStandards().subscribe(r => {
            this.classList = r;
            this.isLoaded = true;
        });
        this.genders = this.utilService.intializeArrayWithEnums(this.gender);
        this.relations = this.utilService.intializeArrayWithEnums(this.relation);
    }

    loadForm(): void {
        this.studentForm = new FormGroup({
            id: new FormControl(),
            firstName: new FormControl(),
            middleName: new FormControl(),
            lastName: new FormControl(),
            dob: new FormControl(),
            gender: new FormControl(),
            session: new FormControl(),
            standardId: new FormControl(null, Validators.required),
            rollNo: new FormControl(),
            picture: new FormControl(),
            uDiasCode: new FormControl(),
            previousSchool: new FormControl(),
            mobile: new FormControl(),
            email: new FormControl(),
            address: new FormControl(),
            city: new FormControl(),
            state: new FormControl(),
            pincode: new FormControl(),
            uniform: new FormControl(),
            course: new FormControl(),
            vehicleName: new FormControl(),
            vehicleNumber: new FormControl(),
            vehicleRoute: new FormControl()
        });
    }

    loadParentForm(): void {
        this.parentForm = new FormGroup({
            items: new FormArray([])
        });
    }

    loadSubParentForm(): FormGroup {
        return new FormGroup({
            firstName: new FormControl(),
            middleName: new FormControl(),
            lastName: new FormControl(),
            mobile: new FormControl(),
            gender: new FormControl(),
            relation: new FormControl()
        });
    }

    goToSection(section: string): void {
        const element = this.sectionMap.get(section);
        console.log('here', element);
        if (element) {
            element.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            });
        }
    }

    get items(): FormArray {
        return this.parentForm.get('items') as FormArray;
    }

    addParent(): void {
        this.parentFormCounter++;
        if (this.parentFormCounter <= 3) {
            this.showParentForm = true;
            window.scrollBy({
                top: 300,
                behavior: 'smooth'
            });
            this.items.push(this.loadSubParentForm());
        }
    }

    onSave(): void {
        if(this.studentForm.valid) {
            console.log('form', this.studentForm.value);
            const formData = new FormData();
            const studentData = { ...this.studentForm.value };
            delete studentData['picture'];
    
            formData.append('student', JSON.stringify(studentData));
            if(this.studentForm.value?.picture) {
                 //this.utilService.convertToBase64(this.studentForm.value.picture[0])
                formData.append('picture', this.studentForm.get('picture')?.value);
            }
    
            this.apiService.saveStudent(formData).subscribe(response => {
                console.log('Student saved successfully', response);
                this.onCancel();
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.studentForm.patchValue({
                picture: file
            });
        }
    }
}
