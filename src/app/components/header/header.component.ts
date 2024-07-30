import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FullscreenButtonComponent } from '../common/fullscreen-button/fullscreen-button.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, FullscreenButtonComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    user?: string;

    constructor(
        private router: Router,
        private readonly authService: AuthService,
        private sharedService: SharedService
    ) {

    }

    ngOnInit(): void {
        this.sharedService.updateLogStatus$.subscribe(() => {
            this.user = this.authService.getUserRole()?.toUpperCase();
        });
        this.user = this.authService.getUserRole()?.toUpperCase();
    }

    logout(): void {
        this.authService.logout();
        this.sharedService.updateLogStatus();
        this.router.navigate(['/login']);
    }
}
