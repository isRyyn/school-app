import { NgSelectModule } from '@ng-select/ng-select';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StandardModel, SubjectModel } from '../../../services/models';

@Component({
  selector: 'app-manage-subjects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  providers: [ApiService],
  templateUrl: './manage-subjects.component.html',
  styleUrl: './manage-subjects.component.scss'
})
export class ManageSubjectsComponent implements OnInit {
    showAddSubject: boolean = false;
    isDataLoaded: boolean = false;
    buttonText = 'Add Subject';

    subjectForm!: FormGroup;

    standardsList: StandardModel[] = [];
    subjectsList: SubjectModel[] = [];

    constructor(
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {
        this.apiService.getAllSubjects().subscribe(r => {
            this.subjectsList = r;
            this.isDataLoaded = true;
        });
        this.apiService.getAllStandards().subscribe(r => this.standardsList = r);
        this.loadForm();
    }

    loadForm(): void {
        this.subjectForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            standardIds: new FormControl(),
            studentIds: new FormControl(),
            marksIds: new FormControl()
        });
    }

    addSubject(): void {
        if(this.buttonText == 'Save Subject') {
            const payload = this.subjectForm.value;
            this.apiService.saveSubject(payload).subscribe(r => console.log(r));
            this.isDataLoaded = false;
            this.apiService.getAllSubjects().subscribe(r => {
                this.subjectsList = r;
                this.isDataLoaded = true;
            });
        }

        this.showAddSubject = !this.showAddSubject;
        this.buttonText = this.showAddSubject ? 'Save Subject' : 'Add Subject';
    }

    onCancel(): void {
        this.showAddSubject = false;
        this.buttonText = 'Add Subject';
    }

    editSubject(): void {

    }

    deleteSubject(): void {

    }
}
