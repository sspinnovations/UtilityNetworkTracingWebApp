import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PortalService } from '../../services/portal.service';
import { UNItem } from '../../models/unitem';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [PortalService]
})
export class ItemsComponent implements OnInit {

  constructor(private _authService: AuthService,
            private _portalService: PortalService) { }

  public webMaps: UNItem[];
  public mapSelection: string;

  @Output() selection = new EventEmitter<string>();

  ngOnInit() {
    this.loadItems();
  }

  private loadItems(): void {
    this._portalService.items(100).subscribe(
      resp => {
          this.webMaps = this._portalService.webMaps_extract(resp);
          this.mapSelection = this.webMaps[0].id;
          this.selection.emit(this.mapSelection);
      });
  }

  public selectionMade(): void {
    if (this.mapSelection !== undefined)
      this.selection.emit(this.mapSelection);
  }

}
