import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Action, Transaction, TransactionType } from '../../../services/models';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-manage-expenses',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [ApiService],
  templateUrl: './manage-expenses.component.html',
  styleUrl: './manage-expenses.component.scss'
})
export class ManageExpensesComponent implements OnInit {
    transactions: Transaction[] = [];
    expenseForm!: FormGroup;
    isActionPrimary = false;
    action = Action;
    actionType!: string;
    isLoaded: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private apiService: ApiService,
        private readonly sharedService: SharedService
    ){}

    ngOnInit(): void {
        this.loadForm();
        this.route.queryParams.subscribe((params) => {
            this.actionType = params['action'];

            if(this.actionType == this.action.TERTIARY) {
                this.transactions =  this.sharedService.getTransactionsList();
            }
            this.isLoaded = true;
        });

    }

    loadForm(): void {
        this.expenseForm = new FormGroup({
            amount: new FormControl(),
            category: new FormControl(),
            date: new FormControl()
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

    onSubmit(): void {
        const payload = {
            ...this.expenseForm.value,
            type: this.selectedType
        };

        this.apiService.saveTransaction(payload).subscribe(() => {
            alert('Transaction completed!');
            this.router.navigate(['private/admin-dashboard']);
        });
        
    }
}
