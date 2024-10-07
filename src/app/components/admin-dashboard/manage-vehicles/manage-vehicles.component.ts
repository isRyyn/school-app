import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { VehicleModel } from '../../../services/models';
import { UtilService } from '../../../services/util.service';
import { DirectiveModule } from '../../../directives/directive.module';
import { ActionSelectComponent } from "../../common/action-select/action-select.component";
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

@Component({
  selector: 'app-manage-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DirectiveModule, ActionSelectComponent, LoaderLineComponent],
  providers: [ApiService],
  templateUrl: './manage-vehicles.component.html',
  styleUrl: './manage-vehicles.component.scss'
})
export class ManageVehiclesComponent implements OnInit {
    vehicleForm!: FormGroup;
    isDataLoaded: boolean = false;

    vehicleList: VehicleModel[] = [];

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
        this.apiService.getAllVehicles().subscribe(r => {
            this.vehicleList = r;
            this.isDataLoaded = true;
        });
    }

    loadForm(): void {
        this.vehicleForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl('', Validators.required),
            number: new FormControl('', Validators.required),
            driver: new FormControl(''),
            route: new FormControl('')
        });
    }

    onSave(): void {
        if (this.vehicleForm.valid) {
            this.apiService.saveVehicle(this.vehicleForm.value).subscribe(() => {
                this.onReset();
                location.reload();
                this.loadData();
            });
        } else {
            this.vehicleForm.markAllAsTouched();
        }
    }

    onReset(): void {
        this.vehicleForm.reset({});
    }

    editVehicle(index: number): void {
        this.vehicleForm.reset();
        this.vehicleForm.patchValue(this.vehicleList[index]);
    }

    deleteVehicle(id: number): void {
        this.apiService.deleteVehicle(id).subscribe(() => {
            this.loadData();
        });
    }

    onAction(action: string, index: number, id: number): void {
        if(action == 'edit') {
            this.editVehicle(index);
        } else if(action == 'delete') {
            this.deleteVehicle(id);
        }
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.vehicleForm, field);
    }
}
