import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFileLike, TuiInputFilesModule } from '@taiga-ui/kit';
import {
    BehaviorSubject,
    combineLatest,
    filter,
    map,
    Observable,
    startWith,
    switchMap,
    tap,
} from 'rxjs';

import { FileUploaderService } from './services/file-uploader.service';

@Component({
    selector: 'app-file-uploader',
    standalone: true,
    imports: [TuiInputFilesModule, ReactiveFormsModule, NgForOf, AsyncPipe],
    providers: [FileUploaderService],
    templateUrl: './file-uploader.component.html',
    styleUrl: './file-uploader.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent {
    private readonly fileUploaderService: FileUploaderService =
        inject(FileUploaderService);

    readonly control = new FormControl<TuiFileLike[] | null>([]);
    readonly uploadingFiles$: BehaviorSubject<TuiFileLike[]> =
        new BehaviorSubject<TuiFileLike[]>([]);

    readonly uploadedFiles$: Observable<TuiFileLike[]> =
        this.control.valueChanges.pipe(
            filter((files) => !!files?.length),
            tap((files) => this.uploadingFiles$.next(files!)),
            switchMap((files) =>
                combineLatest(
                    files!.map((file) => {
                        return this.fileUploaderService.uploadEmail$(file).pipe(
                            startWith(null),
                            tap(() =>
                                this.uploadingFiles$.next(
                                    this.uploadingFiles$.value.filter(
                                        (_file) => file !== _file
                                    )
                                )
                            ),
                            map(() => file)
                        );
                    })
                )
            )
        );
}
