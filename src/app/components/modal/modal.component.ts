import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogContent, MatDialogActions, MatDialogRef, MatDialogClose, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatDialogClose, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {

  showTitle?: boolean;
  path?: string;
  checkButton!: string;
  addButton!: string;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
  }

  ngOnInit(): void {
    this.path = this.data['path'];
    if(this.path == 'marks-details') {
      this.checkButton = this.addButton = 'Marks';
    } else if (this.path == 'fee-details') {
      this.checkButton = this.addButton = 'Fee';
    } else {
      this.checkButton = this.addButton = 'Details';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  goToPath(option: string): void {
     this.dialogRef.close();
     this.router.navigate([`/private/admin-dashboard/${this.path}`], {
      queryParams: { selection: option }
     });
  }
}
