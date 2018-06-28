export enum GeometryType {
    Polygon = "polygon",
    Polyline = "polyline",
    Point = "point"
}

export enum PhaseType {
    None = 0,
    A = 4,
    B = 2,
    C = 1,
    AB = 6,
    AC = 5,
    ABC = 7
}

export enum TraceType {
    Upstream = 'upstream', 
    Downstream = 'downstream', 
    Connected = 'connected', 
    Subnetwork = 'subnetwork', 
    Unknown = 'unknown', 
    Loops = 'loops', 
    Shortestpath = 'shortestpath', 
    Subnetworkcontroller = 'subnetworkcontroller'
}

export enum TraceConditionBarrierType {
    NetworkAttribute = 'networkAttribute', 
    Category = 'category', 
}

export enum TraceConfigurationTraversabilityScope {
    Junctions = 'junctions', 
    Edges = 'edges', 
    JunctionsAndEdges = 'junctionsAndEdges', 
}

export enum TraceFunctionBarrierFunctionType {
    Add = 'add', 
    Subtract = 'subtract', 
    Average = 'average', 
    Count = 'count', 
    Min = 'min', 
    Max = 'max', 
}

export enum TraceFunctionBarrierOperator {
    Equal = 'equal', 
    NotEqual = 'notEqual', 
}

export enum TraceOutputConditionType {
    NetworkAttribute = 'networkAttribute', 
    Category = 'category', 
}

export enum TraceLocationsTraceLocationType {
    StartingPoint = 'startingPoint', 
    Barrier = 'barrier', 
}