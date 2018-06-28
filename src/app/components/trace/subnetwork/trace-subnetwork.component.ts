import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilityNetworkService } from '../../../services/utilitynetwork.service';

@Component({
  selector: 'app-trace-subnetwork',
  templateUrl: './trace-subnetwork.component.html',
  styleUrls: ['./trace-subnetwork.component.css']
})
export class TraceSubnetworkComponent {

  constructor(private _utilityNetworkService: UtilityNetworkService) { }

  @Output() traceComplete = new EventEmitter<any>();
  @Output() traceBegan = new EventEmitter<boolean>()
  @Input() domainNetwork: string;
  @Input() tier: string;
  @Input() subNetwork: string;

  public btnDisabled(): boolean {
    return this.domainNetwork === undefined || 
      this.tier === undefined ||
      this.subNetwork === undefined;
  }

  public executeTrace(): void {
    this.traceBegan.emit(true);
    this._utilityNetworkService.subnetworkTrace(this.domainNetwork, this.tier , this.subNetwork)
            .then(results =>  this.traceComplete.emit(results))
            .catch(err=> console.log(err));

  }
}
