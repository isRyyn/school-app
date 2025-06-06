import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFeesComponent } from './student-fees/student-fees.component';
import { StudentMarksComponent } from './student-marks/student-marks.component';
import { StudentInfoComponent } from './student-info/student-info.component';
import { Route, RouterModule } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard.component';
import { FeeDetailsComponent } from "../admin-dashboard/fee-details/fee-details.component";
import { ViewStudentComponent } from "../admin-dashboard/student-details/view-student/view-student.component";
import { ApiService } from '../../services/api.service';
import { CachingInterceptor } from '../../services/caching-interceptor';
import { AuthInterceptor } from '../../services/auth.interceptor';

const studentRoutes: Route[] = [
    {
        path: '',
        component: StudentDashboardComponent,
        children: [
            {
                path: 'info',
                component: StudentInfoComponent
            },
            {
                path: 'fees',
                component: StudentFeesComponent
            },
            {
                path: 'marks',
                component: StudentMarksComponent
            }
        ]
    }
]


@NgModule({
    declarations: [
        StudentDashboardComponent,
        StudentFeesComponent,
        StudentMarksComponent,
        StudentInfoComponent
    ],
    imports: [
        RouterModule.forChild(studentRoutes),
        CommonModule,
        HttpClientModule,
        FeeDetailsComponent,
        ViewStudentComponent
    ],
    providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
})
export class StudentDashboardModule { }
