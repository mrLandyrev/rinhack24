import { EmlFile } from '../../../../shared/types/eml-file.interface';
import { WithPaginationRequest } from '../../../../shared/types/request/with-pagination.request';
import { WithSortRequest } from '../../../../shared/types/request/with-sort-request.interface';

export interface ListEmlFilesRequest
    extends WithPaginationRequest,
        WithSortRequest<EmlFile> {
    regExps: string[];
}
