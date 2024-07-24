import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionModel } from '../../../services/models';
import { Action } from "../../../services/enums";
import { TransactionType } from "../../../services/enums";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-manage-expenses',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DatePickerComponent],
  providers: [ApiService],
  templateUrl: './manage-expenses.component.html',
  styleUrl: './manage-expenses.component.scss'
})
export class ManageExpensesComponent implements OnInit {
    transactions: TransactionModel[] = [];
    expenseForm!: FormGroup;
    isActionPrimary = false;
    action = Action;
    actionType!: string;
    isLoaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.loadForm();
        this.route.queryParams.subscribe((params) => {
            this.actionType = params['action'];

            if(this.actionType == this.action.TERTIARY) {
                this.apiService.getAllTransactions().subscribe(r => this.transactions = r);
            }
            this.isLoaded = true;
        });

    }

    loadForm(): void {
        this.expenseForm = new FormGroup({
            amount: new FormControl('', Validators.required),
            category: new FormControl(),
            date: new FormControl(new Date())
        });
    }

    get selectedType(): TransactionType {
        if(this.actionType == this.action.PRIMARY) {
            return TransactionType.INCOME;
        } else if (this.actionType == this.action.SECONDARY) {
            return TransactionType.EXPENSE;
        }
        return TransactionType.INCOME;
    }

    onSave(): void {
        if(this.expenseForm.valid) {
            const payload = {
                ...this.expenseForm.value,
                type: this.selectedType
            };
    
            this.apiService.saveTransaction(payload).subscribe(() => {
                alert('Transaction completed!');
                this.router.navigate(['private/admin-dashboard']);
            });
        } else {
            this.expenseForm.get('amount')?.markAsTouched()
        }
        
    }

    onCancel(): void {
        this.router.navigate(['/private/admin-dashboard']);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.expenseForm, field);
    }
}
