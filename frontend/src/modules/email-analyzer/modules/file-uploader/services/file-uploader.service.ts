import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiFileLike } from '@taiga-ui/kit';
import { Observable } from 'rxjs';

import { BACKEND_URL } from '../../../../app/providers/backed-url.provider';

@Injectable()
export class FileUploaderService {
    private readonly http = inject(HttpClient);
    private readonly backendUrl = inject(BACKEND_URL);

    uploadEmail$(file: TuiFileLike): Observable<void> {
        const fd = new FormData();

        fd.append('email', <File>file);

        return this.http.post<void>(`${this.backendUrl}/email/upload`, fd);
    }
}
