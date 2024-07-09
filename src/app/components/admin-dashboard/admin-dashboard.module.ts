import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { FeeDetailsComponent } from './fee-details/fee-details.component';
import { MarksDetailsComponent } from './marks-details/marks-details.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

const adminRoutes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'student-details', component: StudentDetailsComponent },
  { path: 'fee-details', component: FeeDetailsComponent },
  { path: 'marks-details', component: MarksDetailsComponent }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(adminRoutes),
    HttpClientModule
  ]
})
export class AdminDashboardModule { }
