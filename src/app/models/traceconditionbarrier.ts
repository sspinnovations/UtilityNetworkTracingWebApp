import { TraceConditionBarrierType } from './enums';

export class TraceConditionBarrier implements ITraceConditionBarrier {
    name: string;
    type: TraceConditionBarrierType;
    operator: string;
    /** 0 = unknown, 1 = open, 2 = closed */
    value: number;
    combineUsingOr: boolean;
    isTypeSpecificValue: boolean;
}

export interface ITraceConditionBarrier {
    name: string;
    type: TraceConditionBarrierType;
    operator: string;
    /** 0 = unknown, 1 = open, 2 = closed */
    value: number;
    combineUsingOr: boolean;
    isTypeSpecificValue: boolean;
}