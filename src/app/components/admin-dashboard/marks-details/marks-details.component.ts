import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-marks-details',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgSelectModule ],
  templateUrl: './marks-details.component.html',
  styleUrl: './marks-details.component.scss'
})
export class MarksDetailsComponent implements OnInit {
  isViewMode?: boolean;
  studentsList: number[] = [1, 3];
  examsList: [] = [];
  subjectsList: [] = [];
  sessionsList: [] = [];
  marksForm!: FormGroup;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.loadForm();
    this.route.queryParams.subscribe(params => {
      console.log('paro', params['selection']);
      this.isViewMode = params['selection'] === 'check';
      console.log('here', this.isViewMode)
    });
  }

  loadForm(): void {
    this.marksForm = new FormGroup({
      student: new FormControl(),
      examType: new FormControl(),
      subject: new FormControl(),
      session: new FormControl(),
      marksObtained: new FormControl(),
      totalMarks: new FormControl()
    });
  }
}
