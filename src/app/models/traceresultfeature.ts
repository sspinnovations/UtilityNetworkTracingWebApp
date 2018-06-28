export class TraceResultFeature implements ITraceResultFeature {
    networkSourceId?: number | undefined;
    globalId?: string | undefined;
    objectId?: number | undefined;
    terminalId?: number | undefined;
    assetGroupCode: number;
    assetTypeCode: number | undefined; // custom property to keep track of AssetTypeId

    constructor(traceResultFeature: TraceResultFeature) {
        Object.assign(this, traceResultFeature);
    }
}

/** Model for Features */
export interface ITraceResultFeature {
    networkSourceId?: number | undefined;
    globalId?: string | undefined;
    objectId?: number | undefined;
    terminalId?: number | undefined;
    assetGroupCode: number;
}