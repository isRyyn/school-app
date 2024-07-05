import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userType: string = 'student';

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) {}

  onSubmit() {
    if (this.userType === 'admin') {
      this.router.navigate(['private/admin-dashboard']);
    } else {
      this.router.navigate(['private/student-dashboard']);
    }
    this.sharedService.updateLogStatus(true);
  }
}
