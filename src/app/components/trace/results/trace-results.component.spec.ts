import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceResultsComponent } from './trace-results.component';

describe('TraceResultsComponent', () => {
  let component: TraceResultsComponent;
  let fixture: ComponentFixture<TraceResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
