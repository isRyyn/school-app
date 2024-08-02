import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DirectiveModule } from '../../../directives/directive.module';

@Component({
  selector: 'app-action-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-select.component.html',
  styleUrl: './action-select.component.scss'
})
export class ActionSelectComponent {
    @Input() showEdit!: boolean;
    @Input() showDelete!: boolean;
    @Input() showView!: boolean;
    @Input() isDisabled!: boolean;
    @Output() action: EventEmitter<string> = new EventEmitter();

    onActionChange(action: any, click?: string): void {
        this.action.emit(click ? click : action?.target?.value);
        
        if(action?.target?.value) {
            window.scrollTo({ 'top': 0, behavior: 'smooth' });
        }
    }
}
