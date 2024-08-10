import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { StudentGuard } from './guards/student.guard';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { TeacherGuard } from './guards/teacher.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'private/admin-dashboard',
        loadChildren: () => import('./components/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),
        canActivate: [AdminGuard]
    },
    {
        path: 'private/student-dashboard',
        loadChildren: () => import('./components/student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule),
        canActivate: [StudentGuard]
    },
    {
        path: 'private/teacher-dashboard',
        loadChildren: () => import('./components/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule),
        canActivate: [TeacherGuard]
    }
];