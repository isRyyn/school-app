import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [LoaderLineComponent, CommonModule],
    providers: [ApiService],
    templateUrl: './admin-home.component.html',
    styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit {

    isDataLoaded: boolean = false;
    statsMap: Map<string, number> = new Map();

    constructor(
        private readonly apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.apiService.getCount().subscribe((r:any) => {
            this.statsMap.set('Students', r.students);
            this.statsMap.set('Teachers', r.teachers);
            this.statsMap.set('Classes', r.classes);

            this.statsMap.set('Subjects', r.subjects);
            this.statsMap.set('Vehicles', r.vehicles);
            this.statsMap.set('Pages', r.pages);
            this.isDataLoaded = true;
        });
    }
}
