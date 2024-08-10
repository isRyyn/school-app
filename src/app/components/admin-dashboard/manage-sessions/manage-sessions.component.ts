import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { SessionModel, VehicleModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { DirectiveModule } from '../../../directives/directive.module';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

@Component({
  selector: 'app-manage-sessions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, LoaderLineComponent],
  providers: [ApiService],
  templateUrl: './manage-sessions.component.html',
  styleUrl: './manage-sessions.component.scss'
})
export class ManageSessionsComponent {
    sessionForm!: FormGroup;
    isDataLoaded: boolean = false;

    sessionList: SessionModel[] = [];

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.loadData()
        this.loadForm()
    }

    loadData(): void {
        this.isDataLoaded = false;
        this.apiService.getAllSessions().subscribe(r => {
            this.sessionList = r;
            this.isDataLoaded = true;
        });
    }

    loadForm(): void {
        this.sessionForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl('', Validators.required)
        });
    }

    onSave(): void {
        if (this.sessionForm.valid) {
            this.apiService.addSession(this.sessionForm.value).subscribe(() => {
                this.onReset();
                this.loadData();
            });
        } else {
            this.sessionForm.markAllAsTouched();
        }
    }

    onReset(): void {
        this.sessionForm.reset({});
    }

    editVehicle(index: number): void {
        this.sessionForm.reset();
        this.sessionForm.patchValue(this.sessionList[index]);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.sessionForm, field);
    }
}
