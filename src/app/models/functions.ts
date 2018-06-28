import { NetworkAttributeConditions } from "./networkattributeconditions";

export class Functions implements IFunctions {
    functionType?: string | undefined;
    networkAttributeName?: string | undefined;
    networkAttributeConditions?: NetworkAttributeConditions[] | undefined;
    subnetworkAttributeName?: string | undefined;
}

export interface IFunctions {
    functionType?: string | undefined;
    networkAttributeName?: string | undefined;
    networkAttributeConditions?: NetworkAttributeConditions[] | undefined;
    subnetworkAttributeName?: string | undefined;
}