import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
    TuiTableModule,
    TuiTablePagination,
    TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import {
    TuiDialogService,
    TuiLoaderModule,
    TuiScrollbarModule,
} from '@taiga-ui/core';
import { TuiLineClampModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest, tap } from 'rxjs';

import { JoinPipePipe } from '../../../../../shared/pipes/join.pipe.pipe';
import { NavigationService } from '../../../../../shared/services/navigation.service';
import { EmlFile } from '../../../../../shared/types/eml-file.interface';
import { ScanService } from '../../services/scan.service';
import { EmlFileDetailsComponent } from '../eml-file-details/eml-file-details.component';

@UntilDestroy()
@Component({
    selector: 'app-eml-files-list',
    standalone: true,
    imports: [
        TuiTableModule,
        NgForOf,
        DatePipe,
        JoinPipePipe,
        NgIf,
        JsonPipe,
        TuiScrollbarModule,
        TuiLineClampModule,
        TuiTablePaginationModule,
        AsyncPipe,
        TuiLoaderModule,
    ],
    templateUrl: './eml-files-list.component.html',
    styleUrl: './eml-files-list.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmlFilesListComponent implements OnInit {
    private readonly navigationService = inject(NavigationService);
    private readonly scanService = inject(ScanService);
    private readonly dialogService = inject(TuiDialogService);

    @Input()
    items: EmlFile[] | null = null;

    readonly columns: string[] = [
        'subject',
        'fileName',
        'sendDate',
        'uploadDate',
        'to',
        'cc',
        'from',
    ];

    readonly isFilesLoading$ = this.scanService.isFilesLoading$;
    readonly totalItems$ = this.scanService.totalItems$;
    readonly sorter$ = new BehaviorSubject<string>('uploadDate');

    readonly direction$ = new BehaviorSubject<1 | -1>(1);

    size = 20;

    onPaginationChange(pagination: TuiTablePagination) {
        this.scanService.changePagination(pagination);

        this.size = pagination.size;
    }

    ngOnInit(): void {
        combineLatest([this.sorter$, this.direction$])
            .pipe(
                tap(([sortBy, direction]) =>
                    this.scanService.changeSort({
                        sortBy,
                        direction: direction > 0 ? 'asc' : 'desc',
                    })
                ),
                untilDestroyed(this)
            )
            .subscribe();
    }

    showFileDangerValues(file: EmlFile): void {
        if (!file.isDanger) {
            return;
        }

        this.dialogService
            .open(new PolymorpheusComponent(EmlFileDetailsComponent), {
                data: {
                    file,
                },
            })
            .pipe(untilDestroyed(this))
            .subscribe();
    }

    idIdentity(index: number, file: EmlFile) {
        return file.id;
    }
}
