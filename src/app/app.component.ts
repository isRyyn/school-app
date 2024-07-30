import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/common/loader/loader.component";
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { BannerComponent } from "./components/common/banner/banner.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterModule, LoginComponent, HeaderComponent, LoaderComponent, CommonModule, BannerComponent, FooterComponent]
})
export class AppComponent implements OnInit {
    title = 'school-app';
    isLoggedIn: boolean = false;
    showLoader: boolean = true;

    constructor(
        private readonly authService: AuthService,
        private readonly sharedService: SharedService,
        private readonly router: Router
    ) {
        this.skipLoginPage();
    }

    ngOnInit(): void {
        this.hideLoader();
        this.isLoggedIn = this.authService.isLoggedIn();
        this.sharedService.updateLogStatus$.subscribe(() => {
            this.isLoggedIn = this.authService.isLoggedIn();
        });
    }

    skipLoginPage(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart || event instanceof NavigationEnd) {
                if (this.authService.isLoggedIn() && event.url === '/login') {
                    this.router.navigate([`/private/${this.authService.getUserRole()?.toLowerCase()}-dashboard`]);
                }
            }
        });
    }

    hideLoader(): void {
        setTimeout(() => this.showLoader = false, 3000);
    }
}
