import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnetworksComponent } from './subnetworks.component';

describe('SubnetworksComponent', () => {
  let component: SubnetworksComponent;
  let fixture: ComponentFixture<SubnetworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnetworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
