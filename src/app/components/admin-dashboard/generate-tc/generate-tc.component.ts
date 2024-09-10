import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ArrayObject, StudentModel, TransferCertificateModel, TransferCertificateRegisterModel } from '../../../services/models';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { SharedService } from '../../../services/shared.service';
import { BannerType, TCRegisterClasses } from '../../../services/enums';
import { LoaderLineComponent } from '../../common/loader-line/loader-line.component';

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
    student2!: StudentModel | null;

    isDataLoaded: boolean = false;
    studentForm!: FormGroup;
    registerForm!: FormGroup;
    statementForm!: FormGroup;

    showForm!: boolean;
    showForm2!: boolean;

    tcList: TransferCertificateModel[] = [];
    tcRegisterList: TransferCertificateRegisterModel[] = [];
    tcRegisterClasses = TCRegisterClasses;
    tcRegisterClassesArr: ArrayObject[] = [];


    constructor(
        private readonly apiService: ApiService,
        private readonly fb: FormBuilder,
        private utilService: UtilService,
        private readonly sharedService: SharedService
    ) { }

    ngOnInit(): void {
        this.tcRegisterClassesArr = this.utilService.intializeArrayWithEnums(this.tcRegisterClasses);
        forkJoin([
            this.apiService.getAllStudents(),
            this.apiService.getAllTC(),
            this.apiService.getAllTcRegister()
        ]).subscribe((r) => {
            this.studentsList = r[0];
            this.tcList = r[1];
            this.tcRegisterList = r[2];
            this.isDataLoaded = true;
        });

        this.loadForm();
        this.loadRegisterForm();
    }

    studentChanged(): void {
        this.studentForm.enable();
        this.studentForm.get('name')?.patchValue(`${this.student?.firstName} ${this.student?.lastName}`);
        this.studentForm.get('studentId')?.patchValue(this.student?.id);
        this.studentForm.get('dob')?.patchValue(this.student?.dob);
    }

    student2Changed(): void {
        this.registerForm.enable();
        this.registerForm.get('scholarNameAndAadhaar')?.patchValue(`${this.student2?.firstName} ${this.student2?.lastName}`);
        this.registerForm.get('studentId')?.patchValue(this.student2?.id);
        this.registerForm.get('dob')?.patchValue(this.student2?.dob);
    }

    onSave(): void {
        if (!this.studentForm.disabled) {
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

    onRegisterSave(): void {
        const x = this.registerForm.value;
        const payload = {
            studentId: x.studentId,
            admissionFileNo: x.admissionFileNo,
            withdrawlFileNo: x.withdrawlFileNo,
            transferCertificateNo: x.transferCertificateNo,
            scholarNameAndAadhaar: x.scholarNameAndAadhaar,
            occupationAndAddress: x.occupationAndAddress,
            dob: x.dob,
            lastInstitution: x.lastInstitution,
            religion: x.religion,
            mother: x.mother,
            father: x.father,
            lengthOfResidence: x.lengthOfResidence,
            bankName: x.bankName,
            bankAccount: x.bankAccount,
            dated: x.dated,
            headOfInstitution: x.headOfInstitution,
            classDetails: {
                nursery: x.nursery,
                lkg: x.lkg,
                ukg: x.ukg,
                first: x.first,
                second: x.second,
                third: x.third,
                fourth: x.fourth,
                fifth: x.fifth,
                sixth: x.sixth,
                seventh: x.seventh,
                eighth: x.eighth,
                ninth: x.ninth,
                tenth: x.tenth,
                eleventh: x.eleventh,
                twelfth: x.twelfth
            }
        } as unknown as TransferCertificateRegisterModel;
        if(!this.registerForm.disabled) {
            this.apiService.addTcRegiseter(payload).subscribe(() => {
                this.sharedService.showBanner(BannerType.SUCCESS, 'Saved successfully!');
            });
        } 
        this.onRegisterReset();        
    }

    onRegisterReset(): void {
        this.student2 = null;
        this.showForm2 = false;
        this.registerForm.reset();
    }

    onView(tc: TransferCertificateModel): void {
        this.showForm = true;
        this.showForm2 = true;
        this.studentForm.patchValue(tc);
        this.patchRegisterFormValue(tc.studentId);
        this.studentForm.disable();
        this.registerForm.disable();
    }

    patchRegisterFormValue(studentId: number): void {
        const x = this.tcRegisterList.find(item => item.studentId == studentId);
        this.registerForm.patchValue({
            studentId: x?.studentId,
            admissionFileNo: x?.admissionFileNo,
            withdrawlFileNo: x?.withdrawlFileNo,
            transferCertificateNo: x?.transferCertificateNo,
            scholarNameAndAadhaar: x?.scholarNameAndAadhaar,
            occupationAndAddress: x?.occupationAndAddress,
            dob: x?.dob,
            lastInstitution: x?.lastInstitution,
            religion: x?.religion,
            mother: x?.mother,
            father: x?.father,
            lengthOfResidence: x?.lengthOfResidence,
            bankName: x?.bankName,
            bankAccount: x?.bankAccount,
            dated: x?.dated,
            headOfInstitution: x?.headOfInstitution,
            nursery: x?.classDetails?.nursery,
            lkg: x?.classDetails?.lkg,
            ukg: x?.classDetails?.ukg,
            first: x?.classDetails?.first,
            second: x?.classDetails?.second,
            third: x?.classDetails?.third,
            fourth: x?.classDetails?.fourth,
            fifth: x?.classDetails?.fifth,
            sixth: x?.classDetails?.sixth,
            seventh: x?.classDetails?.seventh,
            eighth: x?.classDetails?.eighth,
            ninth: x?.classDetails?.ninth,
            tenth: x?.classDetails?.tenth,
            eleventh: x?.classDetails?.eleventh,
            twelfth: x?.classDetails?.twelfth
        });
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
            id: [],
            studentId: [],
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
            nursery: this.loadClassForm('nursery'),
            lkg: this.loadClassForm('lkg'),
            ukg: this.loadClassForm('ukg'),
            first: this.loadClassForm('first'),
            second: this.loadClassForm('second'),
            third: this.loadClassForm('third'),
            fourth: this.loadClassForm('fourth'),
            fifth: this.loadClassForm('fifth'),
            sixth: this.loadClassForm('sixth'),
            seventh: this.loadClassForm('seventh'),
            eighth: this.loadClassForm('eighth'),
            ninth: this.loadClassForm('ninth'),
            tenth: this.loadClassForm('tenth'),
            eleventh: this.loadClassForm('eleventh'),
            twelfth: this.loadClassForm('twelfth'),
            dated: [],
            headOfInstitution: []
        });
    }

    loadClassForm(name: string): FormGroup {
        return this.fb.group({
            className: [name],
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

    classForm(item: string): FormGroup {
        const formName = item.toLowerCase();
        return this.registerForm?.get(formName) as FormGroup;
    }
}
