import { NetworkMoments } from './networkmoments';

export class QueryNetworkMoments implements IQueryNetworkMoments {
    networkMoments: NetworkMoments[];
    success?: boolean | undefined;
    validNetworkTopology?: boolean | undefined;
}

/** Model for QueryNetworkMoments */
export interface IQueryNetworkMoments {
    networkMoments: NetworkMoments[];
    success?: boolean | undefined;
    validNetworkTopology?: boolean | undefined;
}