import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { adminRoutes } from './admin-dashboard.routes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  constructor(private router: Router) {

  }

  goToPath(path: string): void {
    this.router.navigate([`/private/admin-dashboard/${path}`]);
  }
}
