import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  
  constructor(
    private router: Router,
    private readonly modalService: ModalService
  ) {
  }

  ngOnInit(): void {
      
  }

  goToPath(path: string): void {
    this.modalService.openModal(path);
  }
}
