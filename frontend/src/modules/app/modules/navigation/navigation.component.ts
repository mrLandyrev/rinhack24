import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiButtonModule, TuiNavigationModule } from '@taiga-ui/experimental';

import { NavigationService } from '../../../shared/services/navigation.service';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [TuiNavigationModule, TuiButtonModule, TuiButtonModule],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
    private readonly navigationService = inject(NavigationService);

    goToUpload(): void {
        this.navigationService.toUpload();
    }

    goToScan(): void {
        return this.navigationService.toScan();
    }
}
