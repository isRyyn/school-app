import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { ArrayObject, FeeModel, StandardModel, StudentModel } from '../../../services/models';
import { Month } from '../../../services/enums';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../../services/auth.service';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";
import { forkJoin } from 'rxjs';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

@Component({
    selector: 'app-fee-details',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, StudentSelectComponent, DatePickerComponent, ActionSelectComponent, LoaderLineComponent],
    providers: [ApiService],
    templateUrl: './fee-details.component.html',
    styleUrl: './fee-details.component.scss'
})
export class FeeDetailsComponent implements OnInit {
    @Input() studentId?: number;
    @Output() goBackEvent: EventEmitter<void> = new EventEmitter();
    @ViewChild('download', { static: false }) contentToDownload!: ElementRef;

    feeForm!: FormGroup;
    studentSelectForm!: FormGroup
    month = Month;
    monthsList: Array<ArrayObject> = [];
    monthSearchList: Array<ArrayObject> = [];

    isDataFiltered: boolean = false;
    isExpanded: boolean = false;

    fullFeeList: FeeModel[]= [];
    filteredFeesList: FeeModel[] = [];
    studentsList: StudentModel[] = [];
    standardsList: StandardModel[] = [];

    nameSearch = null;
    monthSearch = null;
    standardSearch = null;

    filteredTotal: string = '';

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly authService: AuthService
    ) { }

    ngOnInit(): void {
        this.monthsList = this.utilService.intializeArrayWithEnums(this.month);
        if (this.studentId) {
            this.onStudentChange(this.studentId);
        } else {
            this.loadForm();
            this.loadData();
        }
    }

    loadForm(): void {
        this.feeForm = new FormGroup({
            id: new FormControl(),
            studentId: new FormControl(null, Validators.required),
            standardId: new FormControl(),
            monthly: new FormControl(),
            deposited: new FormControl(null, Validators.required),
            remaining: new FormControl({ value: null, disabled: true}),
            total: new FormControl({ value: null, disabled: true }, Validators.required),
            registration: new FormControl(),
            course: new FormControl(),
            other: new FormControl(),
            copies: new FormControl(),
            dress: new FormControl(),
            shoes: new FormControl(),
            tieBelt: new FormControl(),
            socks: new FormControl(),
            van: new FormControl(),
            diary: new FormControl(),
            month: new FormControl(null, Validators.required),
            date: new FormControl(new Date(), Validators.required),
            sessionId: new FormControl()
        });

        this.studentSelectForm = new FormGroup({
            studentId: new FormControl()
        });

        this.calculateDeposited();
    }

    calculateDeposited(): void {
        this.feeForm.valueChanges.subscribe(values => {
            const total = values.monthly + values.registration + values.course + values.copies
             + values.dress + values.shoes + values.diary + values.tieBelt + values.van 
             + values.socks + values.other;
            this.feeForm.get('total')?.setValue(total, { emitEvent: false });

            const deposited = this.feeForm.value.deposited;
            this.feeForm.get('remaining')?.setValue(total - deposited);
        });
    }

    loadData(): void {
        forkJoin({
            fee: this.apiService.getAllFee(),
            students: this.apiService.getAllStudents(),
            standard: this.apiService.getAllStandards()
        }).subscribe(r => {
            this.fullFeeList = this.filteredFeesList = r.fee;
            this.calculateTotal();
            this.studentsList = r.students;
            this.standardsList = r.standard;
            this.isDataFiltered = true;
        })
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.feeForm, field);
    }

    onSave(): void {
        if(this.feeForm.valid) {
            const payload = {
                ...this.feeForm.getRawValue(),
                sessionId: this.authService.getSessionId()
            };
            this.apiService.saveFee(payload).subscribe(r => {
                this.feeForm.reset({
                    date: new Date()
                });
                this.studentSelectForm.reset();
                this.isDataFiltered = false;
                this.isExpanded = false;
                this.apiService.getAllFee().subscribe(x => {
                    this.fullFeeList = this.filteredFeesList = x;
                    this.isDataFiltered = true;
                });
            });
        } else {
            this.feeForm.markAllAsTouched();
        }
        
    }

    onReset(): void {
        this.feeForm.reset({
            date: new Date()
        });
        this.isExpanded = false;
    }

    onAction(action: string, fee: FeeModel): void {
        if (action == 'edit') {
            this.feeForm.reset();
            this.isExpanded = true;
            this.feeForm.patchValue({
                ...fee,
                date: new Date(fee.date)
            });
        } else if (action == 'delete') {
            this.apiService.deleteFee(fee.id).subscribe(() => {
                this.feeForm.reset({
                    date: new Date()
                });
                this.studentSelectForm.reset();
                this.fullFeeList = this.fullFeeList.filter(x => x.id != fee.id);
                this.filteredFeesList = this.fullFeeList;
            });
        }
    }

    onStudentChange(studentId?: number): void {
        this.isDataFiltered = false;
        if (studentId) {
            this.apiService.getAllFeesByStudentId(studentId).subscribe(r => {
                this.filteredFeesList = r;
                this.isDataFiltered = true;
            });
        }
    }

    goBack(): void {
        this.goBackEvent.emit();
    }

    expandSection(): void {
        this.isExpanded = !this.isExpanded;
    }

    getStudent(studentId: number): string {
        const student = this.studentsList.find(x => x.id == studentId);
        return `${student?.firstName} ${student?.lastName}`;
    }

    getClass(standardId: number): string {
        const standard = this.standardsList.find(x => x.id == standardId);
        return standard?.name ?? '';
    }

    searchBy(event: any, property: string): void {
        this.filteredTotal = '';
        this.isDataFiltered = false;
        const value = event?.value ?? '';

        if(value == '') {
            this.filteredFeesList = this.fullFeeList;
            this.isDataFiltered = true;
            return;
        }
        if(property == 'student') {
            this.monthSearch = this.standardSearch = null;
            const ids = this.studentsList.filter(x => x.id == value)?.map(y => y.id);
            this.filteredFeesList = this.fullFeeList.filter(x => ids.includes(x.studentId));
            this.isDataFiltered = true;

        } else if(property == 'month') {
            this.nameSearch = this.standardSearch = null;
            this.filteredFeesList = this.fullFeeList.filter(x => x.month.toLowerCase().includes(value.toLowerCase()));
            this.isDataFiltered = true;

        } else if(property == 'class') {
            this.nameSearch = this.monthSearch = null;
            const ids = this.standardsList.filter(x => x.id == value)?.map(y => y.id);
            this.filteredFeesList = this.fullFeeList.filter(x => ids.includes(x.standardId));
            this.isDataFiltered = true;
        }
        this.calculateTotal();
    }

    calculateTotal(): void {
        const total = this.filteredFeesList.reduce((x ,y) => {
           return x + y.total
        }, 0);
        
        const deposit = this.filteredFeesList.reduce((x,y) => {
            return x + y.deposited
        }, 0);

        let final = `Total = ${total}, `;
        final += `Deposited = ${deposit}, `;
        final += `Remaining = ${total - deposit}`;
        this.filteredTotal = final;
    }

    download(): void {
        this.utilService.download(this.contentToDownload, 'fees');
    }
}
