import { TransactionType } from './../../../services/enums';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArrayObject, TransactionModel } from '../../../services/models';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { DatePickerComponent } from "../../common/date-picker/date-picker.component";
import { UtilService } from '../../../services/util.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-manage-expenses',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, DatePickerComponent, NgSelectModule],
    providers: [ApiService],
    templateUrl: './manage-expenses.component.html',
    styleUrl: './manage-expenses.component.scss'
})
export class ManageExpensesComponent implements OnInit {
    transactions: TransactionModel[] = [];
    transactionTypeList: Array<ArrayObject> = [];
    expenseForm!: FormGroup;
    isLoaded: boolean = false;
    availableAmount: number = 0;

    sortMap = new Map<string, boolean>([
        ['amount', false],
        ['type', false],
        ['date', false],
        ['category', false]
    ]);

    constructor(
        private apiService: ApiService,
        private readonly utilService: UtilService
    ) { }

    ngOnInit(): void {
        this.loadForm();
        this.transactionTypeList = this.utilService.intializeArrayWithEnums(TransactionType);
        this.loadData();
    }

    loadData(): void {
        this.isLoaded = false;
        this.apiService.getAllTransactions().subscribe(response => {
            this.transactions = response;
            this.transactions.sort((a, b) => b.id - a.id);
            this.availableAmount = this.getAmount('INCOME') - this.getAmount('EXPENSE');
            setTimeout(() => this.isLoaded = true, 100);
        });
    }

    getAmount(type: string): number {
        const filteredTransactions = this.transactions.filter(x => x.type == type).map(y => y.amount);
        return filteredTransactions.reduce((a, b) => {
            return a + b;
        }, 0);
    }

    loadForm(): void {
        this.expenseForm = new FormGroup({
            amount: new FormControl(null, Validators.required),
            category: new FormControl(),
            date: new FormControl(new Date()),
            type: new FormControl(null, Validators.required)
        });
    }

    sortTable(key: string) {
        this.isLoaded = false;
        const order = this.sortMap.get(key);
        
        const compare = (a: any, b: any): number => {
            if (key === 'amount') {
                return order ? a.amount - b.amount : b.amount - a.amount;
            } else if (key === 'type' || key === 'date' || key === 'category') {
                return order ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
            }
            return 0;
        };
        
        this.transactions.sort(compare);
        this.sortMap.set(key, !order);
        this.isLoaded = true;
    }
    

    onSave(): void {
        if (this.expenseForm.valid) {
            this.apiService.saveTransaction(this.expenseForm.value).subscribe(() => {
                alert('Transaction completed!');
                this.onReset();
                this.loadData();
            });
        } else {
            this.expenseForm.get('amount')?.markAsTouched()
        }

    }

    onReset(): void {
        this.expenseForm.reset({
            date: new Date()
        });
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.expenseForm, field);
    }
}
