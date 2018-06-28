export class NetworkMoments implements INetworkMoments {
    duration: number;
    moment?: string | undefined;
    time?: number | undefined;
}

/** Model for NetworkMoments */
export interface INetworkMoments {
    duration: number;
    moment?: string | undefined;
    time?: number | undefined;
}