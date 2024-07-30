import { Component } from '@angular/core';

@Component({
    selector: 'app-fullscreen-button',
    standalone: true,
    templateUrl: './fullscreen-button.component.html',
    styleUrls: ['./fullscreen-button.component.scss']
})
export class FullscreenButtonComponent {
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enter fullscreen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
            });
        }
    }
}