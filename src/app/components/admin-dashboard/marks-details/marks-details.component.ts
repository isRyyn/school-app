import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../../services/api.service';
import { Student } from '../../../services/models';

@Component({
  selector: 'app-marks-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, MatSelectModule],
  providers: [ApiService],
  templateUrl: './marks-details.component.html',
  styleUrl: './marks-details.component.scss',
})
export class MarksDetailsComponent implements OnInit {
  isViewMode?: boolean;
  studentsList: Student[] = [];
  examsList: [] = [];
  subjectsList: [] = [];
  sessionsList: [] = [];
  marksForm!: FormGroup;
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.fetchStudents();
    this.loadForm();
    this.route.queryParams.subscribe((params) => {
      this.isViewMode = params['selection'] === 'check';
    });
  }

  loadForm(): void {
    this.marksForm = new FormGroup({
      student: new FormControl(),
      examType: new FormControl(),
      subject: new FormControl(),
      session: new FormControl(),
      marksObtained: new FormControl(),
      totalMarks: new FormControl(),
    });
  }

  fetchStudents(): void {
    this.apiService.getAllStudents().subscribe(response => this.studentsList = response);
  }
}
