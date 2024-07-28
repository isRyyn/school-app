import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StudentModel } from '../../services/models';

@Component({
  selector: 'app-student-dashboard',
  providers: [ApiService ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
    studentId!: number;
    isDataLoaded: boolean = false;

    studentData!: StudentModel;

    constructor(
        private authService: AuthService,
        private readonly apiService: ApiService,
        private readonly router: Router
    ) {  
    }

    ngOnInit(): void {
        this.studentId = Number(this.authService.getUserId());
        this.apiService.getStudentById(this.studentId).subscribe(r => {
            this.studentData = r;
        });
    }

    goToSection(section?: string): void {
        this.router.navigate([`/private/student-dashboard/${section}`], {
            queryParams: { id: this.studentId }
        });
    }

    get showMainContent(): boolean {
        return this.router.url == '/private/student-dashboard';
    }
}
