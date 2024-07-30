import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from '../../../directives/directive.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import { BannerType, Role } from '../../../services/enums';
import { ArrayObject, TeacherModel, UserModel } from '../../../services/models';
import { StudentSelectComponent } from "../../common/student-select/student-select.component";
import { SharedService } from '../../../services/shared.service';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, NgSelectModule, DirectiveModule, ReactiveFormsModule, StudentSelectComponent, ActionSelectComponent],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {
    userForm!: FormGroup;
    isDataLoaded: boolean = false;
    showUserSelect: boolean = false;
    roleSelected: string = '';
    isEdit: boolean = false;

    userList: UserModel[] = [];
    teacherList: TeacherModel[] = [];
    roles: ArrayObject[] = [];

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService,
        private readonly sharedService: SharedService
    ){}

    ngOnInit(): void {
        this.roles = this.utilService.intializeArrayWithEnums(Role);
        this.loadData();
        this.loadForm();
    }

    loadData(): void {     
        this.isDataLoaded = false;
        this.apiService.getAllUsers().subscribe(r => {
            this.userList = r;
            setTimeout(() => this.isDataLoaded = true, 500);
        });
    }

    loadForm(): void {
        this.userForm = new FormGroup({
            id: new FormControl(),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            role: new FormControl(null, Validators.required),
            userId: new FormControl(null)
        });
    }

    onRoleChange(roleObj?: ArrayObject): void {
        const role = roleObj?.value;
        if(role == 'TEACHER' || role == 'STUDENT') {
            if(role == 'TEACHER') {
                this.apiService.getAllTeachers().subscribe(r => this.teacherList = r);   
            }
            this.showUserSelect = true;
            this.roleSelected = role;
            this.userForm.get('userId')?.setValidators([Validators.required]);

            
        } else {
            this.showUserSelect = false;
            this.roleSelected = '';
            this.userForm.get('userId')?.removeValidators([Validators.required]);   
            this.userForm.get('userId')?.reset();
        }
        this.userForm.get('userId')?.updateValueAndValidity();
    }

    onSave(): void {
        if (this.userForm.valid) {
            if(this.isEdit) {
                this.apiService.updateCredentials(this.userForm.value).subscribe(() => {
                    this.loadData();
                });
            } else {
                this.apiService.register(this.userForm.value).subscribe(() => {
                    this.loadData();
                }, (error) => {
                    if(error.status == 417) {
                        const error = 'Email or mobile number is already in use';
                        this.sharedService.showBanner(BannerType.ERROR, error);
                    }       
                });
            }
            this.onReset();
        } else {
            this.userForm.markAllAsTouched();
        }
    }

    onReset(): void {
        this.userForm.reset();    
        this.showUserSelect = false;
        this.roleSelected = '';
        this.isEdit = false;
    }

    editUser(index: number): void {
        this.userForm.reset();
        const user = this.userList[index];

        if(user.userId) {
            this.showUserSelect = true;
            this.roleSelected = user.role;
        }
        this.userForm.patchValue({
            ...user,
            password: ''
        });
        this.isEdit = true;
    }

    deleteUser(id: number): void {
        this.apiService.deleteUser(id).subscribe(() => {
            this.isDataLoaded = false;
            this.loadData();
        });
    }

    onAction(action: string, index: number, id: number): void {
        if(action == 'edit') {
            this.editUser(index);
        } else if(action == 'delete') {
            this.deleteUser(id);
        }
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.userForm, field);
    }
}
