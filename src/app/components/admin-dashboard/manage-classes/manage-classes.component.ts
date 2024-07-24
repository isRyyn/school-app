import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubjectModel, StandardModel } from '../../../services/models';
import { ApiService } from '../../../services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  providers: [ApiService],
  templateUrl: './manage-classes.component.html',
  styleUrl: './manage-classes.component.scss'
})
export class ManageClassesComponent implements OnInit {
    showAddClass: boolean = false;
    isDataLoaded: boolean = false;
    buttonText = 'Add Class';

    classForm!: FormGroup;

    standardsList: StandardModel[] = [];
    subjectsList: SubjectModel[] = [];

    constructor(
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(r => {
            this.standardsList = r;
            this.isDataLoaded = true;
        });
        this.apiService.getAllSubjects().subscribe(r => this.subjectsList = r);
        this.loadForm();
    }

    loadForm(): void {
        this.classForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl(),
            subjectIds: new FormControl(),
            studentIds: new FormControl(),
            marksIds: new FormControl()
        });
    }

    addClass(): void {
        if(this.buttonText == 'Save Class') {
            const payload = this.classForm.value;
            this.apiService.saveStandard(payload).subscribe(r => console.log(r));
            this.isDataLoaded = false;
            this.apiService.getAllStandards().subscribe(r => {
                this.standardsList = r;
                this.isDataLoaded = true;
            });
        }

        this.showAddClass = !this.showAddClass;
        this.buttonText = this.showAddClass ? 'Save Class' : 'Add Class';
    }

    onCancel(): void {
        this.showAddClass = false;
        this.buttonText = 'Add Class';
    }

    editClass(): void {

    }

    deleteClass(): void {

    }
}
