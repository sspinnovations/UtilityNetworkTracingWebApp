export class NetworkAttributeConditions implements INetworkAttributeConditions {
    networkAttributeName?: string | undefined;
    operator?: string | undefined;
    value?: number | undefined;
    combineUsingOr?: boolean | undefined;
    isTypeSpecificValue?: boolean | undefined;
}

export interface INetworkAttributeConditions {
    networkAttributeName?: string | undefined;
    operator?: string | undefined;
    value?: number | undefined;
    combineUsingOr?: boolean | undefined;
    isTypeSpecificValue?: boolean | undefined;
}