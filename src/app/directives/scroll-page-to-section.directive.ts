import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appScrollPageToSection]'
})
export class ScrollPageToSectionDirective implements OnInit {
    @Input() position: string = 'top';

    constructor() { }

    ngOnInit(): void {      
    }

    @HostListener('click')
    onClick() {
        window.scrollTo({ [this.position]: 0, behavior: 'smooth' });
    }

}