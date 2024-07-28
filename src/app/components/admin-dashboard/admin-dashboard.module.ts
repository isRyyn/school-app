import { ManageSessionsComponent } from './manage-sessions/manage-sessions.component';
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
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ManagePagesComponent } from './manage-pages/manage-pages.component';
import { DynamicPageComponent } from './manage-pages/dynamic-page/dynamic-page.component';
import { ManageVehiclesComponent } from './manage-vehicles/manage-vehicles.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';

const adminRoutes: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        children: [
            { path: '', component: AdminHomeComponent },
            { path: 'students', component: StudentDetailsComponent },
            { path: 'teachers', component: ManageTeachersComponent },
            { path: 'fees', component: FeeDetailsComponent },
            { path: 'marks', component: MarksDetailsComponent },
            { path: 'expenses', component: ManageExpensesComponent },
            { path: 'classes', component: ManageClassesComponent },
            { path: 'subjects', component: ManageSubjectsComponent },
            { path: 'users', component: ManageUsersComponent },
            { path: 'sessions', component: ManageSessionsComponent },
            { path: 'vehicles', component: ManageVehiclesComponent },
            { path: 'pages', component: ManagePagesComponent },
            { path: 'section', component: DynamicPageComponent }
        ]
    }
];


@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(adminRoutes),
        HttpClientModule
    ]
})
export class AdminDashboardModule { }
