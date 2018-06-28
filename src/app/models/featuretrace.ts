import { GeometryType, PhaseType, TraceType } from '../models/enums';

export class FeatureTrace implements IFeatureTrace {
    globalId: string;
    geometryType: GeometryType;
    traceType: TraceType;
    domainNetwork: string;
    tierName: string;
    phaseType: PhaseType;

    constructor(featureTrace: FeatureTrace) {
        Object.assign(this, featureTrace);
    }
}

export interface IFeatureTrace {
    globalId: string;
    geometryType: GeometryType;
    traceType: TraceType;
    domainNetwork: string;
    tierName: string;
    phaseType: PhaseType;
}