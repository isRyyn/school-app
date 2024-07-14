import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BsDatepickerModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {
    @Input() controlName: string = 'date';

    constructor(
        readonly parentForm: FormGroupDirective
    ){}
}
