import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArrayObject, SessionModel, UserModel } from '../../services/models';
import { BannerType, Role } from "../../services/enums";
import { CommonModule } from '@angular/common';
import { UtilService } from '../../services/util.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, HttpClientModule, NgSelectModule, LoginComponent, NgSelectModule, CommonModule, ReactiveFormsModule],
    providers: [ApiService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    role = Role;
    roles!: Array<ArrayObject>;
    sessionsList: SessionModel[] = [];
    loginForm!: FormGroup;
    showData: boolean = true;

    constructor(
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly sharedService: SharedService,
        private readonly utilService: UtilService,
        private readonly apiService: ApiService
    ) { }

    ngOnInit(): void {
        this.roles = this.utilService.intializeArrayWithEnums(this.role);
        this.apiService.getAllSessions().subscribe(r => this.sessionsList = r);
        this.loginForm = this.loadloginForm;
    }

    get loadloginForm(): FormGroup {
        return new FormGroup({
            role: new FormControl('STUDENT', Validators.required),
            username: new FormControl('bradley', Validators.required),
            password: new FormControl('1234', Validators.required),
            sessionId: new FormControl(1, Validators.required)
        });
    }

    onSubmit(): void {
        const formVal = this.loginForm.value;
        if (this.loginForm.valid) {
            this.apiService.login({
                username: formVal.username,
                password: formVal.password,
                role: formVal.role
            } as UserModel).subscribe(responseId => {
                const selectedRole = formVal.role;
                const sessionId = formVal.sessionId;
                this.showData = false;
                if (selectedRole === 'ADMIN') {
                    this.authService.setAuthToken('allowed', 'admin', sessionId);
                    this.router.navigate(['private/admin-dashboard']);
                } else if (selectedRole === 'STUDENT') {
                    this.authService.setAuthToken('allowed', 'student', sessionId, responseId);
                    this.router.navigate(['private/student-dashboard']);
                } else if (selectedRole === 'TEACHER') {
                    this.authService.setAuthToken('allowed', 'teacher', sessionId, responseId);
                    this.router.navigate(['private/teacher-dashboard']);
                }
                this.sharedService.updateLogStatus();
            }, (error) => {
                this.sharedService.showBanner(BannerType.ERROR, 'Incorrect credentials', 2000);
            });
        } else {
            Object.keys(this.loginForm.controls).forEach(control => {
                this.loginForm.get(control)?.markAsTouched();
            });
        }
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.loginForm, field);
    }
}
