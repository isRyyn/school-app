import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalConfig } from './models';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private dialog: MatDialog
  ) { }

  openModal(path: string, config?: ModalConfig): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.panelClass = 'custom-modal';
    dialogConfig.data = { path: path };

    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    document.body.classList.add('modal-overlay');

    dialogRef.afterClosed().subscribe(result => {
      document.body.classList.remove('modal-overlay');
    });
  }
}
