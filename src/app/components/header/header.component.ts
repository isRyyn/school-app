import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    isLoggedIn?: boolean = false;
    isExpanded: boolean = true;
    user: string = 'Admin';

    constructor(
        private router: Router,
        private sharedService: SharedService
    ) {

    }

    ngOnInit(): void {
        this.sharedService.isLoggedIn$.subscribe(response => this.isLoggedIn = response);
    }

    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }

    updateSideNav(): void { 
        this.isExpanded = !this.isExpanded;
        this.sharedService.updateSideNav();
    }
}
