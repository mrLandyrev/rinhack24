import { Routes } from '@angular/router';

import { AppPaths } from '../shared/enums/app-paths.enum';

export const routes: Routes = [
    {
        path: AppPaths.UPLOAD,
        loadComponent: async () =>
            import('./modules/file-uploader/file-uploader.component').then(
                (c) => c.FileUploaderComponent
            ),
    },
    {
        path: AppPaths.SCAN,
        loadChildren: async () =>
            import('./modules/scan/scan.routing').then((r) => r.routes),
    },
    {
        path: AppPaths.EMPTY,
        pathMatch: 'full',
        redirectTo: AppPaths.SCAN,
    },
];
