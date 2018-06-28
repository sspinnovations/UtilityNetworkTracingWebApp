import { TraceType } from './enums';
import { TraceLocations } from './tracelocations';
import { TraceConfiguration } from './traceconfiguration';

export class TracePayload implements ITracePayload {
    featureServiceUrl: string;
    gdbVersion: string;
    traceType: TraceType;
    traceLocations: TraceLocations[];
    traceConfiguration: TraceConfiguration;

    constructor(tracePayload: TracePayload) {
        Object.assign(this, tracePayload);
    }
}

export interface ITracePayload {
    featureServiceUrl: string;
    gdbVersion: string;
    traceType: TraceType;
    traceLocations: TraceLocations[];
    traceConfiguration: TraceConfiguration;
}