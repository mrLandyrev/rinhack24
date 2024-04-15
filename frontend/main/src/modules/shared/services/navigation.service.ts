import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AppPaths } from '../enums/app-paths.enum';

@Injectable()
export class NavigationService {
    private readonly router = inject(Router);

    toAuth(): void {
        void this.router.navigate(['/', AppPaths.AUTH, AppPaths.LOGIN]);
    }

    toUpload(): void {
        void this.router.navigate([
            '/',
            AppPaths.EMAIL_ANALYZER,
            AppPaths.UPLOAD,
        ]);
    }

    toScan(): void {
        void this.router.navigate([
            '/',
            AppPaths.EMAIL_ANALYZER,
            AppPaths.SCAN,
        ]);
    }

    toDetails(fileId: string, regExps?: string[]): void {
        void this.router.navigate(
            [
                '/',
                AppPaths.EMAIL_ANALYZER,
                AppPaths.SCAN,
                AppPaths.FILE,
                fileId,
            ],
            { queryParams: regExps ? { regExps } : undefined }
        );
    }
}
