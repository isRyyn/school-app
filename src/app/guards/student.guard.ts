import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root',
  })
  export class StudentGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(): boolean {
      if (this.authService.isLoggedIn() && this.authService.getUserRole() === 'student') {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }