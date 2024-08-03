import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'yesNo',
    standalone: true
})
export class YesNoPipe implements PipeTransform {

    transform(value?: boolean): string {
        if (!value) return 'No';
        return value == true ? 'Yes' : 'No';
    }
}