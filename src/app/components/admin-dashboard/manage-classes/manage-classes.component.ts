import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectModel, StandardModel } from '../../../services/models';
import { ApiService } from '../../../services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { UtilService } from '../../../services/util.service';
import { forkJoin } from 'rxjs';
import { DirectiveModule } from '../../../directives/directive.module';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, DirectiveModule, LoaderLineComponent],
  providers: [ApiService],
  templateUrl: './manage-classes.component.html',
  styleUrl: './manage-classes.component.scss'
})
export class ManageClassesComponent implements OnInit {
    isDataLoaded: boolean = false;

    classForm!: FormGroup;

    standardsList: StandardModel[] = [];
    subjectsList: SubjectModel[] = [];

    subjectMap = new Map<number, string>([]);
    

    constructor(
        private readonly apiService: ApiService,
        private readonly utilService: UtilService
    ){}

    ngOnInit(): void {
        this.loadData();
        this.loadForm();
    }

    loadData(): void {
        forkJoin({
            data1: this.apiService.getAllStandards(),
            data2: this.apiService.getAllSubjects()
        }).subscribe(r => {
            this.standardsList = r.data1;
            this.subjectsList = r.data2;
            this.setSubjectMap();
            this.isDataLoaded = true;
        });
    }

    setSubjectMap(): void {
        this.subjectsList.forEach(subject => {
            this.subjectMap.set(subject.id, subject.name);
        });
    }

    getSubjects(ids: number[]): string {
        let subjectString = '';
        ids.forEach(id => {
            subjectString += `${this.subjectMap.get(id)}, `
        });
        return subjectString.slice(0, -2);
    }

    loadForm(): void {
        this.classForm = new FormGroup({
            id: new FormControl(),
            name: new FormControl(null, Validators.required),
            subjectIds: new FormControl(),
            studentIds: new FormControl(),
            marksIds: new FormControl()
        });
    }

    onSave(): void {
        if(this.classForm.valid) {
            this.isDataLoaded = false;

            
            this.apiService.saveStandard(this.classForm.value).subscribe(() => {
                location.reload();
                this.apiService.getAllStandards().subscribe(r => {
                    this.standardsList = r;
                    this.classForm.reset();
                    setTimeout(() => this.isDataLoaded = true, 100);
                });
            });
        } else {
            this.classForm.get('name')?.markAsTouched();
        }
    }

    onReset(): void {
        this.classForm.reset();
    }

    editClass(index: number): void {
        const standard = this.standardsList[index];
        this.classForm.patchValue(standard);
    }

    isFieldInvalid(field: string): boolean {
        return this.utilService.isFieldInvalid(this.classForm, field);
    }
}
