import { ElementRef, Injectable } from '@angular/core';
import { ArrayObject } from './models';
import { FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    intializeArrayWithEnums(enumName: any): Array<ArrayObject> {
        const finalArray: ArrayObject[] = [];
        Object.entries(enumName).forEach(([key, name]) => {
            finalArray.push({
                name: name as string,
                value: key
            });
        });
        return finalArray;
    }

    isFieldInvalid(form: FormGroup, field: string): boolean {
        return !!(form.get(field)?.invalid && form.get(field)?.touched);
    }

    convertToBase64(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string; 
            const base64String = result.split(',')[1]; 
        };
    }

    download(content: ElementRef, name: string): void {
        const data = content.nativeElement;

        const options = {
            scale: 3, 
            useCORS: true
          };
      

        html2canvas(data, options).then(canvas => {        
          const contentDataURL = canvas.toDataURL('image/png');
          let pdf = new jsPDF('p', 'mm', 'a4');

        
          const pageWidth = pdf.internal.pageSize.width;
          const pageHeight = pdf.internal.pageSize.height;
          const leftMargin = 10;
          const rightMargin = 20; 
          const topMargin = 10; 
          
          const imgWidth = pageWidth - rightMargin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width; 
          

          const position = 10;
          pdf.addImage(contentDataURL, 'PNG', leftMargin, topMargin, imgWidth, imgHeight);
          pdf.save(`${name}.pdf`);
        });
    }

}
