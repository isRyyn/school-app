import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SideNavComponent } from "./side-nav/side-nav.component";
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { BannerComponent } from "../common/banner/banner.component";

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterModule, SideNavComponent, CommonModule, BannerComponent],
    providers: [ApiService],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
    isExpanded: boolean = true;

    constructor(
    ) { }

    ngOnInit(): void {
    }
}
