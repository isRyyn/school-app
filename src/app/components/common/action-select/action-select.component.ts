import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectiveModule } from '../../../directives/directive.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-action-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './action-select.component.html',
  styleUrl: './action-select.component.scss'
})
export class ActionSelectComponent {
    @Input() showEdit!: boolean;
    @Input() showDelete!: boolean;
    @Input() showView!: boolean;
    @Input() isDisabled!: boolean;
    @Output() action: EventEmitter<string> = new EventEmitter();
    actionValue: string = '';

    onActionChange(action: any): void {
        this.action.emit(action?.target?.value);
        
        setTimeout(() => this.actionValue = '', 100);
        if(action?.target?.value) {
            window.scrollTo({ 'top': 0, behavior: 'smooth' });
        }
    }
}
