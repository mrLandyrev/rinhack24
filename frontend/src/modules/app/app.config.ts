import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TuiRootModule } from '@taiga-ui/core';

import { NavigationService } from '../shared/services/navigation.service';
import { routes } from './app.routes';
import {provideBackedUrl} from "./providers/backed-url.provider";

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(routes),
        importProvidersFrom(TuiRootModule),

        provideBackedUrl(),

        NavigationService,
    ],
};
