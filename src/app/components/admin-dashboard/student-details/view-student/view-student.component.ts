import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParentModel, StudentModel, VehicleModel } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.scss'
})
export class ViewStudentComponent implements OnInit {
    @Input() student?: StudentModel;
    @Output() goBackEvent: EventEmitter<void> = new EventEmitter();

    parents: ParentModel[] = [{
        firstName: 'Brad',
        lastName: 'Pitt',
        relation: 'Father',
        mobile: '88434343243',
        gender: 'Male'
    } as ParentModel];
    vehicle?: VehicleModel;
    studentStandard!: string;

    constructor(
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(standards => {
            this.studentStandard = standards.find(x => x.id == this.student?.standardId)?.name ?? '';
        });
    }


    goBack(): void {
        this.goBackEvent.emit();
    }

    print(): void {

    }

    download(): void {

    }
}
