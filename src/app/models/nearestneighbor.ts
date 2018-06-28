export class NearestNeighbor implements INearestNeighbor {
    count?: number | undefined;
    costNetworkAttributeName?: string | undefined;
    nearestCategories?: string[] | undefined;
    nearestAssets?: string[] | undefined;
}

export interface INearestNeighbor {
    count?: number | undefined;
    costNetworkAttributeName?: string | undefined;
    nearestCategories?: string[] | undefined;
    nearestAssets?: string[] | undefined;
}