import { TraceResultFeature } from './traceresultfeature';

export class TraceResults implements ITraceResults {
    traceResults?: TraceResults2 | undefined;
    globalFunctionResults?: string[] | undefined;
    isConsistent?: boolean | undefined;
    kFeaturesForKNNFound?: boolean | undefined;
    startingPointsIgnored?: boolean | undefined;
    warnings?: string[] | undefined;
    success?: boolean | undefined;
    layers: any[];
}

export interface ITraceResults {
    traceResults?: TraceResults2 | undefined;
    globalFunctionResults?: string[] | undefined;
    isConsistent?: boolean | undefined;
    kFeaturesForKNNFound?: boolean | undefined;
    startingPointsIgnored?: boolean | undefined;
    warnings?: string[] | undefined;
    success?: boolean | undefined;
}

export class TraceResults2 implements ITraceResults2 {
    features?: TraceResultFeature[] | undefined;
    diagramName?: string | undefined;

    constructor(traceResults2: TraceResults2) {
        Object.assign(this, traceResults2);
    }
}

export interface ITraceResults2 {
    features?: TraceResultFeature[] | undefined;
    diagramName?: string | undefined;
}