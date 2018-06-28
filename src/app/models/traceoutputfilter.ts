export class TraceOuputFilter implements ITraceOuputFilter {
    networkSourceId: number;
    assetGroupCode: number;
    assetTypeCode: number;
}

export interface ITraceOuputFilter {
    networkSourceId: number;
    assetGroupCode: number;
    assetTypeCode: number;
}