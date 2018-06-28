export class ServiceError {
    public error: ErrorDetails;
}

export interface ErrorDetails {
    code: number;
    message: string;
    details: string;
}