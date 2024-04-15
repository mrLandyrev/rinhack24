import { Routes } from '@angular/router';

import { AppPaths } from '../shared/enums/app-paths.enum';

export const routes: Routes = [
    {
        path: 'email-analyzer',
        loadChildren: async () =>
            import('../email-analyzer/email-analyzer.routing').then(
                (r) => r.routes
            ),
    },
    {
        path: AppPaths.EMPTY,
        pathMatch: 'full',
        redirectTo: AppPaths.EMAIL_ANALYZER,
    },
];
