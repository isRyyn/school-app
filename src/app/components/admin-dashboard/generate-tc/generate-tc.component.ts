import { Component, OnInit } from '@angular/core';
import { StudentModel } from '../../../services/models';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generate-tc',
  standalone: true,
  imports: [NgSelectModule, FormsModule, LoaderLineComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './generate-tc.component.html',
  styleUrl: './generate-tc.component.scss'
})
export class GenerateTcComponent implements OnInit {

    studentsList: StudentModel[] = [];
    student!: StudentModel;
    isDataLoaded: boolean = false;
    studentForm!: FormGroup;
    showForm: boolean = false;


    constructor(
        private readonly apiService: ApiService,
        private readonly fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.apiService.getAllStudents().subscribe(r => {
            this.studentsList = r;
            this.isDataLoaded = true;
        });
    }

    generate(): void {
       const s = this.student;
        this.apiService.getAllStandards().subscribe(r => {
            this.showForm = true;
            const standard = r.find(x => x.id == s.standardId)?.name;

            this.studentForm.patchValue({});
        });
    }

    loadForm(): void {
        this.studentForm = this.fb.group({
            name: [],
            class: [],
            dob: [],
            fatherName: [],
            mobile: [],
            address: [],
            behaviour: [],
            remarks: [],
            reason: [],
            dateOfIssue: []
        });
    }
}
