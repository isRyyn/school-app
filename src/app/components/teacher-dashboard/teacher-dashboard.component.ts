import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MarksDetailsComponent } from '../admin-dashboard/marks-details/marks-details.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [MarksDetailsComponent, HttpClientModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent {

}
