import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { TeacherDashboardComponent } from "./teacher-dashboard.component";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ApiService } from "../../services/api.service";
import { MarksDetailsComponent } from "../admin-dashboard/marks-details/marks-details.component";
import { CachingInterceptor } from "../../services/caching-interceptor";
import { AuthInterceptor } from "../../services/auth.interceptor";

const teacherRoutes: Route[] = [
    {
        path: '',
        component: TeacherDashboardComponent
    }
]

@NgModule({
    declarations: [
        TeacherDashboardComponent
    ],
    imports: [
        RouterModule.forChild(teacherRoutes),
        CommonModule,
        HttpClientModule,
        MarksDetailsComponent
    ],
    providers: [
        ApiService,
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
})


export class TeacherDashboardModule{}