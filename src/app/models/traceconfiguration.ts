import { Functions } from './functions';
import { NearestNeighbor } from './nearestneighbor';
import { TraceOuputFilter } from './traceoutputfilter';
import { TraceOutputCondition } from './traceoutputcondition';
import { TracePropagator } from './tracepropagator';
import { TraceFunctionBarrier } from './tracefunctionbarrier';
import { TraceConditionBarrier } from './traceconditionbarrier';
import { TraceConfigurationTraversabilityScope } from './enums';

export class TraceConfiguration implements ITraceConfiguration {
    includeContainers: boolean;
    includeContent: boolean;
    includeStructures: boolean;
    includeBarriers: boolean;
    validateConsistency: boolean;
    domainNetworkName: string;
    tierName: string;
    targetTierName: string;
    subnetworkName: string;
    diagramTemplateName: string;
    shortestPathNetworkAttributeName: string;
    filterBitsetNetworkAttributeName: string;
    traversabilityScope: TraceConfigurationTraversabilityScope;
    conditionBarriers: TraceConditionBarrier[];
    functionBarriers: TraceFunctionBarrier[];
    arcadeExpressionBarrier?: string | undefined;
    filterBarriers?: string[] | undefined;
    filterFunctionBarriers?: string[] | undefined;
    filterScope: string;
    functions?: Functions[] | undefined;
    nearestNeighbor?: NearestNeighbor | undefined;
    outputFilters?: TraceOuputFilter[] | undefined;
    outputConditions?: TraceOutputCondition[] | undefined;
    propagators?: TracePropagator[] | undefined;
}

export interface ITraceConfiguration {
    includeContainers: boolean;
    includeContent: boolean;
    includeStructures: boolean;
    includeBarriers: boolean;
    validateConsistency: boolean;
    domainNetworkName: string;
    tierName: string;
    targetTierName: string;
    subnetworkName: string;
    diagramTemplateName: string;
    shortestPathNetworkAttributeName: string;
    filterBitsetNetworkAttributeName: string;
    traversabilityScope: TraceConfigurationTraversabilityScope;
    conditionBarriers: TraceConditionBarrier[];
    functionBarriers: TraceFunctionBarrier[];
    arcadeExpressionBarrier?: string | undefined;
    filterBarriers?: string[] | undefined;
    filterFunctionBarriers?: string[] | undefined;
    filterScope: string;
    functions?: Functions[] | undefined;
    nearestNeighbor?: NearestNeighbor | undefined;
    outputFilters?: TraceOuputFilter[] | undefined;
    outputConditions?: TraceOutputCondition[] | undefined;
    propagators?: TracePropagator[] | undefined;
}