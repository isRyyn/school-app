import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { TeacherDashboardComponent } from "./teacher-dashboard.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ApiService } from "../../services/api.service";
import { MarksDetailsComponent } from "../admin-dashboard/marks-details/marks-details.component";

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
        ApiService
    ]
})


export class TeacherDashboardModule{}