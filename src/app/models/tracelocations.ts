import { TraceLocationsTraceLocationType } from './enums';

export class TraceLocations implements ITraceLocations {
    traceLocationType?: TraceLocationsTraceLocationType | undefined;
    globalId?: string | undefined;
    percentAlong?: number | undefined;
    terminalId?: number | undefined;
}

export interface ITraceLocations {
    traceLocationType?: TraceLocationsTraceLocationType | undefined;
    globalId?: string | undefined;
    percentAlong?: number | undefined;
    terminalId?: number | undefined;
}