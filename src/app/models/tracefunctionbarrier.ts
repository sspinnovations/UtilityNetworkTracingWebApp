import { TraceFunctionBarrierFunctionType, TraceFunctionBarrierOperator } from './enums';

export class TraceFunctionBarrier implements ITraceFunctionBarrier {
    /** Choose from a number of different calculation functions. */
    functionType: TraceFunctionBarrierFunctionType;
    /** Choose to filter by any network attribute defined in the system. */
    networkAttributeName: string;
    /** Choose from a number of different operators */
    operator: TraceFunctionBarrierOperator;
    /** Specific value of the input attribute type that, if discovered, will cause the termination */
    value: string;
    /** Calculates values in each direction as opposed to an overall global value. */
    useLocalValues: boolean;
}

export interface ITraceFunctionBarrier {
    /** Choose from a number of different calculation functions. */
    functionType: TraceFunctionBarrierFunctionType;
    /** Choose to filter by any network attribute defined in the system. */
    networkAttributeName: string;
    /** Choose from a number of different operators */
    operator: TraceFunctionBarrierOperator;
    /** Specific value of the input attribute type that, if discovered, will cause the termination */
    value: string;
    /** Calculates values in each direction as opposed to an overall global value. */
    useLocalValues: boolean;
}