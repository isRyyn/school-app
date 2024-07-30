import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullscreenButtonComponent } from './fullscreen-button/fullscreen-button.component';



@NgModule({
    declarations: [
        FullscreenButtonComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FullscreenButtonComponent
    ]
})
export class AppCommonModule { }
