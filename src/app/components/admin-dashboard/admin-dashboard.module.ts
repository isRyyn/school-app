import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { FeeDetailsComponent } from './fee-details/fee-details.component';
import { MarksDetailsComponent } from './marks-details/marks-details.component';
import { StudentDetailsComponent } from './student-details/student-details.component';
import { ManageExpensesComponent } from './manage-expenses/manage-expenses.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';

const adminRoutes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'student-details', component: StudentDetailsComponent },
  { path: 'fee-details', component: FeeDetailsComponent },
  { path: 'marks-details', component: MarksDetailsComponent }, 
  { path: 'manage-expenses', component: ManageExpensesComponent },
  { path: 'manage-classes', component: ManageClassesComponent},
  { path: 'manage-subjects', component: ManageSubjectsComponent }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(adminRoutes),
    HttpClientModule
  ]
})
export class AdminDashboardModule { }
