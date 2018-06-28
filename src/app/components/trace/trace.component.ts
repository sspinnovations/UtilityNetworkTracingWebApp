import * as Constants from "../../models/constants";
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TraceType } from '../../models/enums';

@Component({
  selector: 'app-trace',
  templateUrl: './trace.component.html',
  styleUrls: ['./trace.component.css']
})
export class TraceComponent implements OnInit {

  @Input() traceType: TraceType;
  @Output() traceTypeChange = new EventEmitter<TraceType>();

  constructor() { }

  ngOnInit() {
  }

  public toggleUpstream(btnDownstream: HTMLElement, btnUpstream: HTMLElement): void {
    if (this.traceType !== TraceType.Upstream) {
      btnUpstream.setAttribute("style", Constants.ActiveButtonColor);
      btnDownstream.setAttribute("style", "");
      this.traceTypeChange.emit(TraceType.Upstream);
    } else {
      btnUpstream.setAttribute("style", "");
      this.traceTypeChange.emit(TraceType.Unknown);
    }
  }

  public toggleDownstream(btnDownstream: HTMLElement, btnUpstream: HTMLElement): void {
    if (this.traceType !== TraceType.Downstream) {
      btnDownstream.setAttribute("style", Constants.ActiveButtonColor);
      btnUpstream.setAttribute("style", "");
      this.traceTypeChange.emit(TraceType.Downstream);
    } else {
      btnDownstream.setAttribute("style", "");
      this.traceTypeChange.emit(TraceType.Unknown);
    }
  }

}
