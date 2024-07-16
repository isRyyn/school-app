import { ApiService } from './../../../services/api.service';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArrayObject } from '../../../services/models';
import { Action, Relation } from "../../../services/enums";
import { CommonModule } from '@angular/common';
import { Gender, Standard } from '../../../services/enums';
import { UtilService } from '../../../services/util.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
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
    standard = Standard;
    gender = Gender;
    relation = Relation;

    classList!: Array<ArrayObject>;
    genders!: Array<ArrayObject>;
    relations!: Array<ArrayObject>;

    private sectionMap: Map<string, ElementRef | undefined> = new Map();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly ApiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit() {
        this.initializeArrays();
        this.loadForm();
        this.loadParentForm();
        this.route.queryParams.subscribe((params) => {
            this.actionType = params['action'];
            this.isLoaded = true;
        });
    }

    ngAfterViewInit(): void {
        const sectionNames = ['basicDetails', 'contactDetails', 'parentsDetails', 'transportationDetails', 'utilitiesDetails'];
        this.sections.forEach((section, index) => {
            this.sectionMap.set(sectionNames[index], section);
        });
    }

    initializeArrays(): void {
        this.classList = this.utilService.intializeArrayWithEnums(this.standard);
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
            gender: new FormControl(''),
            session: new FormControl(),
            standard: new FormControl(''),
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
        if(element) {
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
        if(this.parentFormCounter <= 3) {
            this.showParentForm = true;
            window.scrollBy({
                top: 300,
                behavior: 'smooth'
            });
            this.items.push(this.loadSubParentForm());
        }
    }

    onSave(): void {
        console.log('form', this.studentForm.value); 
        this.utilService.convertToBase64(this.studentForm.value.picture[0])
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }
}
