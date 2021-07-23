import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class YupValidationPipe implements PipeTransform {
    private readonly schema;
    constructor(schema: any);
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
