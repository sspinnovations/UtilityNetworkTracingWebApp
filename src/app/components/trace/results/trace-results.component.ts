import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TraceResults } from '../../../models/traceresults';

@Component({
  selector: 'app-trace-results',
  templateUrl: './trace-results.component.html',
  styleUrls: ['./trace-results.component.css']
})
export class TraceResultsComponent implements OnInit {

  @Input()
  set traceResults(traceResults: TraceResults) {
    if (traceResults !== undefined)
      this.updateCustomerCount(traceResults);
  }

  public customerCount: number;

  constructor() {
    this.customerCount = 0;
   }

  ngOnInit() {
  }

  private updateCustomerCount(traceResults: TraceResults): void {
    let customerCount = 0;
    traceResults.traceResults.features.forEach(function (feature) {
      if (feature.assetGroupCode === 11 && feature.assetTypeCode === 403)
        customerCount++;
    });
    this.customerCount = customerCount;
  }

}
