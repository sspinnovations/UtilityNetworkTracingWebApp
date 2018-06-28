import { Component, OnInit } from '@angular/core';
import { TraceResults } from '../../models/traceresults';
import { TraceType, PhaseType } from '../../models/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public mapCenter: any = [-88.16000905072558, 41.793188390060784];
  public basemapType: string = 'satellite';
  public mapZoomLevel: number = 14;
  public webMapItemId: string;
  public loadMap: boolean = false;
  public selectedDomainNetwork: string;
  public selectedTier: string;
  public selectedSubnetwork: string;
  public loading: boolean = false;
  public traceResults: any;
  public traceType: TraceType = TraceType.Unknown;
  public phaseType: PhaseType = 0;

  ngOnInit() {
    
  }

  public appLoading(event: boolean): void {
    this.loading = event;
  }

  public mapLoading(event: boolean): void {
    this.loading = event;
  }

  public mapLoadedEvent(status: boolean): void {
    console.log('The map loaded: ' + status);
  }

  public webMapSelection(event: string): void {
    this.webMapItemId = event;
  }

  public domainNetworkSelection(event: string): void {
    this.selectedDomainNetwork = event;
  }

  public utilityNetworkLoaded(event: any): void {
    this.loadMap = true;
  }

  public tierSelection(event: string): void {
    this.selectedTier = event;
  }

  public snSelection(event: string): void {
    this.selectedSubnetwork = event;
  }

  public traceResultsBegan(event: boolean): void {
    this.loading = true;
  }

  public traceResultsReady(event: TraceResults): void {
    this.traceResults = event;
    this.loading = false;
  }

  public toggleTraceType(event: TraceType): void {
    this.traceType = event;
  }

  public changePhaseType(event: PhaseType): void {
    this.phaseType = event;
  }

  public displayTraceOptions(): boolean {
    if (this.traceType === TraceType.Downstream || this.traceType === TraceType.Upstream)
      return true;
    return false;
  }

  public displayTraceResults(): boolean {
    return this.traceResults && this.displayTraceOptions();
  }
}
