import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentModel } from '../../../services/models';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.scss'
})
export class StudentInfoComponent implements OnInit {
    isDataLoaded: boolean = false;
    studentData!: StudentModel;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly apiService: ApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            const studentId = params['id'];
            this.apiService.getStudentById(studentId).subscribe(r => {
                this.studentData = r;
                this.isDataLoaded = true;
            });
        });
        
    }

    goBack(): void {
        this.router.navigate(['/private/student-dashboard']);
    }
}
