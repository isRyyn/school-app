import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatDialogClose, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  showTitle?: boolean;

  constructor(private router: Router,
    public dialogRef: MatDialogRef<ModalComponent>){

  }

  onClose(): void {
    this.dialogRef.close();
  }

  goToPath(option: string): void {
    this.router.navigate([`/private/admin-dashboard/marks-details`], {
      queryParams: { selection: option }
     });
     this.onClose();
  }

}
