import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import DOMPurify from 'isomorphic-dompurify';
import { ApiService } from '../../../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-page',
  standalone: true,
  imports: [CommonModule],
  providers: [ApiService], 
  templateUrl: './dynamic-page.component.html',
  styleUrl: './dynamic-page.component.scss'
})
export class DynamicPageComponent {
    pageTitle!: string;
    pageContent!: string;
    isDataLoaded: boolean = false;
    content = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly apiService: ApiService
    ){}

    ngOnInit(): void {         
        this.route.queryParamMap.subscribe(params => {            
            const id = Number(params.get('id'));  
            if(id) {
                this.apiService.getPageById(id).subscribe(r => {
                    this.pageTitle = r.title;
                    this.pageContent = DOMPurify.sanitize(r.content);
                    this.content = r.content;
                    this.isDataLoaded = true;
                });   
            }
        });
    }
}
