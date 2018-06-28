import * as Constants from "../../../models/constants";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Phase } from "../../../models/phase";
import { PhaseType } from "../../../models/enums";

@Component({
  selector: 'app-trace-options',
  templateUrl: './trace-options.component.html',
  styleUrls: ['./trace-options.component.css']
})
export class TraceOptionsComponent implements OnInit {

  @Input() phaseType: PhaseType;
  @Output() phaseTypeChange = new EventEmitter<PhaseType>();

  public phaseA: Phase;
  public phaseB: Phase;
  public phaseC: Phase;

  constructor() { 
    this.phaseA = new Phase({type: PhaseType.A, isActive: false});
    this.phaseB = new Phase({type: PhaseType.B, isActive: false});
    this.phaseC = new Phase({type: PhaseType.C, isActive: false});
  }

  ngOnInit() {
  }

  public togglePhase(btn: HTMLElement, phase: Phase): void {
    // Always toggle isActive property when button is pressed
    phase.isActive = !phase.isActive;
    if (phase.isActive) {
      btn.setAttribute("style", Constants.ActiveButtonColor);
      this.phaseType += phase.type;
    }
    else {
      btn.setAttribute("style", "");
      this.phaseType -= phase.type;
    }
    this.phaseTypeChange.emit(this.phaseType);
  }

  public isPhaseAActive(): boolean {
    return true;
  }

}
