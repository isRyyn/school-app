import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { PageModel } from '../../../services/models';
import { ApiService } from '../../../services/api.service';
import { query } from '@angular/animations';

@Component({
    selector: 'app-side-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './side-nav.component.html',
    styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
    @Input() isExpanded: boolean = true;
    @Output() emitState: EventEmitter<boolean> = new EventEmitter();

    pageList: PageModel[] = [];
    pagesLoaded: boolean = false;
    isScreenLarge: boolean = true;

    constructor(
        private readonly router: Router,
        private readonly sharedService: SharedService,
        private readonly apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.apiService.getAllPages().subscribe(r => {
            this.pageList = r;
            this.pagesLoaded = true;
        });
    }

    goToPath(path: string): void {
        this.router.navigate([`private/admin-dashboard/${path}`]);
    }

    goToSection(id: number): void {
        this.router.navigate(['/private/admin-dashboard/section'], { queryParams: { id: id } });
    }

    isPathSelected(path: string, id?: number): boolean {
        if (id) {     
            return this.router.url == `/private/admin-dashboard/${path}?id=${id}`;
        } else if(path) {
            return this.router.url == `/private/admin-dashboard/${path}`;
        } else {
            return this.router.url == `/private/admin-dashboard`;
        }
    }


    updateSideNav(): void {
        this.isExpanded = !this.isExpanded;
        this.emitState.emit(this.isExpanded);
    }
}
