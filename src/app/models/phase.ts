import { PhaseType } from "../models/enums";

export class Phase implements IPhase {
    type: PhaseType;
    isActive: boolean;

    constructor(phase: Phase) {
        Object.assign(this, phase);
    }
}

export interface IPhase {
    type: PhaseType;
    isActive: boolean;
}