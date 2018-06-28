import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceSubnetworkComponent } from './trace-subnetwork.component';

describe('TraceComponent', () => {
  let component: TraceSubnetworkComponent;
  let fixture: ComponentFixture<TraceSubnetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceSubnetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceSubnetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
