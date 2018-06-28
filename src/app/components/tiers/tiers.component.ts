import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilityNetworkService } from '../../services/utilitynetwork.service';
import { UNItem } from '../../models/unitem';

@Component({
  selector: 'app-tiers',
  templateUrl: './tiers.component.html',
  styleUrls: ['./tiers.component.css']
})
export class TiersComponent  {

  constructor(private _utilityNetworkService: UtilityNetworkService) { }

  public tierItems: UNItem[];
  public tierSelection: string;

  @Input() 
  set domainNetwork(domainNetwork: string) {
    if (domainNetwork !== undefined)
      this.loadTiers(domainNetwork);
  }

  @Output() selection = new EventEmitter<string>();

  public selectionMade(): void {
    if (this.tierSelection != null && this.tierSelection != 'null')
      this.selection.emit(this.tierSelection);
  }

  private loadTiers(dn: string): void {
    let dnObject = this._utilityNetworkService.getDomainNetwork(dn);
    this.tierItems = new Array();
    dnObject.tiers.forEach(element => {
      let item = new UNItem();
      item.id = element.tierID;
      item.title = element.name;
      this.tierItems.push(item);
    });
  }

}
