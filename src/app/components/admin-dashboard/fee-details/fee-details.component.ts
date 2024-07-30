import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { ArrayObject, FeeModel, StudentModel } from '../../../services/models';
import { Month } from '../../../services/enums';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from '../../../services/auth.service';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";

@Component({
  selector: 'app-fee-details',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, StudentSelectComponent, DatePickerComponent, ActionSelectComponent],
  providers: [ApiService],
  templateUrl: './fee-details.component.html',
  styleUrl: './fee-details.component.scss'
})
export class FeeDetailsComponent implements OnInit {
    @Input() studentId?: number;
    @Output() goBackEvent: EventEmitter<void> = new EventEmitter();
    feeForm!: FormGroup;
    studentSelectForm!: FormGroup
    month = Month;
    monthsList: Array<ArrayObject> = [];

    isDataFiltered: boolean = false;
    filteredFeesList: FeeModel[] = [];

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly authService: AuthService
    ){}

    ngOnInit(): void {
        this.monthsList = this.utilService.intializeArrayWithEnums(this.month);
        if(this.studentId) {
            this.onStudentChange(this.studentId);
        } else {
            this.loadForm();
        }
    }

    loadForm(): void {
        this.feeForm = new FormGroup({
            id: new FormControl(),
            studentId: new FormControl(null, Validators.required),
            amount: new FormControl('', Validators.required),
            month: new FormControl(),
            date: new FormControl(new Date()),
            sessionId: new FormControl()
        });

        this.studentSelectForm = new FormGroup({
            studentId: new FormControl()
        });
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.feeForm, field);
    }

    onSave(): void {
        const payload = {
            ...this.feeForm.value,
            sessionId: this.authService.getSessionId()
        };
        this.apiService.saveFee(payload).subscribe(r => {
            this.onStudentChange(this.feeForm.value.studentId);
            this.feeForm.reset({
                date: new Date(),
                studentId: this.feeForm.value.studentId
            });
            
        });
    }

    onReset(): void {
        this.feeForm.reset({
            date: new Date()
        });
    }

    onEdit(fee: FeeModel): void {
        this.feeForm.reset();
        this.feeForm.patchValue(fee);
    }

    onAction(action: string, fee: FeeModel): void {
        if(action == 'edit') {
            this.feeForm.reset();
            this.feeForm.patchValue(fee);
        } else if(action == 'delete') {
            this.apiService.deleteFee(fee.id).subscribe(() => {
                this.feeForm.reset();
                this.studentSelectForm.reset();
                this.isDataFiltered = false;
            });
        }
    }

    onStudentChange(studentId?: number): void {
        this.isDataFiltered = false;
        if(studentId) {
            this.apiService.getAllFeesByStudentId(studentId).subscribe(r => {
                this.filteredFeesList = r;
                this.isDataFiltered = true;
            });
        }
    }

    goBack(): void {
        this.goBackEvent.emit();
    }
}
