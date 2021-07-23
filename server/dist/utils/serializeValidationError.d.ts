import { ValidationError } from 'yup';
export declare class ValidationErrors {
    field: string;
    message: string;
}
export declare const serializeValidationError: (err: ValidationError) => ValidationErrors[];
