import { AsyncPipe, JsonPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputTagModule } from '@taiga-ui/kit';
import { first, tap } from 'rxjs';

import { ScanService } from '../../services/scan.service';

@UntilDestroy()
@Component({
    selector: 'app-eml-files-filters',
    standalone: true,
    imports: [
        TuiInputTagModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        AsyncPipe,
        JsonPipe,
    ],
    templateUrl: './eml-files-filters.component.html',
    styleUrl: './eml-files-filters.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmlFilesFiltersComponent implements OnInit {
    private readonly scanService = inject(ScanService);
    private readonly router = inject(Router);
    private readonly queryParams$ = inject(ActivatedRoute).queryParams;

    readonly form = new FormGroup({
        regExps: new FormControl<string[]>([]),
    });

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                tap(() => {
                    this.scanService.changeFilters({
                        regExps: this.form.value.regExps ?? null,
                    });

                    this.storeFilterValueIntoUrl();
                }),
                untilDestroyed(this)
            )
            .subscribe();

        this.restoreFiltersValueFromUrl();
    }

    private restoreFiltersValueFromUrl(): void {
        this.queryParams$
            .pipe(
                first(),
                tap((params) => {
                    const value = params['regExps'];

                    if (!value) {
                        return;
                    }

                    this.form.patchValue({
                        regExps: Array.isArray(params['regExps'])
                            ? params['regExps']
                            : [params['regExps']],
                    });
                }),
                untilDestroyed(this)
            )
            .subscribe();
    }

    private storeFilterValueIntoUrl(): void {
        console.log(
            this.form.value.regExps?.length ? this.form.value.regExps : null
        );

        void this.router.navigate([], {
            queryParams: {
                regExps: this.form.value.regExps?.length
                    ? this.form.value.regExps
                    : null,
            },
        });
    }
}
