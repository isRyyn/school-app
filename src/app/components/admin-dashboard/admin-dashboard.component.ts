import { Transaction, TransactionType, Action } from './../../services/models';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SharedService } from '../../services/shared.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterModule],
    providers: [ApiService],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
    action = Action;
    transactions: Transaction[] = [];
    availableAmount = 0;

    constructor(
        private router: Router,
        private readonly apiService: ApiService,
        private readonly sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.calculateTotal();
    }

    calculateTotal(): void {
        this.apiService.getAllTransactions().subscribe(response => { 
            this.transactions = response;
            this.sharedService.setTransactionsList(response);
            this.availableAmount = this.getAmount(TransactionType.INCOME) - this.getAmount(TransactionType.EXPENSE);    
        });
    }

    getAmount(type: TransactionType): number {
        const filteredTransactions = this.transactions.filter(x => x.type == type).map(y => y.amount);
        return filteredTransactions.reduce((a, b) => {
            return a + b;
        }, 0);
    }   

    goToPath(path: string, actionType: Action): void {
        this.router.navigate([`/private/admin-dashboard/${path}`], {
            queryParams: { action: actionType }
        });
    }
}
