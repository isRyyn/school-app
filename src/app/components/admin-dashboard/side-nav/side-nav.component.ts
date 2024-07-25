import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-side-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './side-nav.component.html',
    styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
    @Input() isExpanded: boolean = true;
    navbarPosition: string = '60px';

    constructor(
        private readonly router: Router,
        private readonly sharedService: SharedService
    ) { }

    ngOnInit(): void {

    }

    goToPath(path: string): void {
        this.router.navigate([`private/admin-dashboard/${path}`]);
    }


    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (window.pageYOffset > 60) {
            this.navbarPosition = '0';
        } else {
            this.navbarPosition = '60px';
        }
    }
}
