import { HttpClientModule } from '@angular/common/http';
import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FullscreenButtonComponent } from '../common/fullscreen-button/fullscreen-button.component';
import { ApiService } from '../../services/api.service';
import { SessionModel } from '../../services/models';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { BannerType } from '../../services/enums';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, FullscreenButtonComponent, NgSelectModule, HttpClientModule, FormsModule],
    providers: [ApiService],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    user?: string;
    sessionsList: SessionModel[] = [];
    session!: number;

    constructor(
        private router: Router,
        private readonly authService: AuthService,
        private sharedService: SharedService,
        private readonly apiService: ApiService
    ) {

    }

    ngOnInit(): void {
        this.sharedService.updateLogStatus$.subscribe(() => {
            this.user = this.authService.getUserRole()?.toUpperCase();
        });
        this.user = this.authService.getUserRole()?.toUpperCase();
        this.apiService.getAllSessions().subscribe(r => {
            this.sessionsList = r;
            this.session = Number(this.authService.getSessionId()) || 1;
        });
    }

    logout(): void {
        this.authService.logout();
        this.sharedService.updateLogStatus();
        this.router.navigate(['/login']);
    }

    sessionChanged(event: SessionModel): void {
        const id = event.id;
        this.authService.clearSessionId();
        this.authService.setSessionId(String(id));
        this.sharedService.showBanner(BannerType.SUCCESS, 'Session changed successfully');
        setTimeout(() => location.reload(), 1000);
    }
}
