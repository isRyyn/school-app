import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArrayObject } from '../../services/models';
import { Role } from "../../services/enums";
import { CommonModule } from '@angular/common';
import { UtilService } from '../../services/util.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, LoginComponent, NgSelectModule, CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    role = Role;
    roles!: Array<ArrayObject>;
    loginForm!: FormGroup;

    constructor(
        private readonly router: Router,
        private readonly sharedService: SharedService,
        private readonly utilService: UtilService
    ) { }

    ngOnInit(): void {
        this.roles = this.utilService.intializeArrayWithEnums(this.role);
        this.loginForm = this.loadloginForm;
    }
    
    get loadloginForm(): FormGroup {
        return new FormGroup({
            userType: new FormControl('', Validators.required),
            identifier: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }   

    onSubmit() {
        if (this.loginForm.valid) {
            const selectedRole = this.loginForm.value.userType;
            if (selectedRole === 'ADMIN') {
                this.router.navigate(['private/admin-dashboard']);
            } else if (selectedRole === 'STUDENT') {
                this.router.navigate(['private/student-dashboard']);
            } else if (selectedRole === 'TEACHER') {
                this.router.navigate(['private/teacher-dashboard']);
            }
            this.sharedService.updateLogStatus(true);
        } else {
            Object.keys(this.loginForm.controls).forEach(control => {
                this.loginForm.get(control)?.markAsTouched();
            });
        }
    }

    isFieldInvalid(field: string): boolean {
        return !!(this.loginForm.get(field)?.invalid && this.loginForm.get(field)?.touched);
    }
}
