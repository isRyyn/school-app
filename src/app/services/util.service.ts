import { Injectable } from '@angular/core';
import { ArrayObject } from './models';
import { EnumType } from 'typescript';

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
}
