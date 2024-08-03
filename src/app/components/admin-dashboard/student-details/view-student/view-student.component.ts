import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ParentModel, StudentModel, VehicleModel } from '../../../../services/models';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { YesNoPipe } from "../../../../pipes/yes-no.pipe";

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [CommonModule, YesNoPipe],
  templateUrl: './view-student.component.html',
  styleUrl: './view-student.component.scss'
})
export class ViewStudentComponent implements OnInit {
    @Input() student?: StudentModel;
    @Output() goBackEvent: EventEmitter<void> = new EventEmitter();

    @ViewChild('download', { static: false }) contentToDownload!: ElementRef;

    parents?: ParentModel[] = [];
    vehicle?: VehicleModel;
    studentStandard!: string;

    constructor(
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {
        this.apiService.getAllStandards().subscribe(standards => {
            this.studentStandard = standards.find(x => x.id == this.student?.standardId)?.name ?? '';
        });

        if(this.student?.parentsIds) {
            this.student.parentsIds.forEach(id => {
                this.apiService.getParentById(id).subscribe(r => this.parents?.push(r));
            });
        }

        if(this.student?.vehicleId) {
            this.apiService.getVehicleById(this.student.vehicleId).subscribe(r => {
                this.vehicle = r;
            });
        }
    }


    goBack(): void {
        this.goBackEvent.emit();
    }

    print(): void {
        const printContents = this.contentToDownload.nativeElement.innerHTML;
        const originalContents = document.body.innerHTML;

        // Create a new window and write the content to it
        const printWindow = window.open('', '', 'height=600,width=1000');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Section</title>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContents);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }

    downloadAsPDF(): void {
        const data = this.contentToDownload.nativeElement;

        const options = {
            scale: 3, // Adjust scale for higher resolution
            useCORS: true // If you have cross-origin content, this will help load them
          };
      

        html2canvas(data, options).then(canvas => {
          const imgWidth = 208;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
    
          const contentDataURL = canvas.toDataURL('image/png');
          let pdf = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('student.pdf');
        });
    }
}
