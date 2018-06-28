import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { UtilityNetworkService } from '../../services/utilitynetwork.service';
import { UNItem } from '../../models/unitem';

@Component({
  selector: 'app-subnetworks',
  templateUrl: './subnetworks.component.html',
  styleUrls: ['./subnetworks.component.css']
})
export class SubnetworksComponent {

  constructor(private _utilityNetworkService: UtilityNetworkService,
            private _zone: NgZone) { }

  private _tier: string;

  public snItems: UNItem[];
  public snSelection: string;

  @Input() 
  set tier(tier: string) {
    if (tier !== undefined) {
      this.loadSubNetworks(tier);
      this._tier = tier;
    }
  }

  get tier(): string {
    return this._tier;
  }

  @Input() domainNetwork: string;

  @Output() selection = new EventEmitter<string>();

  public selectionMade(): void {
    this.selection.emit(this.snSelection);
  }

  private loadSubNetworks(tierName: string): void {
    let dn = this.domainNetwork;
    if (dn === undefined)
      dn = this._utilityNetworkService.domainNetwork;

    this._utilityNetworkService.getSubnetworks(dn, tierName)
      .then((response: any) => {
        this.snItems = new Array();
          response.features.forEach((feature) => {
            for (let propt in feature.attributes) {
              let item = new UNItem();
                if (propt.toUpperCase() === "SUBNETWORKNAME") {
                item.title = feature.attributes[propt];
                this.snItems.push(item);
                }
            }
        });

        if (this.snItems.length > 0) {
          this.snSelection = this.snItems[0].title;
          this.selectionMade();
        }

      });
  }
}
