import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { SessionModel, StandardModel, StudentModel } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectiveModule } from '../../../../directives/directive.module';
import { FormsModule } from '@angular/forms';
import { ActionSelectComponent } from "../../../common/action-select/action-select.component";
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-show-student-details',
  standalone: true,
  imports: [CommonModule, NgSelectModule, DirectiveModule, FormsModule, ActionSelectComponent],
  providers: [ApiService],
  templateUrl: './show-student-details.component.html',
  styleUrl: './show-student-details.component.scss'
})
export class ShowStudentDetailsComponent implements OnInit {
    @Output() emitStudentForView: EventEmitter<StudentModel> = new EventEmitter();
    @Output() emitStudentForEdit: EventEmitter<StudentModel> = new EventEmitter();

    standardsList: StandardModel[] = [];
    filteredStudentsList: StudentModel[] = [];

    isDataLoaded: boolean = false;
    isDataFiltered: boolean = false;

    promotions: number[] = [];
    promoteBtnText: string = 'Promote';
    promotedSession!: number;
    sessionsList: SessionModel[] = [];
    selectedStandardIndex!: number;
    classValue?: string;

    constructor(
        private readonly apiService: ApiService,
        private readonly authService: AuthService
    ) {

    } 

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(r => {
            this.standardsList = r;
            this.isDataLoaded = true;
        });
    }

    onStandardChange(event?: StandardModel): void {
        const id = event?.id;
        this.selectedStandardIndex = this.standardsList.findIndex(x => x.id == id);
        this.isDataFiltered = false;
        this.promoteBtnText = 'Promote';
        if(id) {
            this.apiService.getSpecific(id).subscribe(r => {
                const sessionId = Number(this.authService.getSessionId());
                const filteredIds = r.filter(x => x.sessionId == sessionId && x.standardId == id).map(y => y.studentId);
                
                this.apiService.getAllStudents().subscribe(r => {
                    this.filteredStudentsList = r.filter(students => filteredIds.includes(students.id)) as StudentModel[];
                    this.isDataFiltered = true;
                });
                this.apiService.getAllSessions().subscribe(r => {
                    this.sessionsList = r.filter(x => x.id != Number(this.authService.getSessionId()));
                });
            });
    
        }
    }

    handleAction(action: string, student: StudentModel): void {
        if(action == 'edit') {
            this.emitStudentForEdit.emit(student);
        } else if(action == 'view') {
            this.emitStudentForView.emit(student);
        } else if(action == 'delete') {
            this.apiService.deleteStudent(student.id).subscribe(() => {
                this.filteredStudentsList = this.filteredStudentsList.filter(x => x.id != student.id);

            });
        }
    }

    promoteAll(): void {
        if(this.promoteBtnText == 'Promote') {
            for(let i = 0;  i < this.filteredStudentsList.length;  i++) {
                this.promotions[i] = this.standardsList[this.selectedStandardIndex+1].id;
            }
            this.promoteBtnText = 'Submit';
        } else {
            if(this.promotedSession) {
                this.apiService.promoteStudents(this.filteredStudentsList.map(x => x.id), this.promotions, this.promotedSession).subscribe(r => {
                    this.promoteBtnText = 'Promote';
                    this.promotions = [];
                    this.promotedSession = null as unknown as number;
                    this.classValue = undefined;
                    this.isDataFiltered = false;
                });
            }
        }
    }

    promotionSelectChanged(event: any, index: number): void {
        if(event) {
            this.promotions[index] = event.target.value;
        } else {
            this.promotions[index] = -1;
        }
        
    }
}
