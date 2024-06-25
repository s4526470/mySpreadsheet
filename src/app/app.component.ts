import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SheetComponent } from "./sheet/sheet.component";

@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <head>
	    <meta charset="utf-8" />
	    <title>Convert Excel to HTML Table using JavaScript</title>
	    <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <app-sheet></app-sheet>
  `,
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, SheetComponent]
})
export class AppComponent {
}
