import { Routes } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';

export const routes: Routes = [
    {path: '', component: SheetComponent},
    {path:'**', component: SheetComponent}
];
