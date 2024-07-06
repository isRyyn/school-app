import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalConfig } from './types';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openModal(config?: ModalConfig): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.panelClass = 'custom-modal';

    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    document.body.classList.add('modal-overlay');

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed with result:', result);
      document.body.classList.remove('modal-overlay');
    });
  }
}
