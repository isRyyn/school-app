import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  providers: [ApiService],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit {
    statsMap: Map<string, number> = new Map();

    constructor(
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {
        this.statsMap.set('Students', 1000);
        this.statsMap.set('Teachers', 120);
        this.statsMap.set('Classes', 12);

        this.statsMap.set('Subjects', 25);
        this.statsMap.set('Vehicles', 10);
        this.statsMap.set('Balance', 320000);
    }


}
