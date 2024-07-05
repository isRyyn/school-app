import { Routes } from '@angular/router';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
//import { FeeDetailsComponent } from './admin/fee-details/fee-details.component';
//import { MarksDetailsComponent } from './admin/marks-details/marks-details.component';

export const adminRoutes: Routes = [
  { 
    path: '', 
    component: AdminDashboardComponent, 
    children: [
        { path: 'student-details', component: StudentDetailsComponent }
    ]
  }
];
