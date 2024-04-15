import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiTablePagination } from '@taiga-ui/addon-table';
import { BehaviorSubject, map, shareReplay, switchMap, tap } from 'rxjs';

import { BACKEND_URL } from '../../../../app/providers/backed-url.provider';
import { EmlFile } from '../../../../shared/types/eml-file.interface';
import { WithPaginationResponse } from '../../../../shared/types/response/with-pagination-response.interface';
import { ListEmlFilesFiltersValue } from '../types/list-eml-files-filters-value.interface';
import { ListEmlFilesRequest } from '../types/list-eml-files-request.interface';
import { SortParams } from '../types/sort-params.interface';

@Injectable({ providedIn: 'root' })
export class ScanService {
    private readonly httpClient = inject(HttpClient);
    private readonly backendUrl = inject(BACKEND_URL);

    private readonly emlFilesParamsSubject$ =
        new BehaviorSubject<ListEmlFilesRequest>({
            sortBy: 'uploadDate',
            sortDirection: 'asc',
            page: 0,
            perPage: 20,
            regExps: [],
        });

    private readonly emlFilesListResponse$ = this.emlFilesParamsSubject$.pipe(
        tap(() => this.isFilesLoadingSubject$.next(true)),
        switchMap((params) => this.getEmlFilesList$(params)),
        tap(() => this.isFilesLoadingSubject$.next(false)),
        shareReplay(1)
    );

    private readonly isFilesLoadingSubject$ = new BehaviorSubject<boolean>(
        true
    );

    emlFilesRequestParams$ = this.emlFilesParamsSubject$
        .asObservable()
        .pipe(shareReplay(1));

    emlFiles$ = this.emlFilesListResponse$.pipe(
        map((response) => response.items)
    );

    totalItems$ = this.emlFilesListResponse$.pipe(
        map((response) => response.totalItems)
    );

    isFilesLoading$ = this.isFilesLoadingSubject$.pipe(shareReplay(1));

    changePagination(pagination: TuiTablePagination): void {
        this.emlFilesParamsSubject$.next({
            ...this.emlFilesParamsSubject$.value,
            page: pagination.page,
            perPage: pagination.size,
        });
    }

    changeSort(sortParams: SortParams): void {
        this.emlFilesParamsSubject$.next({
            ...this.emlFilesParamsSubject$.value,
            sortBy: sortParams.sortBy,
            sortDirection: sortParams.direction,
        });
    }

    changeFilters(filters: ListEmlFilesFiltersValue): void {
        this.emlFilesParamsSubject$.next({
            ...this.emlFilesParamsSubject$.value,
            regExps: filters.regExps ?? [],
        });
    }

    private getEmlFilesList$(request: ListEmlFilesRequest) {
        return this.httpClient.get<WithPaginationResponse<EmlFile>>(
            `${this.backendUrl}/email/list`,
            {
                params: new HttpParams({
                    fromObject: request as any,
                }),
                observe: 'body',
            }
        );
    }
}
