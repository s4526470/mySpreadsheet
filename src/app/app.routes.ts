import { Routes } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';

export const routes: Routes = [
    { path: '', redirectTo: 'sheets', pathMatch: 'full' },
  { path: 'sheets', component: SheetComponent }
];
