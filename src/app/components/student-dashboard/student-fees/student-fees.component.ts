import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-student-fees',
    templateUrl: './student-fees.component.html',
    styleUrl: './student-fees.component.scss'
})
export class StudentFeesComponent implements OnInit {
    isDataLoaded: boolean = false;
    studentId!: number;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            this.studentId = params['id'];
            this.isDataLoaded = true;
        });
    }

    goBack(): void {
        this.router.navigate(['/private/student-dashboard']);
    }
}
