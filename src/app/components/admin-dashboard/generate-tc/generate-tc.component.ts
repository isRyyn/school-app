import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StudentModel, TransferCertificateModel } from '../../../services/models';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { LoaderLineComponent } from "../../common/loader-line/loader-line.component";
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { SharedService } from '../../../services/shared.service';
import { BannerType } from '../../../services/enums';

@Component({
  selector: 'app-generate-tc',
  standalone: true,
  imports: [NgSelectModule, FormsModule, LoaderLineComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './generate-tc.component.html',
  styleUrl: './generate-tc.component.scss'
})
export class GenerateTcComponent implements OnInit {
    @ViewChild('download', { static: false }) contentToDownload!: ElementRef;
    studentsList: StudentModel[] = [];
    student!: StudentModel | null;
    isDataLoaded: boolean = false;
    studentForm!: FormGroup;
    registerForm!: FormGroup;
    statementForm!: FormGroup;
    showForm!: boolean;
    tcList: TransferCertificateModel[] = [];


    constructor(
        private readonly apiService: ApiService,
        private readonly fb: FormBuilder,
        private utilService: UtilService,
        private readonly sharedService: SharedService
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.apiService.getAllStudents(),
            this.apiService.getAllTC()
        ]).subscribe((r) => {
            this.studentsList = r[0];
            this.tcList = r[1];
            this.isDataLoaded = true;
        });

        this.loadForm();
        //this.loadRegisterForm();
        //this.loadStatementForm();
    }

    studentChanged(event: StudentModel): void {
        this.studentForm.get('name')?.patchValue(`${this.student?.firstName} ${this.student?.lastName}`);
        this.studentForm.get('studentId')?.patchValue(this.student?.id);
        this.studentForm.get('dob')?.patchValue(this.student?.dob);
    }

    onSave(): void {
        if(!this.studentForm.disabled) {
            this.apiService.addTc(this.studentForm.value).subscribe(() => {
                this.sharedService.showBanner(BannerType.SUCCESS, 'Saved/Downloaded successfully!');
            });
        } else {
            this.sharedService.showBanner(BannerType.SUCCESS, 'Saved/Downloaded successfully!');
        }

        this.utilService.download(this.contentToDownload, 'transfer-certificate');
        this.onReset();
    }

    onReset(): void {
        this.student = null;
        this.showForm = false;
        this.studentForm.reset();
    }

    onView(tc: TransferCertificateModel): void {
        this.showForm = true;
        this.studentForm.patchValue(tc);
        this.studentForm.disable();
    }

    loadForm(): void {
        this.studentForm = this.fb.group({
            id: [],
            studentId: [],
            number: [],
            district: [],
            name: [],
            aadhar: [],
            dob: [],
            ageYears: [],
            ageMonths: [],
            mother: [],
            father: [],
            religion: [],
            place: [],
            tehsil: [],
            studentDistrict: [],
            livingInStateSince: [],
            dateOfAdmission: [],
            numberOfEntryRegister: [],
            lastDateOfSchool: [],
            dateOfLeaving: [],

            reason: [],
            conduct: [],
            lastClassPassed: [],
            dateOfPassing: [],
            lastClassAttended: [],
            language: [],

            freeOfCost: [],
            freeOfCostClass: [],
            daysSchoolOpened: [],
            daysAttended: [],
            absentDays: [],
            fatherBusiness: [],

            day: [],
            month: [],
            year: [],
            principal: []
        });
    }

    loadRegisterForm(): void {
        this.registerForm = this.fb.group({
            admissionFileNo: [],
            withdrawlFileNo: [],
            transferCertificateNo: [],
            scholarNameAndAadhaar: [],
            occupationAndAddress: [],
            dob: [],
            lastInstitution: [],
            religion: [],
            mother: [],
            father: [],
            lengthOfResidence: [],
            bankName: [],
            bankAccount: [],
            nursery: this.loadClassForm,
            lkg: this.loadClassForm,
            ukg: this.loadClassForm,
            first: this.loadClassForm,
            second: this.loadClassForm,
            third: this.loadClassForm,
            fourth: this.loadClassForm,
            fifth: this.loadClassForm,
            sixth: this.loadClassForm,
            seventh: this.loadClassForm,
            eighth: this.loadClassForm,
            ninth: this.loadClassForm,
            tenth: this.loadClassForm,
            eleventh: this.loadClassForm,
            twelfth: this.loadClassForm,
            dated: [],
            headOfInstitution: []
        });
    }

    loadClassForm(): FormGroup {
        return this.fb.group({
            dateOfAdmission: [],
            dateOfPromotion: [],
            dateOfRemoval: [],
            causeOfRemoval: [],
            year: [],
            conduct: [],
            work: [],
            sign: []
        });
    }

    loadStatementForm(): void {
        this.statementForm = this.fb.group({

        });
    }
}
