import { JsonPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import { ScanService } from '../../services/scan.service';
import {EmlFile} from "../../../../../shared/types/eml-file.interface";

@Component({
    selector: 'app-eml-file-details',
    standalone: true,
    imports: [NgForOf, JsonPipe],
    templateUrl: './eml-file-details.component.html',
    styleUrl: './eml-file-details.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ScanService],
})
export class EmlFileDetailsComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT);

    readonly file: EmlFile = this.context['data'].file;
}
