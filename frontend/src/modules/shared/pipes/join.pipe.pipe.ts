import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'joinPipe',
    standalone: true,
})
export class JoinPipePipe implements PipeTransform {
    private readonly defaultConfig = {
        glue: ', ',
        property: null,
    };

    transform<T extends string | Record<string, any>>(
        value: T[],
        config?: { glue?: string; property: keyof T | null }
    ): string {
        config = {
            ...this.defaultConfig,
            ...(config ?? {}),
        };

        return value
            .map((item) =>
                typeof item === 'object' ? item[config.property!] : item
            )
            .join(config.glue);
    }
}
