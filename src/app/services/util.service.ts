import { Injectable } from '@angular/core';
import { ArrayObject } from './models';
import { FormGroup } from '@angular/forms';

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

}
