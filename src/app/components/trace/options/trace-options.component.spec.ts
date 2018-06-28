import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceOptionsComponent } from './trace-options.component';

describe('TraceOptionsComponent', () => {
  let component: TraceOptionsComponent;
  let fixture: ComponentFixture<TraceOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
