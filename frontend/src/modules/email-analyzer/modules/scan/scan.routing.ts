import { Routes } from '@angular/router';

import { AppPaths } from '../../../shared/enums/app-paths.enum';
import { ScanComponent } from './scan.component';

export const routes: Routes = [
    {
        path: AppPaths.EMPTY,
        component: ScanComponent,
        pathMatch: 'full',
    },
];
