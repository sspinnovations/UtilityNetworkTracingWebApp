import { TraceOutputConditionType } from './enums';

export class TraceOutputCondition implements ITraceOutputCondition {
    name: string;
    type: TraceOutputConditionType;
    operator: string;
    value?: number | undefined;
    combineUsingOr?: boolean | undefined;
    isSpecificValue: boolean;
}

export interface ITraceOutputCondition {
    name: string;
    type: TraceOutputConditionType;
    operator: string;
    value?: number | undefined;
    combineUsingOr?: boolean | undefined;
    isSpecificValue: boolean;
}