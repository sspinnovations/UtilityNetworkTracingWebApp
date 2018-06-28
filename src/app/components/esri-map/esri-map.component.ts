import * as Constants from '../../models/constants';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import { UtilityNetworkService } from '../../services/utilitynetwork.service';
import { AuthService } from '../../services/auth.service';
import { FeatureService } from '../../services/feature.service';
import { environment } from '../../../environments/environment';
import { TraceResults } from '../../models/traceresults';
import { GeometryType, PhaseType, TraceType } from '../../models/enums';
import { FeatureTrace } from '../../models/featuretrace';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent {

  constructor(
    private _utilityNetworkService: UtilityNetworkService,
    private _authService: AuthService,
    private _featureService: FeatureService) { }

  // Private vars with default values
  private _zoom = 14;
  private _center = [41.7508, 88.1535];
  private _basemap = 'streets';
  private _itemId: string;
  private _mapView: any;
  private _selectionSize: number = 4;
  private _defaultSpatialRefrence: any = {
    "wkid": 102100,
    "latestWkid": 3857
  };
  private _domainNetwork: string;
  private _tier: string;
  private _traceType: TraceType;
  private _phaseType: PhaseType;
  private _lastMapPoint: any;
  set lastMapPoint(point: any) {
    this._lastMapPoint = point;
  }
  
  get lastMapPoint(): any {
    return this._lastMapPoint;
  }

  private _objectCount: number = 100;

  private _graphicClass: any;

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: any[]) {
    this._center = center;
  }

  get center(): any[] {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  @Input()
  set loadFromUN(loadFromUN: boolean) {
    if (loadFromUN)
      this.loadMapFromUN();
  }

  @Input()
  set domainNetwork(domainNetwork: string) {
    this._domainNetwork = domainNetwork;
  }

  get domainNetwork(): string {
    return this._domainNetwork;
  }

  @Input()
  set tier(tier: string) {
    this._tier = tier;
  }

  get tier(): string {
    return this._tier;
  }

  @Input()
  set subNetwork(subNetwork: string) {
    if (subNetwork !== undefined)
      this.loadGraphicsFromSubnetwork(subNetwork);
  }

  @Input()
  set traceResults(traceResults: TraceResults) {
    if (traceResults !== undefined) {
      this.highlightTraceResults(traceResults);
      this.displayTraceResults(traceResults);
    }
  }

  @Input()
  set traceType(traceType: TraceType) {
    this._traceType = traceType;
    this.changeCursorStyle(traceType);
  }

  get traceType(): TraceType {
    return this._traceType;
  }

  @Input()
  set phaseType(phaseType: PhaseType) {
    this._phaseType = phaseType;
  }

  get phaseType(): PhaseType {
    return this._phaseType;
  }

  @Output() mapLoaded = new EventEmitter<boolean>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() traceComplete = new EventEmitter<TraceResults>();
  @Output() traceBegan = new EventEmitter<boolean>();

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  private loadMapFromUN() {
    const instance = this;
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/layers/MapImageLayer",
      "esri/WebMap",
      "esri/identity/IdentityManager",
      "esri/widgets/LayerList",
      "esri/layers/GraphicsLayer",
      "esri/Graphic"
    ])
      .then(([Map, MapView, FeatureLayer, MapLayer, WebMap, IdentityManager, Toc, GraphicsLayer, Graphic]) => {

        instance._graphicClass = Graphic;
        IdentityManager.registerToken({ server: instance._utilityNetworkService.featureServiceUrl, token: instance._authService.token() });
        IdentityManager.registerToken({ server: environment.portalBaseURL, token: instance._authService.token() });

        let webmap = new WebMap({
          portalItem: {
            id: instance._utilityNetworkService.itemId,
            portal: {
              url: environment.portalBaseURL
            }
          }
        });

        instance._mapView = new MapView({ map: webmap, container: instance.mapViewEl.nativeElement, center: this.center, zoom: this.zoom});
        instance._mapView.byId = layerId => instance._mapView.map.layers.find(l => l.layerId == layerId);

        instance._mapView.when(() => {
          // All the resources in the MapView and the map have loaded. Now execute additional processes
          instance.mapLoaded.emit(true);

          instance.setupClickHandler(instance);

          /*
          const snappingManager = new SnappingManager({
            alwaysSnap: true,
            map: webmap
          });*/
        }, err => {
          console.error(err);
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  private setupClickHandler(instance) {
    instance._mapView.on("click", function (event) {
      instance._mapView.hitTest(event).then(function (response) {
        const results = response.results;
        const isValidTraceType = instance._traceType !== undefined && instance._traceType !== TraceType.Unknown;
        if (results.length && results[results.length - 1].graphic && isValidTraceType) {
          let selectedFeature = null;
          for (var i = 0; i < results.length; i++) {
            const isLineOrPoint = results[i].graphic.geometry.type === GeometryType.Polyline
              || results[i].graphic.geometry.type === GeometryType.Point;

            if (results[i].graphic.attributes !== null
              && results[i].graphic.attributes.globalid != null
              && isLineOrPoint) {
              selectedFeature = results[i];
              break;
            }
          }

          if (selectedFeature === null)
            return;

          const selectedFeatureGlobalId = selectedFeature.graphic.attributes.globalid;
          const selectedFeatureGeometryType = selectedFeature.graphic.geometry.type;

          instance.traceBegan.emit(true);
          instance.executeTrace(selectedFeatureGlobalId, selectedFeatureGeometryType, instance._traceType)
            .then(traceResults => {
              instance.traceComplete.emit(traceResults);
              instance.lastMapPoint = response.screenPoint.mapPoint;
            })
            .catch(err => console.log(err));
        }
      });
    });
  }

  private executeTrace(globalId: string, geometryType: GeometryType, traceType: TraceType): Promise<TraceResults> {
    const featureTrace = new FeatureTrace({
      globalId: globalId,
      geometryType: geometryType,
      traceType: traceType,
      domainNetwork: this.domainNetwork,
      tierName: this.tier,
      phaseType: this.phaseType
    });
    return new Promise((resolve, reject) => {
      resolve(this._utilityNetworkService.traceFromStartingPoint(featureTrace));
    });
  }

  private changeCursorStyle(traceType: TraceType): void {
    if (this._mapView === undefined)
      return;

    if (traceType == TraceType.Downstream || traceType == TraceType.Upstream) {
      this._mapView.surface.style.cursor = "crosshair";
      this._mapView.popupManager.enabled = false;
    } else {
      this._mapView.surface.style.cursor = "default";
      this._mapView.popupManager.enabled = true;
    }
  }

  private loadGraphicsFromSubnetwork(subNetwork: string): void {
    this._mapView.graphics = []
    this._utilityNetworkService.query(this._utilityNetworkService.subnetLineLayerId, "SUBNETWORKNAME = '" + subNetwork + "'", null, undefined)
      .then(rowsJson => {
        let featureLayer = this._mapView.byId(this._utilityNetworkService.subnetLineLayerId);
        let polylineGraphic = this.graphic('line', rowsJson.features[0].geometry);
        this._mapView.graphics.add(polylineGraphic);
        this._mapView.then(e => this._mapView.goTo(polylineGraphic.geometry));
      })
      .catch(err => console.log("Failed to highlight subnetwork. Make sure you run update subnetworks to create the subnetlines.  "))
  }

  //get a graphic from geometry helper function
  private graphic(type: string, geometry: any, color: any = [136, 220, 232, 0.7]): any {
    let symbol;
    let geometryObject;

    switch (type) {
      case "point":

        symbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: color,
          size: this._selectionSize,
          outline: { // autocasts as new SimpleLineSymbol()
            color: color,
            width: this._selectionSize
          }
        }

        geometryObject = {
          type: "point",
          x: geometry.x,
          y: geometry.y,
          spatialReference: this._defaultSpatialRefrence
        }

        break;
      case "line":

        symbol = {
          type: "simple-line", // autocasts as SimpleLineSymbol()
          color: color,
          width: this._selectionSize
        };

        geometryObject = {
          type: "polyline",
          paths: geometry.paths,
          spatialReference: this._defaultSpatialRefrence
        }
        break;
      case "polygon":

        symbol = {
          type: "simple-fill", // autocasts as new SimpleFillSymbol()
          color: color,
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: this._selectionSize
          }
        };


        geometryObject = {
          type: "polygon",
          rings: geometry.rings,
          spatialReference: this._defaultSpatialRefrence
        }

    }

    return new this._graphicClass({
      geometry: geometryObject,
      symbol: symbol
    });
  }

  private highlightTraceResults(traceResults: any): void {
    this.loading.emit(true);
    const traceStart: number = new Date().getTime();

    let traceTime = (new Date().getTime() - traceStart);
    let drawingTime;
    //record trace time
    console.log("Trace time: " + traceTime + " ms");
    let drawingStartTime = new Date().getTime();
    let promises = [];
    for (let layerId in traceResults.layers) {
      let layerObj = traceResults.layers[layerId];
      let subOids = this.createGroupedArray(layerObj.objectIds, this._objectCount);
      subOids.forEach(oidGroup => promises.push(this._utilityNetworkService.query(layerId, "1=1", layerObj, oidGroup.join(","))));
    }
    //query all layers at once and wait until all results come in at
    Promise.all(promises)
      .then((rows: any) => {
        this._mapView.graphics = [];
        let graphics = [];
        let geometries = [];
        let featureLayer = this._mapView.byId(rows.layerId);
        for (let featureSet of rows) {
          let layerObj = featureSet.obj;
          if (featureSet.features != undefined)
            featureSet.features.forEach(g => graphics.push(this.graphic(layerObj.type, g.geometry)))
        }

        drawingTime = (new Date().getTime() - drawingStartTime)
        console.log("Drawing time: " + drawingTime + " ms");

        this._mapView.graphics.addMany(graphics);
        console.log("Trace completed successfully. Trace time: " + traceTime + " ms, Drawing Time: " + drawingTime + " ms");

        // TODO: figure out how to zoom
        //this._mapView.then(e => this._mapView.goTo(polylineGraphic.geometry));

        this.loading.emit(false);
      })
      .catch(err => console.log("Error while parsing trace results"))
  }

  private displayTraceResults(traceResults: TraceResults): void {
    let instance = this;
    let observables = new Array();
    traceResults.layers.forEach(function (layer, index) {
      // Note: index represents layerId
      const observable = instance._featureService
        .getFeatures(index, Constants.SDEDefault, layer.objectIds)
        .pipe(map(r => {
          return { response: r, layerId: index }
        }));
      observables.push(observable);
    });

    forkJoin(observables)
    .pipe(map(results => {
        this.displayPopup(results);
      }));
  }

  private displayPopup(results: any): void {
    let popupTemplate = undefined;
    if (this._mapView.popup.features.length > 0)
      popupTemplate = this._mapView.popup.features[0].popupTemplate;

    const graphics = new Array();
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].response.features.length; j++) {
        const feature = results[i].response.features[j];
        const fields = results[i].response.fields;
        let featureLayer = this._mapView.byId(results[i].layerId);
        const popupTemplate = {
          content: this.getPopupContent(fields),
          "title": featureLayer.title
        };
        const graphic = new this._graphicClass({
          attributes: feature.attributes,
          popupTemplate: popupTemplate
        });
        graphics.push(graphic);
      }
    }

    this._mapView.popup.visible = true;
    this._mapView.popupManager.enabled = true;
    this._mapView.popup.open({
      features: graphics,
      location: this.lastMapPoint
    });
    this._mapView.popupManager.enabled = false;
  }

  private getPopupContent(fields: any): any {
    const fieldInfos = [];

    fields.forEach(function (field) {
      const fieldInfo = {
        fieldName: field.name,
        visible: true,
        label: field.alias
      };

      switch (field.type) {
        case "date":
          fieldInfo["format"] = { dateFormat: "short-date" };
          break;
        case "small-integer":
        case "integer":
          fieldInfo["format"] = {
            places: 0,
            digitSeparator: true
          };
          break;
        case "double":
          fieldInfo["format"] = {
            places: 2,
            digitSeparator: true
          }
        case "oid":
          break;
        case "string":
          break;
        case "single":
          break;
        default:
          console.log("Field " + field.alias + " type not handled: " + field.type);
          break;
      }

      fieldInfos.push(fieldInfo);
    }, fields);

    const content = [{
      type: "fields",
      fieldInfos: fieldInfos
    }];

    return content;
  }

  private createGroupedArray(arr: any[], chunkSize: number): any {
    let groups = [], i;
    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  }
}