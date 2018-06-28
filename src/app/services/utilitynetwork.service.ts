import * as Constants from "../models/constants";
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { TraceService } from './trace.service';
import { GeometryType, PhaseType, TraceType, TraceConfigurationTraversabilityScope, TraceLocationsTraceLocationType } from '../models/enums';
import { FeatureTrace } from '../models/featuretrace';
import { TraceResultFeature } from '../models/traceresultfeature';
import { TraceResults, TraceResults2 } from '../models/traceresults';
import { TraceConfiguration } from '../models/traceconfiguration';
import { NearestNeighbor } from '../models/nearestneighbor';
import { TraceLocations } from '../models/tracelocations';
import { TracePayload } from '../models/tracepayload';

@Injectable()
export class UtilityNetworkService {

    constructor(private _authService: AuthService, private _traceService: TraceService) { }

    public featureServiceUrl: string;
    public featureServiceJson: any;
    public dataElement: any;
    public layerDefinition: any;
    public itemId: string;
    public subnetLineLayerId: string;
    public domainNetwork: string;
    public GraphicClass: any;
    private token: string = this._authService.token();

    ///first function one should call after creating an instance of a utility network
    public load = async (): Promise<any> => {
        let thisObj = this;
        //pull the feature service definition
        let featureServiceJsonResult: any = await makeRequest({ method: 'POST', url: thisObj.featureServiceUrl, params: { f: "json", token: thisObj.token } });
        this.featureServiceJson = featureServiceJsonResult;
        //check to see if the feature service has a UN
        if (this.featureServiceJson.controllerDatasetLayers != undefined) {
            let layerId = this.featureServiceJson.controllerDatasetLayers.utilityNetworkLayerId;
            let queryDataElementUrl = thisObj.featureServiceUrl + "/queryDataElements";
            let layers = "[" + layerId + "]"

            let postJson: any = {
                token: thisObj.token,
                layers: layers,
                f: "json"
            }
            //pull the data element definition of the utility network now that we have the utility network layer
            let undataElement: any = await makeRequest({ method: 'POST', url: queryDataElementUrl, params: postJson });

            //request the un layer defition which has different set of information
            let unLayerUrl = thisObj.featureServiceUrl + "/" + layerId;
            postJson = {
                token: thisObj.token,
                f: "json"
            }
            let unLayerDef = await makeRequest({ method: 'POST', url: unLayerUrl, params: postJson });

            thisObj.dataElement = undataElement.layerDataElements[0].dataElement;
            thisObj.layerDefinition = unLayerDef
            thisObj.subnetLineLayerId = thisObj.getSubnetLineLayerId();
            return thisObj;
        }
        else
            throw ("No Utility Network found in this feature service");
    }


    //return the domainNetwork object.     
    public getDomainNetwork(domainNetworkName: string): any {

        for (let domainNetwork of this.dataElement.domainNetworks)
            if (domainNetwork.domainNetworkName === domainNetworkName) return domainNetwork;

    }
    //return the tier
    public getTier(domainNetworkName, tierName): any {
        for (let tier of this.getDomainNetwork(domainNetworkName).tiers)
            if (tier.name === tierName)
                return tier;
    }
    //query the subnetwokrs table 
    getSubnetworks(domainNetworkName, tierName) {
        let subnetworkTableUrl = this.featureServiceUrl + "/" + this.layerDefinition.systemLayers.subnetworksTableId + "/query";

        let postJson = {
            token: this.token,
            where: "DOMAINNETWORKNAME = '" + domainNetworkName + "' AND TIERNAME = '" + tierName + "'",
            outFields: "SUBNETWORKNAME",
            orderByFields: "SUBNETWORKNAME",
            returnDistinctValues: true,
            f: "json"
        }

        return makeRequest({ method: 'POST', url: subnetworkTableUrl, params: postJson });

    }

    //query that projects to webmercator. 
    public query(layerId: string, where: string, obj: any, objectids: any): any {
        let webMercSpatialReference = {
            "wkid": 102100,
            "latestWkid": 3857,
            "xyTolerance": 0.001,
            "zTolerance": 0.001,
            "mTolerance": 0.001,
            "falseX": -20037700,
            "falseY": -30241100,
            "xyUnits": 148923141.92838538,
            "falseZ": -100000,
            "zUnits": 10000,
            "falseM": -100000,
            "mUnits": 10000
        }

        let queryJson = {
            f: "json",
            token: this.token,
            outFields: "*",
            where: where,
            outSR: JSON.stringify(webMercSpatialReference)
        }

        if (objectids != undefined)
            queryJson['objectIds'] = objectids;
        queryJson['layerId'] = layerId
        return new Promise((resolve, reject) => {

            makeRequest({ method: 'POST', params: queryJson, url: this.featureServiceUrl + "/" + layerId + "/query" }).then(rowsJson => {
                rowsJson['obj'] = obj;
                resolve(rowsJson);
            }).catch(rej => reject("failed to query"));

        });
    }

    //get the terminal configuration using the id
    getTerminalConfiguration(terminalConfigurationId) {
        return this.dataElement.terminalConfigurations.find(tc => tc.terminalConfigurationId === terminalConfigurationId);
    }

    //get the subenetline layer
    getSubnetLineLayerId() {

        //esriUNFCUTSubnetLine

        let domainNetworks = this.dataElement.domainNetworks;

        for (let i = 0; i < domainNetworks.length; i++) {
            let domainNetwork = domainNetworks[i];
            //only search edgeSources since subnetline is a line
            for (let j = 0; j < domainNetwork.edgeSources.length; j++)
                if (domainNetwork.edgeSources[j].utilityNetworkFeatureClassUsageType === "esriUNFCUTSubnetLine")
                    return domainNetwork.edgeSources[j].layerId;
        }

    }

    //return the asset type 
    getAssetType(layerId, assetGroupCode, assetTypeCode) {

        let domainNetworks = this.dataElement.domainNetworks;
        let layerObj = undefined;

        for (let i = 0; i < domainNetworks.length; i++) {
            let domainNetwork = domainNetworks[i];
            for (let j = 0; j < domainNetwork.junctionSources.length; j++)
                if (domainNetwork.junctionSources[j].layerId == layerId) {
                    let assetGroup = domainNetwork.junctionSources[j].assetGroups.find(ag => ag.assetGroupCode === assetGroupCode);
                    if (assetGroup instanceof Object) {
                        let assetType = assetGroup.assetTypes.find(at => at.assetTypeCode === assetTypeCode);
                        assetType.assetGroupName = assetGroup.assetGroupName;
                        assetType.utilityNetworkFeatureClassUsageType = domainNetwork.junctionSources[j].utilityNetworkFeatureClassUsageType;
                        if (assetType instanceof Object) return assetType;
                    }
                }

            for (let j = 0; j < domainNetwork.edgeSources.length; j++)
                if (domainNetwork.edgeSources[j].layerId == layerId) {
                    let assetGroup = domainNetwork.edgeSources[j].assetGroups.find(ag => ag.assetGroupCode === assetGroupCode);
                    if (assetGroup instanceof Object) {
                        let assetType = assetGroup.assetTypes.find(at => at.assetTypeCode === assetTypeCode);
                        assetType.assetGroupName = assetGroup.assetGroupName;
                        assetType.utilityNetworkFeatureClassUsageType = domainNetwork.edgeSources[j].utilityNetworkFeatureClassUsageType;
                        if (assetType instanceof Object) return assetType;
                    }
                }
        }

        return undefined;
    }

    //return layer by type
    getLayer(utilityNetworkUsageType) {

        let domainNetworks = this.dataElement.domainNetworks;

        for (let i = 0; i < domainNetworks.length; i++) {
            let domainNetwork = domainNetworks[i];

            for (let j = 0; j < domainNetwork.junctionSources.length; j++)
                if (domainNetwork.junctionSources[j].utilityNetworkFeatureClassUsageType === utilityNetworkUsageType)
                    return domainNetwork.junctionSources[j].layerId;
        }

        for (let i = 0; i < domainNetworks.length; i++) {
            let domainNetwork = domainNetworks[i];

            for (let j = 0; j < domainNetwork.edgeSources.length; j++)
                if (domainNetwork.edgeSources[j].utilityNetworkFeatureClassUsageType === utilityNetworkUsageType)
                    return domainNetwork.edgeSources[j].layerId;
        }
    }
    //return the first device layer
    getDeviceLayer() {

        return this.getLayer("esriUNFCUTDevice");

    }
    //return the first junction layer
    getJunctionLayer() {

        return this.getLayer("esriUNFCUTJunction");
    }
    //return the first Line layer
    getLineLayer() {
        return this.getLayer("esriUNFCUTLine");
    }

    //get layer id from Source Id used to map sourceid to layer id
    getLayerIdfromSourceId(sourceId) {
        let domainNetworks = this.dataElement.domainNetworks;
        let layerObj = undefined;

        for (let i = 0; i < domainNetworks.length; i++) {
            let domainNetwork = domainNetworks[i];
            for (let j = 0; j < domainNetwork.junctionSources.length; j++)
                if (domainNetwork.junctionSources[j].sourceId == sourceId) {
                    layerObj = { type: domainNetwork.junctionSources[j].shapeType, layerId: domainNetwork.junctionSources[j].layerId }
                    break;
                }

            for (let j = 0; j < domainNetwork.edgeSources.length; j++)
                if (domainNetwork.edgeSources[j].sourceId == sourceId) {
                    layerObj = { type: domainNetwork.edgeSources[j].shapeType, layerId: domainNetwork.edgeSources[j].layerId }
                    break;
                }
        }

        if (layerObj != undefined)
            layerObj.type = layerObj.type.replace("esriGeometry", "").toLowerCase();

        return layerObj;
    }

    //run connected Trace
    connectedTrace(startingPoints, barriers) {
        let traceLocations = [];
        //terminalId  percentAlong: 0

        startingPoints.forEach(s => traceLocations.push({ traceLocationType: "startingPoint", globalId: s.globalId, terminalId: s.terminalId }));
        barriers.forEach(s => traceLocations.push({ traceLocationType: "barrier", globalId: s.globalId, terminalId: s.terminalId }));

        return new Promise((resolve, reject) => {

            let subnetworkDef: TraceConfiguration = this.connectedTraceConfiguration();

            const tracePayload = new TracePayload({
                featureServiceUrl: this.featureServiceUrl,
                gdbVersion: Constants.SDEDefault,
                traceType: TraceType.Connected,
                traceLocations: traceLocations,
                traceConfiguration: subnetworkDef
            });

            this._traceService.trace(tracePayload)
                .subscribe(response => {
                    resolve(this.buildTraceResults(response));
                });
        });
    }

    private connectedTraceConfiguration(): TraceConfiguration {
        let subnetworkDef: TraceConfiguration = new TraceConfiguration();
        subnetworkDef.includeContainers = false;
        subnetworkDef.includeContent = false;
        subnetworkDef.includeStructures = false;
        subnetworkDef.includeBarriers = true;
        subnetworkDef.validateConsistency = true;
        subnetworkDef.domainNetworkName = '';
        subnetworkDef.tierName = '';
        subnetworkDef.targetTierName = '';
        subnetworkDef.subnetworkName = '';
        subnetworkDef.diagramTemplateName = '';
        subnetworkDef.shortestPathNetworkAttributeName = '';
        subnetworkDef.filterBitsetNetworkAttributeName = '';
        subnetworkDef.traversabilityScope = TraceConfigurationTraversabilityScope.JunctionsAndEdges;
        subnetworkDef.conditionBarriers = new Array();
        subnetworkDef.functionBarriers = new Array();
        subnetworkDef.arcadeExpressionBarrier = '';
        subnetworkDef.filterBarriers = new Array();
        subnetworkDef.filterFunctionBarriers = new Array();
        subnetworkDef.filterScope = TraceConfigurationTraversabilityScope.JunctionsAndEdges;
        subnetworkDef.functions = new Array();
        let nn = new NearestNeighbor();
        nn.count = -1;
        nn.costNetworkAttributeName = '';
        nn.nearestCategories = new Array();
        nn.nearestAssets = new Array();

        subnetworkDef.nearestNeighbor = nn;
        subnetworkDef.outputFilters = new Array();
        subnetworkDef.outputConditions = new Array();
        subnetworkDef.propagators = new Array();

        return subnetworkDef;
    }

    private buildTraceResults(featuresJson): TraceResults {
        //build the trace results so we group them by layerid
        let features: TraceResultFeature[] = new Array();
        let traceResults: TraceResults = new TraceResults();
        traceResults.layers = [];

        for (let f of featuresJson.traceResults.elements) {
            let layerObj = this.getLayerIdfromSourceId(f.networkSourceId);
            if (layerObj === undefined) continue;

            let layerId = layerObj.layerId;

            if (traceResults.layers[layerId] == undefined) traceResults.layers[layerId] = {};
            if (traceResults.layers[layerId].objectIds == undefined) traceResults.layers[layerId].objectIds = [];
            if (traceResults.layers[layerId].type == undefined) traceResults.layers[layerId].type = layerObj.type;

            traceResults.layers[layerId].objectIds.push(f.objectId);

            let feature = new TraceResultFeature(f);
            features.push(feature);
        }

        traceResults.traceResults = new TraceResults2({ features: features });

        return traceResults;
    }

    //run subnetwork Trace
    public subnetworkTrace(domainNetworkName, tierName, subnetworkName): any {
        return new Promise((resolve, reject) => {
            let tier = this.getTier(domainNetworkName, tierName);
            let subnetworkDef = tier.updateSubnetworkTraceConfiguration;
            subnetworkDef.subnetworkName = subnetworkName;
            const traceLocations: TraceLocations[] = new Array();

            const tracePayload = new TracePayload({
                featureServiceUrl: this.featureServiceUrl,
                gdbVersion: Constants.SDEDefault,
                traceType: TraceType.Subnetwork,
                traceLocations: traceLocations,
                traceConfiguration: subnetworkDef
            });

            this._traceService.trace(tracePayload)
                .subscribe(response => {
                    resolve(this.buildTraceResults(response));
                });
        });
    }

    public traceFromStartingPoint(featureTrace: FeatureTrace): Promise<TraceResults> {
        const tier = this.getTier(featureTrace.domainNetwork, featureTrace.tierName);
        const traceConfig = this.getTraceConfig(tier, featureTrace.phaseType);

        const traceLocation = this.getTraceLocation(featureTrace.globalId, featureTrace.geometryType);
        const traceLocations: TraceLocations[] = new Array();
        traceLocations.push(traceLocation);

        const tracePayload = new TracePayload({
            featureServiceUrl: this.featureServiceUrl,
            gdbVersion: Constants.SDEDefault,
            traceType: featureTrace.traceType,
            traceLocations: traceLocations,
            traceConfiguration: traceConfig
        });

        return new Promise((resolve, reject) => {
            this._traceService.trace(tracePayload)
                .subscribe(response => {
                    resolve(this.buildTraceResults(response));
                });
        });
    }

    private getTraceConfig(tier: any, phaseType: PhaseType): TraceConfiguration {
        const traceConfig = tier.updateSubnetworkTraceConfiguration;
        traceConfig.subnetworkName = "";
        traceConfig.functions = new Array();
        traceConfig.includeContainers = false;
        traceConfig.includeStructures = false;
        traceConfig.propagators = new Array();
        traceConfig.targetTierName = tier.tierName;

        const filterBarrier = {
            "combineUsingOr": false,
            "isSpecificValue": true,
            "name": "Phases Current",
            "operator": "doesNotIncludeAny",
            "type": "networkAttribute",
            "value": phaseType
        };
        traceConfig.filterBarrier = new Array();
        traceConfig.filterBarriers.push(filterBarrier);

        return traceConfig;
    }

    private getTraceLocation(globalId: string, geometryType: GeometryType): TraceLocations {
        let traceLocation = new TraceLocations();
        traceLocation.traceLocationType = TraceLocationsTraceLocationType.StartingPoint;
        traceLocation.globalId = globalId;

        if (geometryType === GeometryType.Polyline)
            traceLocation.percentAlong = 0;
        else if (geometryType === GeometryType.Point)
            traceLocation.terminalId = 1;

        return traceLocation;
    }

}


//Makes a request
function makeRequest(opts) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open(opts.method, opts.url);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            let context: any = this;
            if (context.status >= 200 && context.status < 300) {
                let jsonRes = xhr.response;
                if (typeof jsonRes !== "object") jsonRes = JSON.parse(xhr.response);
                resolve(jsonRes);
            } else {
                reject({
                    status: context.status,
                    statusText: xhr.statusText
                });
            }
        };

        //xhr.onerror =   err => reject({status: this.status, statusText: xhr.statusText}) ;
        xhr.onerror = err => reject(err);


        if (opts.headers)
            Object.keys(opts.headers).forEach(key => xhr.setRequestHeader(key, opts.headers[key]))

        let params = opts.params;
        // We'll need to stringify if we've been given an object
        // If we have a string, this is skipped.
        if (params && typeof params === 'object')
            params = Object.keys(params).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');

        xhr.send(params);
    });
}