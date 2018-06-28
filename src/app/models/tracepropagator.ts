export class TracePropagator implements ITracePropagator {
    networkAttributeName: string;
    propagatorFunctionType: string;
    operator: string;
    value: number;
    propagatedAttributeName: string;
}

export interface ITracePropagator {
    networkAttributeName: string;
    propagatorFunctionType: string;
    operator: string;
    value: number;
    propagatedAttributeName: string;
}