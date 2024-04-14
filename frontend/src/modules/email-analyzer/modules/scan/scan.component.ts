import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ScanService } from './services/scan.service';
import {TuiLetModule} from "@taiga-ui/cdk";
import {AsyncPipe} from "@angular/common";
import {EmlFilesListComponent} from "./modules/eml-files-list/eml-files-list.component";
import {EmlFilesFiltersComponent} from "./modules/eml-files-filters/eml-files-filters.component";

@Component({
    selector: 'app-scan',
    standalone: true,
    imports: [
        TuiLetModule,
        AsyncPipe,
        EmlFilesListComponent,
        EmlFilesFiltersComponent
    ],
    templateUrl: './scan.component.html',
    styleUrl: './scan.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ScanService],
})
export class ScanComponent {
    private readonly scanService = inject(ScanService);

    emlFiles$ = this.scanService.emlFiles$;
}
