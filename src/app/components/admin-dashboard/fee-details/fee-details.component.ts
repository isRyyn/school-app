import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../../services/util.service';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { ArrayObject } from '../../../services/models';
import { Month } from '../../../services/enums';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";

@Component({
  selector: 'app-fee-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StudentSelectComponent, DatePickerComponent],
  providers: [ApiService],
  templateUrl: './fee-details.component.html',
  styleUrl: './fee-details.component.scss'
})
export class FeeDetailsComponent implements OnInit {
    feeForm!: FormGroup;
    month = Month;
    monthsList: Array<ArrayObject> = [];

    constructor(
        private readonly router: Router,
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.monthsList = this.utilService.intializeArrayWithEnums(this.month);
        this.loadForm();
    }

    loadForm(): void {
        this.feeForm = new FormGroup({
            id: new FormControl(),
            student: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
            month: new FormControl(''),
            date: new FormControl(new Date())
        });
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.feeForm, field);
    }

    onSave(): void {
        console.log('form', this.feeForm.value);
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }
}
