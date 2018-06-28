import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { PortalService } from '../../services/portal.service';
import { UNItem } from '../../models/unitem';
import { UtilityNetworkService } from '../../services/utilitynetwork.service';

@Component({
  selector: 'app-domainnetworks',
  templateUrl: './domainnetworks.component.html',
  styleUrls: ['./domainnetworks.component.css'],
  providers: [PortalService]
})
export class DomainnetworksComponent implements OnInit, OnChanges {

  constructor(private _portalService: PortalService,
            private _utilityNetworkService: UtilityNetworkService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId']) {
      if (this.itemId === undefined)
        return;

        this.populateDomainNetworks();
    }
  }

  @Output() selection = new EventEmitter<string>();
  @Output() unLoaded = new EventEmitter<any>();
  @Output() loading = new EventEmitter<boolean>();
  @Input() itemId: string;

  public dnItems: UNItem[];
  public dnSelection: string;

  private populateDomainNetworks(): void {
    this.loading.emit(true);
    this._portalService.item_get(this.itemId).subscribe(resp => {
        this.handleResponse(resp);
    });
  }

  public selectionMade(): void {
    this._utilityNetworkService.domainNetwork = this.dnSelection;
    this.selection.emit(this.dnSelection);
  }

  private async handleResponse(itemData: any): Promise<any> {
    let serviceUrl = itemData.operationalLayers[0].url;
    let arrayService = serviceUrl.split("/")
    arrayService.length--;       
    serviceUrl = arrayService.join("/");
    this._utilityNetworkService.featureServiceUrl = serviceUrl;   
    this._utilityNetworkService.itemId = this.itemId;
    
    //load utility network in memory
    await this._utilityNetworkService.load();

    this.dnItems = new Array();

    this._utilityNetworkService.dataElement.domainNetworks.forEach(element => {
      let unItem = new UNItem();
      unItem.id = element.domainNetworkName;
      unItem.title = element.domainNetworkName;
      this.dnItems.push(unItem);
    });

    this.unLoaded.emit();
    this.loading.emit(false);
  }
}
