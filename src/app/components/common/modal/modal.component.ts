import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [MatDialogActions, MatDialogContent, MatDialogClose, CommonModule],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

    @Input() message: string = 'Are you sure?';
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    isVisible = false;

    ngOnInit(): void {
        
    }

    show() {
        this.isVisible = true;
    }

    onConfirm() {
        this.confirm.emit();
        this.isVisible = false;
    }

    onCancel() {
        this.cancel.emit();
        this.isVisible = false;
    }
}
