import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollPageToSectionDirective } from './scroll-page-to-section.directive';



@NgModule({
    declarations: [
        ScrollPageToSectionDirective
    ],
    exports: [
        ScrollPageToSectionDirective
    ],
    imports: [
        CommonModule
    ]
})
export class DirectiveModule { }
