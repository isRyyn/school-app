import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { ArrayObject, FeeModel, StandardModel, StudentModel } from '../../../services/models';
import { BannerType, Month } from '../../../services/enums';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../../services/auth.service';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";
import { forkJoin } from 'rxjs';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";
import { SharedService } from '../../../services/shared.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
    selector: 'app-fee-details',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, StudentSelectComponent, DatePickerComponent, ActionSelectComponent, LoaderLineComponent, MatSlideToggleModule ],
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
    importClicked!: boolean;
    isImporting!: boolean;

    fileToImport!: File;

    fullFeeList: FeeModel[]= [];
    filteredFeesList: FeeModel[] = [];
    studentsList: StudentModel[] = [];
    standardsList: StandardModel[] = [];

    nameSearch = null;
    monthSearch = null;
    standardSearch = null;
    uniqueIdSearch = null;

    filteredTotal: string = '';
    showFilteredTotal = false;

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly authService: AuthService,
        private readonly sharedService: SharedService
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
            other2: new FormControl(),
            other3: new FormControl(),
            copies: new FormControl(),
            dress: new FormControl(),
            shoes: new FormControl(),
            tieBelt: new FormControl(),
            socks: new FormControl(),
            van: new FormControl(),
            diary: new FormControl(),
            month: new FormControl(null, Validators.required),
            date: new FormControl(new Date(), Validators.required),
            sessionId: new FormControl(),
            notes: new FormControl(),
            uniqueId: new FormControl(),
            discount: new FormControl(),
            foc: new FormControl(false)
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
             + values.socks + values.other + values.other2 + values.other3;
            this.feeForm.get('total')?.setValue(total, { emitEvent: false });

            const deposited = this.feeForm.value.deposited;
            const discount = this.feeForm.value.discount;

            if(values.foc !== true) {
                this.feeForm.get('remaining')?.setValue(total - deposited, { emitEvent: false });

                if(values.discount) {
                    this.feeForm.get('remaining')?.setValue(total - (deposited + discount), { emitEvent: false });
                }
            }
        });
    }

    focChanged(val: boolean): void {
        if (val === true) {
            this.feeForm.get('remaining')?.setValue(0, { emitEvent: false });
            this.feeForm.get('deposited')?.patchValue(null);
            this.feeForm.get('deposited')?.disable();
            this.feeForm.get('discount')?.patchValue(null);
            this.feeForm.get('discount')?.disable();
        } else if (val === false) {
            this.feeForm.get('deposited')?.enable();
            this.feeForm.get('discount')?.enable();
        }
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
                location.reload();
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
        return `${student?.firstName} ${student?.lastName || ''}`;
    }

    getStudentParent(studentId: number): string {
        const parentId = this.studentsList.find(x => x.id == studentId)?.parentsIds[0];
        if(parentId) {
            this.apiService.getParentById(parentId).subscribe(r => {
                return r.firstName;
            });
        }
        return '';
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
            this.monthSearch = this.standardSearch = this.uniqueIdSearch = null;
            const ids = this.studentsList.filter(x => x.id == value)?.map(y => y.id);
            this.filteredFeesList = this.fullFeeList.filter(x => ids.includes(x.studentId));
            this.isDataFiltered = true;

        } else if(property == 'month') {
            this.nameSearch = this.standardSearch = this.uniqueIdSearch = null;
            this.filteredFeesList = this.fullFeeList.filter(x => x.month.toLowerCase().includes(value.toLowerCase()));
            this.isDataFiltered = true;

        } else if(property == 'class') {
            this.nameSearch = this.monthSearch = this.uniqueIdSearch = null;
            const ids = this.standardsList.filter(x => x.id == value)?.map(y => y.id);
            this.filteredFeesList = this.fullFeeList.filter(x => ids.includes(x.standardId));
            this.isDataFiltered = true;

        } else if(property == 'uniqueId') {
            this.nameSearch = this.monthSearch = this.standardSearch = null;        
            this.filteredFeesList = this.fullFeeList.filter(x => x.uniqueId?.toString().includes(value));
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

    onImportFileChange(event: any): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fileToImport = file;
        }
    }

    importData(): void {
        const fileUrl = '../../../../assets/files/sample_fees.xlsx'; 
        const anchor = document.createElement('a');
        anchor.href = fileUrl;
        anchor.download = 'sample-fees.xlsx';
        anchor.click();
        this.sharedService.showBanner(BannerType.INFO, 'Add data in the downloaded file and upload it', 8000);
        this.importClicked = true;
    }

    importFile(): void {
        if(this.fileToImport) {
            this.isImporting = true;
            const formData = new FormData();
            formData.append('file', this.fileToImport);
            this.apiService.importFeesData(formData).subscribe(() => {
                this.isImporting = false;
                this.importClicked = false;
                location.reload();
            });
        }
    }

    totalToggle(event: any): void {
        this.showFilteredTotal = event.checked;
    }
}
