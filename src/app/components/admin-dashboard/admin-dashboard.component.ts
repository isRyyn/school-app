import { TransactionModel } from './../../services/models';
import { Action } from "../../services/enums";
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SideNavComponent } from "./side-nav/side-nav.component";
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterModule, SideNavComponent, CommonModule],
    providers: [ApiService],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
    action = Action;
    transactions: TransactionModel[] = [];
    availableAmount = 0;
    isExpanded: boolean = true;

    constructor(
        private router: Router,
        private readonly sharedService: SharedService,
        private readonly apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.sharedService.updateSideNav$.subscribe(r => this.isExpanded = r);
    } 

    goToPath(path: string, actionType?: Action): void {
        this.router.navigate([`/private/admin-dashboard/${path}`], {
            queryParams: { action: actionType }
        });
    }
}
