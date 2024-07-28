import { SharedService } from './../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BannerType } from '../../../services/enums';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnInit {
    @Input() type!: BannerType;
    @Input() message?: string;
    @Input() timer: number = 5000;

    showBanner: boolean = false;
    bannerType = BannerType;

    constructor(
        private readonly sharedService: SharedService
    ){}

    ngOnInit(): void {        
        this.sharedService.showBanner$.subscribe(r => {
            this.type = r.type;
            this.message = r.message;
            this.timer = r.timer ? r.timer : this.timer;
            

            this.showBanner = true;
            setTimeout(() => this.showBanner = false, this.timer);

            if(!this.message) {
                this.setMessage()
            }
        });
    }

    setMessage(): void {
        if(this.type == BannerType.SUCCESS) {
            this.message = 'Information saved!';
        } else if(this.type == BannerType.ERROR) {
            this.message = 'Sorry, there was an error!';
        } else if(this.type == BannerType.INFO) {
            this.message = 'Done!';
        }
    }
}
